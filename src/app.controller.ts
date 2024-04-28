import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test/get')
  getAll() {
    return this.appService.testFindAll()
  }

  @Get('test/getOne')
  getOne() {
    return this.appService.testFindOne()
  }

  @Get('test/create')
  create() {
    return this.appService.testCreate()
  }
}
