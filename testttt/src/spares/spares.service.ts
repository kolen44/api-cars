import { Injectable } from '@nestjs/common'
import { SparesCsvService } from '@sparescsv/sparescsv'

@Injectable()
export class SparesService {
  constructor(public sparesService: SparesCsvService) {}
  public cvsToJson() {
    return this.sparesService.parseCvsToJson()
  }
}
