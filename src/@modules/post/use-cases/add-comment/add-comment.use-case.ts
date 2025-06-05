import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBlogPostRepository } from '../../domain/repositories/blog-post.repository.interface';
import { Comment } from '../../domain/entities/comment.entity';
import { BLOG_POST_REPOSITORY } from '../../domain/repositories/tokens.repository';

@Injectable()
export class AddCommentUseCase {
  constructor(
    @Inject(BLOG_POST_REPOSITORY)
    private readonly blogPostRepository: IBlogPostRepository,
  ) {}

  async execute(postId: number, content: string): Promise<Comment> {
    const post = await this.blogPostRepository.findById(postId);

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return this.blogPostRepository.addComment(postId, content);
  }
}
