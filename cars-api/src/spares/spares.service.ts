import { SparesCsvService } from '@app/sparescsv';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SparesService {
  constructor(public sparesService: SparesCsvService) {}
  public cvsToJson() {
    return this.sparesService.parseCvsToJson();
  }
}
