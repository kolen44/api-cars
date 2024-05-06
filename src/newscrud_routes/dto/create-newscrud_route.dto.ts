import { IsString, MinLength } from 'class-validator';

export class NewsUserCreateDto {
  @IsString()
  @MinLength(8, { message: 'Неверно указан номер телефона' })
  telephone_number: string;

  @IsString()
  @MinLength(5, { message: 'Неверно указан номер телефона' })
  password: string;

  @IsString()
  @MinLength(3, { message: 'Пожалуйста , проверьте инициалы' })
  fio: string;
}
