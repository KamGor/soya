import { Test, TestingModule } from '@nestjs/testing';
import { ConfigManagerService } from './config-manager.service';

describe('ConfigManagerService', () => {
  let service: ConfigManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigManagerService],
    }).compile();

    service = module.get<ConfigManagerService>(ConfigManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
