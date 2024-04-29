import { SparesCsvService } from '@app/sparescsv';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SparesService {
  constructor(public sparesService: SparesCsvService) {}
  private readonly logger = new Logger(SparesService.name);

  public async cvsUpdate(file) {
    const response = await this.sparesService.cvsUpdate(file);
    return response;
  }

  public async cvsDownload(url: string) {
    const res = await this.sparesService.parseCvsToJson(url);
    return res;
  }

  public async handlerTimeout(data) {
    this.logger.log('Start test', data);
  }
}
