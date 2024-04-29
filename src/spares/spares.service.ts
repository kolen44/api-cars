import { SparesCsvService } from '@app/sparescsv';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CardProductService } from '@repository/repository';
import { CreateCardProductDto } from '@repository/repository/card-product/dto/create-card-product.dto';

@Injectable()
export class SparesService {
  constructor(
    public sparesService: SparesCsvService,
    private dbCreate: CardProductService,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  handleCron() {
    try {
      this.cvsDownload('https://db.f-opt.com/csvfiles/abw/spares.csv');
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  public async cvsUpdate(file) {
    const response = await this.sparesService.cvsUpdate(file);
    return response;
  }

  public async cvsDownload(url: string) {
    console.log('started parsing');
    const response: any = await this.sparesService.parseCvsToJson(url);
    console.log('ended parsing. starting db creating');
    for (const element of response) {
      const data = new CreateCardProductDto(element);
      const used = await this.dbCreate.updateByArticle(data.article, element);
      console.log(used);
    }

    console.log('created');
    return response;
  }
}
