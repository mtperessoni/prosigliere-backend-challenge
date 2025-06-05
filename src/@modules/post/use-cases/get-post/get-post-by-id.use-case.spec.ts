import { Test, TestingModule } from '@nestjs/testing';
import { GetPostByIdUseCase } from './get-post-by-id.use-case';
import { BLOG_POST_REPOSITORY } from '@/@modules/post/domain/repositories/tokens.repository';
import { CACHE_MANAGER } from '@/shared/interfaces/cache/tokens.cache';
import { BlogPost } from '@/@modules/post/domain/entities/blog-post.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetPostByIdUseCase', () => {
  let useCase: GetPostByIdUseCase;

  const mockRepository = {
    findById: jest.fn(),
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
        GetPostByIdUseCase,
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

    useCase = module.get<GetPostByIdUseCase>(GetPostByIdUseCase);
  });

  it('should return a post by id', async () => {
    const postId = 1;
    const expectedPost = new BlogPost({
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    });
    mockRepository.findById.mockResolvedValue(expectedPost);

    const result = await useCase.execute(postId);

    expect(result).toEqual(expectedPost);
    expect(mockRepository.findById).toHaveBeenCalledWith(postId);
  });

  it('should throw NotFoundException when post is not found', async () => {
    const postId = 999;
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(postId)).rejects.toThrow(NotFoundException);
    expect(mockRepository.findById).toHaveBeenCalledWith(postId);
  });

  it('should use cache when available', async () => {
    const postId = 1;
    const cachedPost = new BlogPost({
      id: 1,
      title: 'Cached Post',
      content: 'Cached Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    });
    mockCacheManager.get.mockResolvedValue(cachedPost);

    const result = await useCase.execute(postId);

    expect(result).toEqual(cachedPost);
    expect(mockRepository.findById).not.toHaveBeenCalled();
  });
});
