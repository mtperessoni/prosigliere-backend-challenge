import { Test, TestingModule } from '@nestjs/testing';
import { BlogPost } from '@/@modules/post/domain/entities/blog-post.entity';
import { BLOG_POST_REPOSITORY } from '@/@modules/post/domain/repositories/tokens.repository';
import { CreatePostUseCase } from './create-post.use-case';
import { CACHE_MANAGER } from '@/shared/interfaces/cache/tokens.cache';

describe('CreatePostUseCase', () => {
  let useCase: CreatePostUseCase;

  const mockRepository = {
    create: jest.fn().mockImplementation(async () => {}),
  };

  const mockCacheManager = {
    get: jest.fn().mockImplementation(async () => {}),
    set: jest.fn().mockImplementation(async () => {}),
    delByPrefix: jest.fn().mockImplementation(async () => {}),
    clear: jest.fn().mockImplementation(async () => {}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostUseCase,
        {
          provide: BLOG_POST_REPOSITORY,
          useValue: mockRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    useCase = module.get<CreatePostUseCase>(CreatePostUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a new post', async () => {
    const postData = {
      title: 'Test Post',
      content: 'Test Content',
    };
    const expectedPost = new BlogPost({
      id: 1,
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    });

    mockRepository.create.mockResolvedValue(expectedPost);

    const result = await useCase.execute(postData);

    expect(result).toEqual(expectedPost);
    expect(mockRepository.create).toHaveBeenCalledWith(postData);
    expect(mockCacheManager.delByPrefix).toHaveBeenCalled();
  });
});
