<<<<<<< HEAD
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
=======
import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
>>>>>>> 7a89eb906ef5b8ddc489cc77210000f075abbe31

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

<<<<<<< HEAD
  @Get()
  getHello(): string {
    return this.appService.getHello();
=======
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
>>>>>>> 7a89eb906ef5b8ddc489cc77210000f075abbe31
  }
}
