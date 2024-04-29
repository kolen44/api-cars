import { Controller, HttpCode, Post } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { SparesService } from './spares.service';

@Controller('spares')
export class SparesController {
  constructor(private readonly sparesService: SparesService) {}

  @Post()
  @HttpCode(200)
  async uploadFile() {
    this.sparesService.cvsDownload(
      'https://db.f-opt.com/csvfiles/abw/spares.csv',
    );
  }

  @EventPattern('start')
  async handlerTimer(@Payload() data: any, @Ctx() context: RmqContext) {
    this.sparesService.handlerTimeout(data);
  }
}
