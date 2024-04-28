import { Controller, Get } from '@nestjs/common';
import { SparesService } from './spares.service';

@Controller('spares')
export class SparesController {
  constructor(private readonly sparesService: SparesService) {}

  @Get()
  create() {
    return this.sparesService.cvsToJson();
  }
}
