import { SparesCsvService } from '@app/sparescsv';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CardProductService } from '@repository/repository';
import { UpdateCardProductDto } from '@repository/repository/card-product/dto/update-card-product.dto';

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
      const data = new UpdateCardProductDto(element);
      const used = await this.dbCreate.updateDatabase(data);
      console.log(used);
    }
    changingTransactionDatabase();
    console.log('created');
    return response;
  }
}
function changingTransactionDatabase() {
  throw new Error('Function not implemented.');
}
