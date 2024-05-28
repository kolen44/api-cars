import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NewsUserCreateEntity } from 'src/database/entities/newscrud_route.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.giard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { NewsUserCreateDto } from './dto/create-newscrud_route.dto';
import { UpdateNewscrudRouteDto } from './dto/update-newscrud_route.dto';
import { VerifyPasswordDto } from './dto/verifypassword.dto';
import { NewscrudRoutesService } from './newscrud_routes.service';

@Controller('auth')
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
  async confirmEmail(@Param('token') token: string) {
    const confirmationResult =
      await this.newscrudRoutesService.phoneProve(token);
    if (confirmationResult) {
      return true;
    } else {
      throw new BadRequestException('Время действия ссылки истекло 😔');
    }
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateUser(@Body() updateUserDto: UpdateNewscrudRouteDto, @Req() req) {
    return this.newscrudRoutesService.update(updateUserDto, req.user);
  }

  @Patch('admin')
  @UseGuards(JwtAuthGuard)
  async updateUserByAdmin(
    @Body() updateUserDto: UpdateNewscrudRouteDto,
    @Req() req,
  ) {
    return this.newscrudRoutesService.updateAsAdmin(updateUserDto, req.user);
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
  async deleteUser(
    @Param('phone_number') phone_number: string,
    @Headers('Authorization') authHeader: string,
  ) {
    const token = authHeader.replace('Bearer ', '');
    console.log(token);
    return this.newscrudRoutesService.delete(phone_number, token);
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
