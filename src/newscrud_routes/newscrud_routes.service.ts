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
    if (existUser) {
      throw new BadRequestException(
        'Данный пользователь с таким номером телефона уже существует!',
      );
    }

    const token = this.jwtService.sign({
      telephone_number: createNewscrudRouteDto.telephone_number,
    });
    const unicalStringForProve: string =
      createNewscrudRouteDto.telephone_number.slice(6);
    const cachedData: any = await this.cacheManager.get(`${token}`);
    if (cachedData)
      throw new BadRequestException(
        'На данный номер уже пришла ссылка . Попробуйте через 5 минут',
      );
    try {
      const phoneNumber = encodeURIComponent(
        createNewscrudRouteDto.telephone_number,
      );
      const message = encodeURIComponent(
        `Перейдите по ссылке для подтверждения регистрации: https://webston.ru/auth/activated/${unicalStringForProve}`,
      );
      const tokenSMS = this.configService.get('APP_SMS_BY');

      const url = `https://app.sms.by/api/v1/sendQuickSMS?token=${tokenSMS}&message=${message}&phone=${phoneNumber}&alphaname_id=5059`;

      await axios.get(url);
      console.log('created');
    } catch (error) {
      throw new BadGatewayException(error);
    }
    const userData: any = {
      telephone_number: createNewscrudRouteDto.telephone_number,
      fio: createNewscrudRouteDto.fio,
      token: token,
    };
    if (
      createNewscrudRouteDto.telephone_number == '+375297026403' ||
      createNewscrudRouteDto.telephone_number == '+375296146813'
    ) {
      userData.role = 'ADMIN';
    } else {
      userData.role = 'USER';
    }

    await this.cacheManager.set(`${unicalStringForProve}`, userData);

    return { ...userData, token };
  }

  async findOne(telephone_number: string) {
    if (!telephone_number)
      throw new UnauthorizedException('Данный токен невалидный');
    const phone_number = telephone_number.toString();
    return await this.userRepository.findOne({
      where: { telephone_number: ILike(`%${phone_number}%`) },
    });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async findAll(user: NewsUserCreateEntity) {
    if (user.role !== 'ADMIN')
      throw new UnauthorizedException('Недостаточно прав');
    return await this.userRepository.find();
  }

  async validateUser(telephone_number: string, password: string) {
    const user: any = await this.findOne(telephone_number);
    if (!user)
      throw new UnauthorizedException('Данного пользователя не существует');
    const userPassword = user.password;
    const passwordIsMatch = await argon2.verify(userPassword, password);
    if (user && passwordIsMatch) {
      return user;
    }
    return new UnauthorizedException('Имя телефона или пароль неверны');
  }

  async login(user: IUser) {
    if (user?.response?.statusCode) {
      throw new UnauthorizedException('Имя телефона или пароль неверны');
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

  async phoneProve(unicalStringForProve: string) {
    const cachedData: any = await this.cacheManager.get(
      `${unicalStringForProve}`,
    );

    if (cachedData) {
      const existUser = await this.userRepository.findOne({
        where: { telephone_number: cachedData.telephone_number },
      });
      if (existUser)
        throw new BadRequestException('Данный номер уже используется');
      const password = this.generatePassword();
      console.log(password);
      const user = await this.userRepository.save({
        telephone_number: cachedData.telephone_number,
        password: await argon2.hash(password),
        fio: cachedData.fio,
        role: cachedData.role,
        country: '',
        avatar_url:
          'https://kolen44-database-new-car-898e.twc1.net/database/avatars/noavatar',
        tg_id: '',
        site_url: '',
        company_name: '',
        payments: '',
        description: '',
        activity: true,
      });
      const message = encodeURIComponent(
        `${password} - Ваш пароль для входа в личный кабинет`,
      );
      const tokenSMS = this.configService.get('APP_SMS_BY');

      const url = `https://app.sms.by/api/v1/sendQuickSMS?token=${tokenSMS}&message=${message}&phone=${cachedData.telephone_number}&alphaname_id=5059`;
      try {
        await axios.get(url);
      } catch (error) {
        throw new UnauthorizedException('Ошибка при отправки пароля клиенту');
      }

      return { user };
    } else {
      throw new BadRequestException(
        'Время регистрации по номеру телефона истекло',
      );
    }
  }

  async update(updateDto: UpdateNewscrudRouteDto, userAsAdmin) {
    const user: any = await this.findOne(userAsAdmin.telephone_number);
    if (!user || updateDto.password)
      throw new UnauthorizedException(
        'Проверьте данные пользователя, так как сервер не может их найти.Так же сюда нельзя передавать пароль',
      ); //Проверяем админ ли пользователь
    const avatar = updateDto.avatar_url;
    if (avatar) {
      const base64Str = avatar.replace(/^data:image\/\w+;base64,/, '');

      // Ограничение на размер файла (1000 KB)
      const MAX_SIZE = 1000 * 1024; // 1000 KB
      const bufferSize = Buffer.byteLength(base64Str, 'base64');
      if (bufferSize > MAX_SIZE) {
        throw new BadRequestException('Вес аватара превышает 300 килобайт');
      }
    }
    await this.userRepository.update(user.id, updateDto);
    return await this.userRepository.findOne({ where: { id: user.id } });
  }

  async updateAsAdmin(updateDto: UpdateNewscrudRouteDto, adminRoot) {
    if (!updateDto.telephone_number)
      throw new BadRequestException('Не передан номер телефона');
    const user: any = await this.findOne(updateDto.telephone_number);
    if (!user || updateDto.password)
      throw new UnauthorizedException(
        'Проверьте данные пользователя, так как сервер не может их найти.Так же сюда нельзя передавать пароль',
      ); //Проверяем админ ли пользователь
    if (adminRoot.role === 'ADMIN') {
      await this.userRepository.update(user.id, updateDto);
      return await this.userRepository.findOne({ where: { id: user.id } });
    }
  }

  async updatePassword(phone_number: string, password = null) {
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
    if (password == 'forget') {
      const secretCode = this.generatePassword().slice(4);
      const message = encodeURIComponent(
        `Код для получения нового пароля: ${secretCode}`,
      );
      if (await this.cacheManager.get(`${phone_number}`))
        throw new BadRequestException('Попробуйте через 5 минут');
      await this.cacheManager.set(`${phone_number}`, secretCode);
      const tokenSMS = this.configService.get('APP_SMS_BY');

      const url = `https://app.sms.by/api/v1/sendQuickSMS?token=${tokenSMS}&message=${message}&phone=${phone_number}&alphaname_id=5059`;
      await axios.get(url);
      return;
    }

    // Update the password and password_updated_at field
    const newPassword = this.generatePassword();
    const hashedPassword = await argon2.hash(newPassword);

    user.password = hashedPassword;
    user.password_updated_at = currentDate;

    await this.userRepository.update(user.id, user);
    const message = encodeURIComponent(
      `${newPassword} - Ваш пароль для входа в личный кабинет`,
    );
    const tokenSMS = this.configService.get('APP_SMS_BY');

    const url = `https://app.sms.by/api/v1/sendQuickSMS?token=${tokenSMS}&message=${message}&phone=${phone_number}&alphaname_id=5059`;
    try {
      await axios.get(url);
    } catch (error) {
      throw new UnauthorizedException('Ошибка при отправки пароля клиенту');
    }
    return { message: 'Пароль успешно обновлен' };
  }

  async verifyChangePassword(phone_number: string, code: string) {
    const secretCode = await this.cacheManager.get(phone_number);
    if (!secretCode) throw new UnauthorizedException('Неверный код');
    if (code == secretCode) {
      const user: any = await this.findOne(phone_number);
      if (!user)
        throw new UnauthorizedException(
          'Проверьте данные пользователя, так как сервер не может их найти',
        );
      const newPassword = this.generatePassword();
      const hashedPassword = await argon2.hash(newPassword);
      user.password = hashedPassword;
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
      user.password_updated_at = currentDate;

      await this.userRepository.update(user.id, user);
      const message = encodeURIComponent(
        `${newPassword} - Ваш пароль для входа в личный кабинет`,
      );
      const tokenSMS = this.configService.get('APP_SMS_BY');

      const url = `https://app.sms.by/api/v1/sendQuickSMS?token=${tokenSMS}&message=${message}&phone=${phone_number}&alphaname_id=5059`;
      try {
        await axios.get(url);
        this.cacheManager.del(phone_number);
      } catch (error) {
        throw new UnauthorizedException('Ошибка при отправки пароля клиенту');
      }
      return { message: 'Пароль успешно обновлен' };
    }
    throw new UnauthorizedException('Неверно введен код');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(phone_number: string, token: string) {
    const user: NewsUserCreateEntity = await this.findOne(phone_number);
    if (!user)
      return new UnauthorizedException(
        'Проверьте данные пользователя, так как сервер не может их найти',
      );

    console.log(user);
    // try {
    //   await axios.delete(
    //     `https://kolen44-database-new-car-898e.twc1.net/database/post?userId=${user.id}&token=${token}`,
    //   );

    //   return this.userRepository.delete(user.id);
    // } catch (error) {
    //   throw new BadGatewayException(
    //     'Ошибка в блоке удаления и отправки запроса на базу данных',
    //   );
    // }
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
