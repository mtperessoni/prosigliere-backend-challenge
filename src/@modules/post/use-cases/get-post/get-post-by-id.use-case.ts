import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBlogPostRepository } from '@/@modules/post/domain/repositories/blog-post.repository.interface';
import { BlogPost } from '@/@modules/post/domain/entities/blog-post.entity';
import { BLOG_POST_REPOSITORY } from '@/@modules/post/domain/repositories/tokens.repository';
import { Cacheable } from '@/shared/infra/cache/cache.decorator';
import { CACHE_MANAGER } from '@/shared/interfaces/cache/tokens.cache';
import { ICacheManager } from '@/shared/interfaces/cache/cache.interface';

@Injectable()
export class GetPostByIdUseCase {
  constructor(
    @Inject(BLOG_POST_REPOSITORY)
    private readonly blogPostRepository: IBlogPostRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: ICacheManager,
  ) {}

  @Cacheable('cacheManager', 'get-post', 500)
  async execute(id: number): Promise<BlogPost> {
    const post = await this.blogPostRepository.findById(id);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }
}
