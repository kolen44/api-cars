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
    try {
      const phoneNumber = encodeURIComponent(
        createNewscrudRouteDto.telephone_number,
      );
      const message = encodeURIComponent(
        `Перейдите по ссылке для подтверждения регистрации. Ссылка: https://147.45.147.53/confirm/${token}`,
      );
      const tokenSMS = this.configService.get('APP_SMS_BY');

      const url = `https://app.sms.by/api/v1/sendQuickSMS?token=${tokenSMS}&message=${message}&phone=${phoneNumber}&alphaname_id=5059`;

      await axios.get(url);
    } catch (error) {
      throw new BadGatewayException(error);
    }
    const password = await argon2.hash(createNewscrudRouteDto.password);
    const userData = {
      telephone_number: createNewscrudRouteDto.telephone_number,
      password,
      fio: createNewscrudRouteDto.fio,
      country: 'Belarus',
    };
    if (createNewscrudRouteDto.country) {
      userData.country = createNewscrudRouteDto.country;
    }

    await this.cacheManager.set(`${token}`, userData);

    return { ...userData, token };
  }

  async findOne(telephone_number: string) {
    const phone_number = telephone_number.toString();
    return await this.userRepository.findOne({
      where: { telephone_number: ILike(`%${phone_number}%`) },
    });
  }

  async validateUser(telephone_number: string, password: string) {
    const user = await this.findOne(telephone_number);
    if (!user)
      throw new UnauthorizedException('Данного пользователя не существует');
    const userPassword = user.password;
    const passwordIsMatch = await argon2.verify(userPassword, password);
    console.log(passwordIsMatch, userPassword);
    if (user && passwordIsMatch) {
      return user;
    }
    throw new UnauthorizedException('Имя телефона или пароль неверны');
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
      const user = await this.userRepository.save({
        telephone_number: cachedData.telephone_number,
        password: cachedData.password,
        fio: cachedData.fio,
        activity: 1,
      });
      return { user, token };
    } else {
      throw new BadRequestException(
        'Время регистрации по номеру телефона истекло',
      );
    }
  }

  async update(phone_number: string, updateDto: UpdateNewscrudRouteDto) {
    const user = await this.findOne(phone_number);
    console.log(user);
    console.log(updateDto);
    if (!user)
      throw new UnauthorizedException(
        'Проверьте данные пользователя, так как сервер не может их найти',
      );
    return this.userRepository.update(user.id, updateDto);
  }

  async delete(phone_number: string) {
    const user = await this.findOne(phone_number);
    if (!user)
      throw new UnauthorizedException(
        'Проверьте данные пользователя, так как сервер не может их найти',
      );
    try {
      await axios.delete(
        `https://89.191.229.234/database/avatars/${phone_number}`,
      );

      return this.userRepository.delete(user.id);
    } catch (error) {
      throw new BadGatewayException(
        'Ошибка в блоке удаления и отправки запроса на базу данных',
      );
    }
  }
}
