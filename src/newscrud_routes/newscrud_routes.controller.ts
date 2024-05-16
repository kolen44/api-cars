import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Redirect,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.giard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { NewsUserCreateDto } from './dto/create-newscrud_route.dto';
import { UpdateNewscrudRouteDto } from './dto/update-newscrud_route.dto';
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
  @Redirect('https://webston.ru/auth/login', 302)
  async confirmEmail(@Param('token') token: string) {
    const confirmationResult =
      await this.newscrudRoutesService.phoneProve(token);
    if (confirmationResult) {
      return confirmationResult;
    } else {
      throw new BadRequestException('Время действия ссылки истекло 😔');
    }
  }

  @Patch(':phone_number')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('phone_number') phone_number: string,
    @Body() updateUserDto: UpdateNewscrudRouteDto,
  ) {
    return this.newscrudRoutesService.update(phone_number, updateUserDto);
  }

  @Patch('user_avatar/:phone_number')
  @UseGuards(JwtAuthGuard)
  async updateAvatarUser(
    @Param('phone_number') phone_number: string,
    @Body() updateUserDto: UpdateNewscrudRouteDto,
  ) {
    return this.newscrudRoutesService.update(phone_number, updateUserDto);
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
}
