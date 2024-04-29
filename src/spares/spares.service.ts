import { SparesCsvService } from '@app/sparescsv';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SparesService {
  constructor(public sparesService: SparesCsvService) {}
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  handleCron() {
    try {
      this.sparesService.cvsUpdate(
        'https://db.f-opt.com/csvfiles/abw/spares.csv',
      );
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
    const res = await this.sparesService.parseCvsToJson(url);
    return res;
  }
}
