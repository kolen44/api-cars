import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { searchByCriteriaDto } from './dto/searchbycriteria.dto';
import { searchByCriteriaEngineVolumeDto } from './dto/searchenginevolume.dto';
import { searchByCriteriaDetailNameDto } from './dto/searchfilewithdetailname.dto';
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

  @Post('find-detail-name')
  @HttpCode(200)
  async searchFileWithDetailName(@Body() data: searchByCriteriaDetailNameDto) {
    return this.sparesService.searchFileWithDetailName(data);
  }

  @Post('find-brand')
  @HttpCode(200)
  async searchFileWithBrandName(@Body() data: { brand: string }) {
    return this.sparesService.searchFileWithBrandName(data);
  }

  @Post('find-id')
  @HttpCode(200)
  async searchFileWithId(@Body() data: { id: number }) {
    return this.sparesService.searchFileWithId(data);
  }

  @Post('find-original-number')
  @HttpCode(200)
  async searchFileWithOriginalNumber(
    @Body() data: { original_number: string },
  ) {
    return this.sparesService.searchFileWithOriginalNumber(data);
  }

  @Post('find-article')
  async searchFileWithArticle(@Body() data: { article: string }) {
    return this.sparesService.searchFileWithArticle(data);
  }
}
