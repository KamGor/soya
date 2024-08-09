import { Test, TestingModule } from '@nestjs/testing';
import { TagsManagerService } from './tags-manager.service';

describe('TagsManagerService', () => {
  let service: TagsManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagsManagerService],
    }).compile();

    service = module.get<TagsManagerService>(TagsManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
