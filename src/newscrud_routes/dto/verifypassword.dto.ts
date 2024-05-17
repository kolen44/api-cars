import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class VerifyPasswordDto {
  @IsString()
  @IsPhoneNumber()
  @MinLength(8, { message: 'Неверно указан номер телефона' })
  telephone_number: string;

  @IsOptional()
  @IsString()
  @MinLength(4, { message: 'Неверно указан код' })
  code: string;
}
