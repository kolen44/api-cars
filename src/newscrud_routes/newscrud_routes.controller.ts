import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.giard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { NewsUserCreateDto } from './dto/create-newscrud_route.dto';
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

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return { ...req.user };
  }

  @Get('confirm/:token')
  async confirmEmail(@Param('token') token: string) {
    const confirmationResult =
      await this.newscrudRoutesService.phoneProve(token);
    if (confirmationResult) {
      return confirmationResult;
    } else {
      throw new BadRequestException('Время действия ссылки истекло 😔');
    }
  }
}
