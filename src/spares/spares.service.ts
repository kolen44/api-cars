import { SparesCsvService } from '@app/sparescsv';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SparesService {
  constructor(public sparesService: SparesCsvService) {}
  public async cvsToJson() {
    const response = await this.sparesService.parseCvsToJson();
    return response;
  }

  public async cvsUpdate(file) {
    const response = await this.sparesService.cvsUpdate(file);
    return response;
  }
}
