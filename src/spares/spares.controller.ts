import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { FindProductQueryDto } from './dto/find-product-query.dto';
import { Find3ParametersDto } from './dto/findid.dto';
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

  @Get()
  getProduct(@Body() query: FindProductQueryDto) {
    return this.sparesService.getProduct(query);
  }

  @Get('find-3-parameters')
  findBy3Parameters(@Query() query: Find3ParametersDto) {
    return this.sparesService.searchBy3Parameters(query);
  }
}
