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
      return new BadRequestException(
        'Данный пользователь с таким номером телефона уже существует!',
      );

    const token = this.jwtService.sign({
      telephone_number: createNewscrudRouteDto.telephone_number,
    });
    try {
      const phoneNumber = encodeURIComponent(
        createNewscrudRouteDto.telephone_number,
      );
      const message = encodeURIComponent(
        `Перейдите по ссылке для подтверждения регистрации. Ссылка: https://147.45.147.53/news-auth/confirm/${token}`,
      );
      const tokenSMS = this.configService.get('APP_SMS_BY');

      const url = `https://app.sms.by/api/v1/sendQuickSMS?token=${tokenSMS}&message=${message}&phone=${phoneNumber}&alphaname_id=5059`;

      await axios.get(url);
    } catch (error) {
      return new BadGatewayException(error);
    }
    const userData: any = {
      telephone_number: createNewscrudRouteDto.telephone_number,
      fio: createNewscrudRouteDto.fio,
      country: 'Belarus',
      role: 'USER',
    };
    if (createNewscrudRouteDto.country) {
      userData.country = createNewscrudRouteDto.country;
    }
    if (createNewscrudRouteDto.telephone_number == '+375297026403') {
      userData.role = 'ADMIN';
    }

    await this.cacheManager.set(`${token}`, userData);

    return { ...userData, token };
  }

  async findOne(telephone_number: string) {
    if (!telephone_number)
      return new UnauthorizedException(
        'Вы не передали номер телефона как параметр',
      );
    const phone_number = telephone_number;
    return await this.userRepository.findOne({
      where: { telephone_number: ILike(`%${phone_number}%`) },
    });
  }

  async validateUser(telephone_number: string, password: string) {
    const user: any = await this.findOne(telephone_number);
    if (!user)
      return new UnauthorizedException('Данного пользователя не существует');
    const userPassword = user.password;
    const passwordIsMatch = await argon2.verify(userPassword, password);
    console.log(passwordIsMatch, userPassword);
    if (user && passwordIsMatch) {
      return user;
    }
    return new UnauthorizedException('Имя телефона или пароль неверны');
  }

  async login(user: IUser) {
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
        avatar_url: 'https://89.23.116.4/database/avatars/noavatar',
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
    if (!user)
      return new UnauthorizedException(
        'Проверьте данные пользователя, так как сервер не может их найти',
      );
    return this.userRepository.update(user.id, updateDto);
  }

  async delete(phone_number: string) {
    const user: any = await this.findOne(phone_number);
    if (!user)
      return new UnauthorizedException(
        'Проверьте данные пользователя, так как сервер не может их найти',
      );
    try {
      await axios.delete(
        `http://89.23.116.4:3000/database/avatars/${phone_number}`,
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
