import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { NewsUserCreateEntity } from 'src/database/entities/newscrud_route.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.giard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { NewsUserCreateDto } from './dto/create-newscrud_route.dto';
import { UpdateNewscrudRouteDto } from './dto/update-newscrud_route.dto';
import { VerifyPasswordDto } from './dto/verifypassword.dto';
import { NewscrudRoutesService } from './newscrud_routes.service';

@Controller('news-auth')
export class NewscrudRoutesController {
  constructor(private readonly newscrudRoutesService: NewscrudRoutesService) {}

  @Post('/reg')
  @UsePipes(new ValidationPipe())
  create(@Body() createNewscrudRouteDto: NewsUserCreateDto) {
    return this.newscrudRoutesService.create(createNewscrudRouteDto);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.newscrudRoutesService.login(req.user);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return { ...req.user };
  }

  @Get('confirm/:token')
  async confirmEmail(@Param('token') token: string, @Res() res: Response) {
    const confirmationResult =
      await this.newscrudRoutesService.phoneProve(token);
    if (confirmationResult) {
      return res.redirect('https://webston.ru/auth/login');
    } else {
      throw new BadRequestException('Время действия ссылки истекло 😔');
    }
  }

  @Patch(':phone_number')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('phone_number') phone_number: string,
    @Body() updateUserDto: UpdateNewscrudRouteDto,
    @Req() req,
  ) {
    return this.newscrudRoutesService.update(
      phone_number,
      updateUserDto,
      req.user,
    );
  }

  @Post('/password')
  @UseGuards(JwtAuthGuard)
  async updateUserPassword(@Body() updateUserDto: UpdateNewscrudRouteDto) {
    return this.newscrudRoutesService.updatePassword(
      updateUserDto.telephone_number,
    );
  }

  @Post('/change-password')
  async changeUserPassword(@Body() updateUserDto: UpdateNewscrudRouteDto) {
    return this.newscrudRoutesService.updatePassword(
      updateUserDto.telephone_number,
      updateUserDto.password, //'forget' значение для dto password
    );
  }

  @Post('/verify-change-password')
  async verifyAndChangeUserPassword(@Body() verifyDto: VerifyPasswordDto) {
    return this.newscrudRoutesService.verifyChangePassword(
      verifyDto.telephone_number,
      verifyDto.code,
    );
  }

  @Delete(':phone_number')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('phone_number') phone_number: string) {
    return this.newscrudRoutesService.delete(phone_number);
  }

  @Get('/prove')
  @UseGuards(JwtAuthGuard)
  async proveUser() {
    return true;
  }

  @Get('/find-all')
  @UseGuards(JwtAuthGuard)
  async findAllUsers(@Request() req) {
    return this.newscrudRoutesService.findAll(req.user as NewsUserCreateEntity);
  }
}
