import { Test, TestingModule } from '@nestjs/testing';
import { UsersManagerService } from './users-manager.service';

describe('UsersManagerService', () => {
  let service: UsersManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersManagerService],
    }).compile();

    service = module.get<UsersManagerService>(UsersManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
