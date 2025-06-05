import { Inject, Injectable } from '@nestjs/common';
import { IBlogPostRepository } from '../../domain/repositories/blog-post.repository.interface';
import { BlogPost } from '../../domain/entities/blog-post.entity';
import { BLOG_POST_REPOSITORY } from '../../domain/repositories/tokens.repository';
import { ICacheManager } from '../../../../shared/interfaces/cache/cache.interface';
import { CACHE_MANAGER } from '../../../../shared/interfaces/cache/tokens.cache';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(BLOG_POST_REPOSITORY)
    private readonly blogPostRepository: IBlogPostRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: ICacheManager,
  ) {}

  async execute(data: { title: string; content: string }): Promise<BlogPost> {
    const post = await this.blogPostRepository.create(data);

    // Clear cache after creating a new post
    await this.cacheManager.clear();

    return post;
  }
}
