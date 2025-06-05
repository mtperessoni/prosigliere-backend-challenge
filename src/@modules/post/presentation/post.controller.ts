import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CreatePostUseCase } from '../use-cases/create-post/create-post.use-case';
import { GetPostsUseCase } from '../use-cases/get-posts/get-posts.use-case';
import { GetPostByIdUseCase } from '../use-cases/get-post/get-post-by-id.use-case';
import { AddCommentUseCase } from '../use-cases/add-comment/add-comment.use-case';
import { BlogPost } from '../domain/entities/blog-post.entity';
import { Comment } from '../domain/entities/comment.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResult } from '@/shared/interfaces/pagination/pagination.interface';

@Controller('posts')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly getPostsUseCase: GetPostsUseCase,
    private readonly getPostByIdUseCase: GetPostByIdUseCase,
    private readonly addCommentUseCase: AddCommentUseCase,
  ) {}

  @Get()
  async getAllPosts(@Query() pagination: PaginationDto): Promise<PaginatedResult<BlogPost>> {
    return this.getPostsUseCase.execute(pagination);
  }

  @Post()
  async createPost(@Body() data: CreatePostDto): Promise<BlogPost> {
    return this.createPostUseCase.execute(data);
  }

  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number): Promise<BlogPost> {
    return this.getPostByIdUseCase.execute(id);
  }

  @Post(':id/comments')
  async addComment(
    @Param('id', ParseIntPipe) postId: number,
    @Body() data: AddCommentDto,
  ): Promise<Comment> {
    return this.addCommentUseCase.execute(postId, data.content);
  }
}
