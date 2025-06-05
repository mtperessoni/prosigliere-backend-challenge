import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infra/prisma/prisma.service';
import {
  IBlogPostRepository,
  BlogPostPersistenceDTO,
} from '@/@modules/post/domain/repositories/blog-post.repository.interface';
import { BlogPost } from '@/@modules/post/domain/entities/blog-post.entity';
import { Comment } from '@/@modules/post/domain/entities/comment.entity';
import { PaginatedResult } from '@/shared/interfaces/pagination/pagination.interface';

@Injectable()
export class BlogPostRepository implements IBlogPostRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, limit: number): Promise<PaginatedResult<BlogPost>> {
    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: { comments: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.blogPost.count(),
    ]);

    return {
      data: posts.map((post) => new BlogPost({ ...post, commentsCount: post._count.comments })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findById(id: number): Promise<BlogPost | null> {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: {
        comments: true,
      },
    });

    if (!post) return null;

    return new BlogPost({
      ...post,
      comments: post.comments.map((comment) => new Comment(comment)),
    });
  }

  async create({ title, content }: BlogPostPersistenceDTO): Promise<BlogPost> {
    const createdPost = await this.prisma.blogPost.create({
      data: {
        title: title,
        content: content,
      },
    });

    return new BlogPost(createdPost);
  }

  async addComment(postId: number, comment: string): Promise<Comment> {
    const createdComment = await this.prisma.comment.create({
      data: {
        content: comment,
        postId,
      },
    });

    return new Comment(createdComment);
  }
}
