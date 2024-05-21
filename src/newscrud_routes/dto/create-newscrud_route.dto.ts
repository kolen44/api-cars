import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class NewsUserCreateDto {
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  @MinLength(8, { message: 'Неверно указан номер телефона' })
  telephone_number: string;

  @IsOptional()
  @IsString()
  @MinLength(5, {
    message:
      'Неверно указан пароль. . Минимально 5 символов + должно быть строкой',
  })
  password?: string; //При регистрации пароль указывать не нужно , он генерируется автоматически . Это поле для обновления к примеру

  @IsOptional()
  @IsString()
  @MinLength(3, {
    message:
      'Пожалуйста , проверьте инициалы. Минимально 3 символа + должно быть строкой',
  })
  fio: string;

  @IsOptional()
  @IsString({
    message: 'Пожалуйста , проверьте avatar url. Это поле должно быть строкой',
  })
  avatar_url?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, {
    message:
      'Пожалуйста , проверьте country. Минимально 3 символа + должно быть строкой',
  })
  country?: string;

  @IsOptional()
  @IsString({
    message: 'Пожалуйста , проверьте tg id. Это поле должно быть строкой',
  })
  tg_id?: string;

  @IsOptional()
  @IsString({
    message: 'Пожалуйста , проверьте site url. Это поле должно быть строкой',
  })
  site_url?: string;

  @IsOptional()
  @IsString({
    message:
      'Пожалуйста , проверьте company name. Это поле должно быть строкой',
  })
  company_name?: string;

  @IsOptional()
  @IsString({
    message: 'Пожалуйста , проверьте description. Это поле должно быть строкой',
  })
  description?: string;

  @IsOptional()
  @IsString({
    message: 'Пожалуйста , проверьте payments. Это поле должно быть строкой',
  })
  payments?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, {
    message:
      'Пожалуйста , проверьте role. Минимально 3 символа + должно быть строкой',
  })
  role?: string;
}
