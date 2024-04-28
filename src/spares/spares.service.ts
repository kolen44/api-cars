import { SparesCsvService } from '@app/sparescsv';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SparesService {
  constructor(public sparesService: SparesCsvService) {}

  public async cvsUpdate(file) {
    const response = await this.sparesService.cvsUpdate(file);
    return response;
  }

  public async cvsDownload(url: string) {
    const response = await axios.get(url);
    const data = response.data;
    const res = await this.sparesService.parseCvsToJson(data);
    console.log(res);
    return res;
  }
}
