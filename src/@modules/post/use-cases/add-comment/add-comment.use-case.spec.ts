import { Test, TestingModule } from '@nestjs/testing';
import { AddCommentUseCase } from './add-comment.use-case';
import { BLOG_POST_REPOSITORY } from '@/@modules/post/domain/repositories/tokens.repository';
import { Comment } from '@/@modules/post/domain/entities/comment.entity';
import { BlogPost } from '@/@modules/post/domain/entities/blog-post.entity';
import { NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@/shared/interfaces/cache/tokens.cache';

describe('AddCommentUseCase', () => {
  let useCase: AddCommentUseCase;

  const mockRepository = {
    findById: jest.fn(),
    addComment: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn().mockImplementation(async () => {}),
    set: jest.fn().mockImplementation(async () => {}),
    del: jest.fn().mockImplementation(async () => {}),
    clear: jest.fn().mockImplementation(async () => {}),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddCommentUseCase,
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

    useCase = module.get<AddCommentUseCase>(AddCommentUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should add a comment to a post', async () => {
    const postId = 1;
    const commentContent = 'Test comment';
    const post = new BlogPost({
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    });
    const expectedComment = new Comment({
      id: 1,
      content: commentContent,
      postId: postId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepository.findById.mockResolvedValue(post);
    mockRepository.addComment.mockResolvedValue(expectedComment);

    const result = await useCase.execute(postId, commentContent);

    expect(result).toEqual(expectedComment);
    expect(mockRepository.findById).toHaveBeenCalledWith(postId);
    expect(mockRepository.addComment).toHaveBeenCalledWith(postId, commentContent);
  });

  it('should throw NotFoundException when post is not found', async () => {
    const postId = 999;
    const commentContent = 'Test comment';

    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(postId, commentContent)).rejects.toThrow(NotFoundException);
    expect(mockRepository.findById).toHaveBeenCalledWith(postId);
    expect(mockRepository.addComment).not.toHaveBeenCalled();
  });
});
