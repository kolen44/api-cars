import { Controller } from '@nestjs/common';
import { TestttService } from './testtt.service';

@Controller('route')
export class TestttController {
  constructor(private readonly testttService: TestttService) {}
}
