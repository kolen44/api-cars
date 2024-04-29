import { Test, TestingModule } from '@nestjs/testing';
import { TestttService } from './testtt.service';

describe('TestttService', () => {
  let service: TestttService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestttService],
    }).compile();

    service = module.get<TestttService>(TestttService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
