import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostRepository } from './blog-post.repository';
import { PrismaService } from '@/shared/infra/prisma/prisma.service';
import { BlogPost } from '@/@modules/post/domain/entities/blog-post.entity';
import { Comment } from '@/@modules/post/domain/entities/comment.entity';

describe('BlogPostRepository', () => {
  let repository: BlogPostRepository;

  const mockPrismaService = {
    blogPost: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    comment: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogPostRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<BlogPostRepository>(BlogPostRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated blog posts', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Test Post 1',
          content: 'Content 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { comments: 2 },
        },
        {
          id: 2,
          title: 'Test Post 2',
          content: 'Content 2',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { comments: 1 },
        },
      ];

      mockPrismaService.blogPost.findMany.mockResolvedValue(mockPosts);
      mockPrismaService.blogPost.count.mockResolvedValue(2);

      const result = await repository.findAll(1, 10);

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.data[0]).toBeInstanceOf(BlogPost);
      expect(mockPrismaService.blogPost.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: {
          _count: {
            select: { comments: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });

  describe('findById', () => {
    it('should return a blog post with comments when found', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test Content',
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [
          {
            id: 1,
            content: 'Test Comment',
            postId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      mockPrismaService.blogPost.findUnique.mockResolvedValue(mockPost);

      const result = await repository.findById(1);

      expect(result).toBeInstanceOf(BlogPost);
      expect(result?.comments[0]).toBeInstanceOf(Comment);
      expect(mockPrismaService.blogPost.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          comments: true,
        },
      });
    });

    it('should return null when post is not found', async () => {
      mockPrismaService.blogPost.findUnique.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new blog post', async () => {
      const mockPost = {
        id: 1,
        title: 'New Post',
        content: 'New Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.blogPost.create.mockResolvedValue(mockPost);

      const result = await repository.create({
        title: 'New Post',
        content: 'New Content',
      });

      expect(result).toBeInstanceOf(BlogPost);
      expect(mockPrismaService.blogPost.create).toHaveBeenCalledWith({
        data: {
          title: 'New Post',
          content: 'New Content',
        },
      });
    });
  });

  describe('addComment', () => {
    it('should add a comment to a blog post', async () => {
      const mockComment = {
        id: 1,
        content: 'New Comment',
        postId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.comment.create.mockResolvedValue(mockComment);

      const result = await repository.addComment(1, 'New Comment');

      expect(result).toBeInstanceOf(Comment);
      expect(mockPrismaService.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'New Comment',
          postId: 1,
        },
      });
    });
  });
});
