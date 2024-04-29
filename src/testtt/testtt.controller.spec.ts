import { Test, TestingModule } from '@nestjs/testing';
import { TestttController } from './testtt.controller';
import { TestttService } from './testtt.service';

describe('TestttController', () => {
  let controller: TestttController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestttController],
      providers: [TestttService],
    }).compile();

    controller = module.get<TestttController>(TestttController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
