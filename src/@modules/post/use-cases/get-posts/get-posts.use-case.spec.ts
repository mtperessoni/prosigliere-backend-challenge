import { Test, TestingModule } from '@nestjs/testing';
import { GetPostsUseCase } from './get-posts.use-case';
import { BLOG_POST_REPOSITORY } from '@/@modules/post/domain/repositories/tokens.repository';
import { CACHE_MANAGER } from '@/shared/interfaces/cache/tokens.cache';
import { BlogPost } from '@/@modules/post/domain/entities/blog-post.entity';
import { PaginatedResult } from '@/shared/interfaces/pagination/pagination.interface';

describe('GetPostsUseCase', () => {
  let useCase: GetPostsUseCase;

  const mockRepository = {
    findAll: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPostsUseCase,
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

    useCase = module.get<GetPostsUseCase>(GetPostsUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return paginated posts', async () => {
    const paginationDto = { page: 1, limit: 10 };
    const expectedResult: PaginatedResult<BlogPost> = {
      data: [
        new BlogPost({
          id: 1,
          title: 'Test Post',
          content: 'Test Content',
          createdAt: new Date(),
          updatedAt: new Date(),
          comments: [],
        }),
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    mockRepository.findAll.mockResolvedValue(expectedResult);

    const result = await useCase.execute(paginationDto);

    expect(result).toEqual(expectedResult);
    expect(mockRepository.findAll).toHaveBeenCalledWith(paginationDto.page, paginationDto.limit);
  });

  it('should use cache when available', async () => {
    const paginationDto = { page: 1, limit: 10 };
    const cachedResult: PaginatedResult<BlogPost> = {
      data: [
        new BlogPost({
          id: 1,
          title: 'Cached Post',
          content: 'Cached Content',
          createdAt: new Date(),
          updatedAt: new Date(),
          comments: [],
        }),
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    mockCacheManager.get.mockResolvedValue(cachedResult);

    const result = await useCase.execute(paginationDto);

    expect(result).toEqual(cachedResult);
    expect(mockRepository.findAll).not.toHaveBeenCalled();
  });
});
