import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { searchByCriteriaDto } from './dto/searchbycriteria.dto';
import { searchByCriteriaEngineVolumeDto } from './dto/searchenginevolume.dto';
import { SparesService } from './spares.service';

@Controller('spares')
export class SparesController {
  constructor(private readonly sparesService: SparesService) {}

  @Post()
  @HttpCode(201)
  async uploadFile(@Body() data: { data: string }) {
    if (data.data === 'dkdkdkdenwoofd') {
      this.sparesService.cvsDownload(
        'https://db.f-opt.com/csvfiles/abw/spares.csv',
      );
    } else {
      return 'Неверный токен';
    }
  }

  @Post('find')
  @HttpCode(200)
  async searchFile(@Body() data: searchByCriteriaDto) {
    return this.sparesService.searchByCriteria(data);
  }

  @Post('find-engine-volume')
  @HttpCode(200)
  async searchFileWithEngineVolumeOptions(
    @Body() data: searchByCriteriaEngineVolumeDto,
  ) {
    return this.sparesService.searchByEngineVolumeCriteria(data);
  }
}
