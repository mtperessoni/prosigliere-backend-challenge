import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBlogPostRepository } from '@/@modules/post/domain/repositories/blog-post.repository.interface';
import { Comment } from '@/@modules/post/domain/entities/comment.entity';
import { BLOG_POST_REPOSITORY } from '@/@modules/post/domain/repositories/tokens.repository';
import { CACHE_MANAGER } from '@/shared/interfaces/cache/tokens.cache';
import { ICacheManager } from '@/shared/interfaces/cache/cache.interface';

@Injectable()
export class AddCommentUseCase {
  constructor(
    @Inject(BLOG_POST_REPOSITORY)
    private readonly blogPostRepository: IBlogPostRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: ICacheManager,
  ) {}

  async execute(postId: number, content: string): Promise<Comment> {
    const post = await this.blogPostRepository.findById(postId);

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    await this.cacheManager.clear();
    return this.blogPostRepository.addComment(postId, content);
  }
}
