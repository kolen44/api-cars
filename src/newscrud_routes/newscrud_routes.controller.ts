import { Body, Controller, Post } from '@nestjs/common';
import { NewsUserCreateDto } from './dto/create-newscrud_route.dto';
import { NewscrudRoutesService } from './newscrud_routes.service';

@Controller('newscrud-routes')
export class NewscrudRoutesController {
  constructor(private readonly newscrudRoutesService: NewscrudRoutesService) {}

  @Post('/reg')
  create(@Body() createNewscrudRouteDto: NewsUserCreateDto) {
    return this.newscrudRoutesService.create(createNewscrudRouteDto);
  }
}
