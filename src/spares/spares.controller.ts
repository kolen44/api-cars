import { Controller, HttpCode, Post } from '@nestjs/common';
import { SparesService } from './spares.service';

@Controller('spares')
export class SparesController {
  constructor(private readonly sparesService: SparesService) {}

  @Post()
  @HttpCode(200)
  uploadFile() {}
}
