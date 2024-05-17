import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { IUser } from 'src/types/newsuser';
import { ILike, Repository } from 'typeorm';
import { NewsUserCreateEntity } from '../database/entities/newscrud_route.entity';
import { NewsUserCreateDto } from './dto/create-newscrud_route.dto';
import { UpdateNewscrudRouteDto } from './dto/update-newscrud_route.dto';

@Injectable()
export class NewscrudRoutesService {
  constructor(
    @InjectRepository(NewsUserCreateEntity)
    private readonly userRepository: Repository<NewsUserCreateEntity>,
    private jwtService: JwtService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async create(createNewscrudRouteDto: NewsUserCreateDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        telephone_number: createNewscrudRouteDto.telephone_number,
      },
    });
    if (existUser)
      throw new BadRequestException(
        'Данный пользователь с таким номером телефона уже существует!',
      );

    const token = this.jwtService.sign({
      telephone_number: createNewscrudRouteDto.telephone_number,
    });
    const cachedData: any = await this.cacheManager.get(`${token}`);
    if (cachedData)
      throw new BadRequestException('На данный номер уже пришла ссылка');
    try {
      const phoneNumber = encodeURIComponent(
        createNewscrudRouteDto.telephone_number,
      );
      const message = encodeURIComponent(
        `Перейдите по ссылке для подтверждения регистрации: https://147.45.147.53/news-auth/confirm/${token}`,
      );
      const tokenSMS = this.configService.get('APP_SMS_BY');

      const url = `https://app.sms.by/api/v1/sendQuickSMS?token=${tokenSMS}&message=${message}&phone=${phoneNumber}&alphaname_id=5059`;

      await axios.get(url);
    } catch (error) {
      throw new BadGatewayException(error);
    }
    const userData: any = {
      telephone_number: createNewscrudRouteDto.telephone_number,
      fio: createNewscrudRouteDto.fio,
    };
    if (createNewscrudRouteDto.country) {
      userData.country = createNewscrudRouteDto.country;
    } else {
      userData.country = 'Belarus';
    }
    if (
      createNewscrudRouteDto.telephone_number == '+375297026403' ||
      createNewscrudRouteDto.telephone_number == '+375296146813'
    ) {
      userData.role = 'ADMIN';
    } else {
      userData.role = 'USER';
    }

    await this.cacheManager.set(`${token}`, userData);

    return { ...userData, token };
  }

  async findOne(telephone_number: string) {
    if (!telephone_number)
      return new UnauthorizedException('Данный токен невалидный');
    const phone_number = telephone_number.toString();
    return await this.userRepository.findOne({
      where: { telephone_number: ILike(`%${phone_number}%`) },
    });
  }

  async findAll(user: NewsUserCreateEntity) {
    if (user.role !== 'ADMIN')
      return new UnauthorizedException('Недостаточно прав');
    return await this.userRepository.find();
  }

  async validateUser(telephone_number: string, password: string) {
    const user: any = await this.findOne(telephone_number);
    if (!user)
      return new UnauthorizedException('Данного пользователя не существует');
    const userPassword = user.password;
    const passwordIsMatch = await argon2.verify(userPassword, password);
    if (user && passwordIsMatch) {
      return user;
    }
    return new UnauthorizedException('Имя телефона или пароль неверны');
  }

  async login(user: IUser) {
    if (user?.response?.statusCode) {
      return new UnauthorizedException('Имя телефона или пароль неверны');
    }
    return {
      user,
      token: this.jwtService.sign({
        telephone_number: user.telephone_number,
        id: user.id,
        fio: user.fio,
      }),
    };
  }

  async phoneProve(token: string) {
    const cachedData: any = await this.cacheManager.get(`${token}`);
    console.log(cachedData);

    if (cachedData) {
      const password = await this.generatePassword();
      const user = await this.userRepository.save({
        telephone_number: cachedData.telephone_number,
        password: await argon2.hash(password),
        fio: cachedData.fio,
        role: cachedData.role,
        country: cachedData.country,
        avatar_url:
          'https://kolen44-database-new-car-898e.twc1.net/database/avatars/noavatar',
        tg_id: '',
        site_url: '',
        company_name: '',
        payments: '',
        description: '',
        activity: 1,
      });
      await this.cacheManager.del(`${token}`);
      const message = encodeURIComponent(`Ваш пароль: ${password}`);
      const tokenSMS = this.configService.get('APP_SMS_BY');

      const url = `https://app.sms.by/api/v1/sendQuickSMS?token=${tokenSMS}&message=${message}&phone=${cachedData.telephone_number}&alphaname_id=5059`;
      try {
        await axios.get(url);
      } catch (error) {
        return new UnauthorizedException('Ошибка при отправки пароля клиенту');
      }

      return { user, token };
    } else {
      return new BadRequestException(
        'Время регистрации по номеру телефона истекло',
      );
    }
  }

  async update(phone_number: string, updateDto: UpdateNewscrudRouteDto) {
    const user: any = await this.findOne(phone_number);
    console.log(user);
    console.log(updateDto);
    if (!user || updateDto.password)
      return new UnauthorizedException(
        'Проверьте данные пользователя, так как сервер не может их найти.Так же сюда нельзя передавать пароль',
      );
    return this.userRepository.update(user.id, updateDto);
  }

  async updatePassword(phone_number: string) {
    const user: any = await this.findOne(phone_number);
    if (!user)
      throw new UnauthorizedException(
        'Проверьте данные пользователя, так как сервер не может их найти',
      );

    // Check if 5 days have passed since the last password update
    const lastPasswordUpdate = user.password_updated_at;
    const currentDate = new Date();
    const fiveDaysAgo = new Date(
      currentDate.getTime() - 5 * 24 * 60 * 60 * 1000,
    );

    if (lastPasswordUpdate && lastPasswordUpdate > fiveDaysAgo) {
      throw new BadRequestException(
        'Вы не можете изменить пароль чаще, чем раз в 5 дней',
      );
    }

    // Update the password and password_updated_at field
    const newPassword = this.generatePassword();
    const hashedPassword = await argon2.hash(newPassword);

    user.password = hashedPassword;
    user.password_updated_at = currentDate;

    await this.userRepository.update(user.id, user);
    const message = encodeURIComponent(`Ваш новый пароль: ${newPassword}`);
    const tokenSMS = this.configService.get('APP_SMS_BY');

    const url = `https://app.sms.by/api/v1/sendQuickSMS?token=${tokenSMS}&message=${message}&phone=${phone_number}&alphaname_id=5059`;
    try {
      await axios.get(url);
    } catch (error) {
      return new UnauthorizedException('Ошибка при отправки пароля клиенту');
    }
    return { message: 'Пароль успешно обновлен' };
  }

  async delete(phone_number: string) {
    const user: any = await this.findOne(phone_number);
    if (!user)
      return new UnauthorizedException(
        'Проверьте данные пользователя, так как сервер не может их найти',
      );
    try {
      await axios.delete(
        `https://kolen44-database-new-car-898e.twc1.net/database/avatars/${phone_number}`,
      );

      return this.userRepository.delete(user.id);
    } catch (error) {
      return new BadGatewayException(
        'Ошибка в блоке удаления и отправки запроса на базу данных',
      );
    }
  }

  generatePassword(): string {
    const length = 8;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }
}
