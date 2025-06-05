import { Inject, Injectable } from '@nestjs/common';
import { IBlogPostRepository } from '@/@modules/post/domain/repositories/blog-post.repository.interface';
import { BlogPost } from '@/@modules/post/domain/entities/blog-post.entity';
import { BLOG_POST_REPOSITORY } from '@/@modules/post/domain/repositories/tokens.repository';
import { ICacheManager } from '@/shared/interfaces/cache/cache.interface';
import { CACHE_MANAGER } from '@/shared/interfaces/cache/tokens.cache';
import { CACHE_KEYS } from '../../domain/constants/cache-keys';

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

    await this.cacheManager.delByPrefix(CACHE_KEYS.ALL_POSTS);
    return post;
  }
}
