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
import { TokenEntity } from 'src/database/entities/token.entity';
import { IUser } from 'src/types/newsuser';
import { Repository } from 'typeorm';
import { NewsUserCreateEntity } from '../database/entities/newscrud_route.entity';
import { NewsUserCreateDto } from './dto/create-newscrud_route.dto';

@Injectable()
export class NewscrudRoutesService {
  constructor(
    @InjectRepository(NewsUserCreateEntity)
    private readonly userRepository: Repository<NewsUserCreateEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
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

    const userData = {
      telephone_number: createNewscrudRouteDto.telephone_number,
      password: await argon2.hash(createNewscrudRouteDto.password),
      fio: createNewscrudRouteDto.fio,
    };

    await this.cacheManager.set(`${token}`, userData);

    return { ...userData };
  }

  async findOne(telephone_number: string) {
    return await this.userRepository.findOne({ where: { telephone_number } });
  }

  async validateUser(telephone_number: string, password: string) {
    const user = await this.findOne(telephone_number);
    const passwordIsMatch = await argon2.verify(user.password, password);
    console.log(user, passwordIsMatch);
    if (user && passwordIsMatch) {
      return user;
    }
    throw new UnauthorizedException('Имя телефона или пароль неверны');
  }

  async login(user: IUser) {
    return {
      ...user,
      token: this.jwtService.sign({
        telephone_number: user.telephone_number,
        id: user.id,
        fio: user.fio,
      }),
    };
  }

  async phoneProve(token: string) {
    const cachedData: NewsUserCreateDto = await this.cacheManager.get(
      `${token}`,
    );
    if (cachedData) {
      const user = await this.userRepository.save({
        telephone_number: cachedData.telephone_number,
        password: await argon2.hash(cachedData.password),
        fio: cachedData.fio,
      });
      return { ...user, token };
    } else {
      throw new BadRequestException(
        'Время регистрации по номеру телефона истекло',
      );
    }
  }
}
