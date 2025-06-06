import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CreatePostUseCase } from '../use-cases/create-post/create-post.use-case';
import { GetPostsUseCase } from '../use-cases/get-posts/get-posts.use-case';
import { GetPostByIdUseCase } from '../use-cases/get-post/get-post-by-id.use-case';
import { AddCommentUseCase } from '../use-cases/add-comment/add-comment.use-case';
import { BlogPost } from '../domain/entities/blog-post.entity';
import { CreatePostDto } from './dto/request/create-post.dto';
import { AddCommentDto } from './dto/request/add-comment.dto';
import { PaginationDto } from './dto/request/pagination.dto';
import { PaginatedResult } from '@/shared/interfaces/pagination/pagination.interface';
import { PostSummaryDto } from './dto/response/post-summary.dto';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PostDetailsDto } from './dto/response/post-details.dto';
import { CommentDetailsDto } from './dto/response/comment-details.dto';

@Controller('posts')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly getPostsUseCase: GetPostsUseCase,
    private readonly getPostByIdUseCase: GetPostByIdUseCase,
    private readonly addCommentUseCase: AddCommentUseCase,
  ) {}

  @ApiOperation({ summary: 'Get all posts with pagination' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated list of posts',
    type: PostSummaryDto,
    isArray: true,
  })
  @Get()
  async getAllPosts(@Query() pagination: PaginationDto): Promise<PaginatedResult<PostSummaryDto>> {
    const result = await this.getPostsUseCase.execute(pagination);
    return {
      ...result,
      data: result.data.map((post) => new PostSummaryDto(post)),
    };
  }

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created',
    type: PostDetailsDto,
  })
  @Post()
  async createPost(@Body() data: CreatePostDto): Promise<BlogPost> {
    const result = await this.createPostUseCase.execute(data);
    return new PostDetailsDto(result);
  }

  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the post' })
  @ApiResponse({
    status: 200,
    description: 'Returns the post with the specified ID',
    type: PostDetailsDto,
  })
  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number): Promise<PostDetailsDto> {
    const result = await this.getPostByIdUseCase.execute(id);
    return new PostDetailsDto(result);
  }

  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiParam({ name: 'id', description: 'The ID of the post' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully added',
    type: CommentDetailsDto,
  })
  @Post(':id/comments')
  async addComment(
    @Param('id', ParseIntPipe) postId: number,
    @Body() data: AddCommentDto,
  ): Promise<CommentDetailsDto> {
    const result = await this.addCommentUseCase.execute(postId, data.content);
    return new CommentDetailsDto(result);
  }
}
