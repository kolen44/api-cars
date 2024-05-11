import { IsOptional, IsString, MinLength } from 'class-validator';

export class NewsUserCreateDto {
  @IsString()
  @MinLength(8, { message: 'Неверно указан номер телефона' })
  telephone_number: string;

  @IsString()
  @MinLength(5, { message: 'Неверно указан номер телефона' })
  password?: string; //При регистрации пароль указывать не нужно , он генерируется автоматически . Это поле для обновления к примеру

  @IsString()
  @MinLength(3, { message: 'Пожалуйста , проверьте инициалы' })
  fio: string;

  @IsString()
  @MinLength(5, { message: 'Неверно указан номер телефона' })
  avatar_url?: string;

  @IsString()
  @MinLength(3, { message: 'Пожалуйста , проверьте country' })
  country?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Пожалуйста , проверьте tg id' })
  tg_id?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Пожалуйста , проверьте site url' })
  site_url?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Пожалуйста , проверьте company name' })
  company_name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Пожалуйста , проверьте description' })
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Пожалуйста , проверьте payments' })
  payments?: string;
}
