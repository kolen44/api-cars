import { Injectable } from '@nestjs/common';
import { NewsUserCreateDto } from './dto/create-newscrud_route.dto';
import { UpdateNewscrudRouteDto } from './dto/update-newscrud_route.dto';

@Injectable()
export class NewscrudRoutesService {
  create(createNewscrudRouteDto: NewsUserCreateDto) {
    return 'This action adds a new newscrudRoute';
  }

  findAll() {
    return `This action returns all newscrudRoutes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} newscrudRoute`;
  }

  update(id: number, updateNewscrudRouteDto: UpdateNewscrudRouteDto) {
    return `This action updates a #${id} newscrudRoute`;
  }

  remove(id: number) {
    return `This action removes a #${id} newscrudRoute`;
  }
}
