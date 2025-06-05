/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { IBlogPostRepository } from '../../domain/repositories/blog-post.repository.interface';
import { BlogPost } from '../../domain/entities/blog-post.entity';
import { BLOG_POST_REPOSITORY } from '../../domain/repositories/tokens.repository';
import { CreatePostUseCase } from './create-post.use-case';
import { BlogPostRepository } from '../../infra/repositories/prisma/blog-post.repository';

describe('CreatePostUseCase', () => {
  let useCase: CreatePostUseCase;
  let repository: IBlogPostRepository;

  const mockRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostUseCase,
        {
          provide: BLOG_POST_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreatePostUseCase>(CreatePostUseCase);
    repository = module.get<IBlogPostRepository>(BlogPostRepository);
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
      id: '1',
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    });

    mockRepository.create.mockResolvedValue(expectedPost);

    const result = await useCase.execute(postData);

    expect(result).toEqual(expectedPost);
    expect(repository.create).toHaveBeenCalledWith(postData);
  });
});
