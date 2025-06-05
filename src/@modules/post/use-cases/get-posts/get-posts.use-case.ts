import { Inject, Injectable } from '@nestjs/common';
import { IBlogPostRepository } from '@/@modules/post/domain/repositories/blog-post.repository.interface';
import { BlogPost } from '@/@modules/post/domain/entities/blog-post.entity';
import { BLOG_POST_REPOSITORY } from '@/@modules/post/domain/repositories/tokens.repository';
import { PaginationDto } from '@/@modules/post/presentation/dto/request/pagination.dto';
import { PaginatedResult } from '@/shared/interfaces/pagination/pagination.interface';
import { Cacheable } from '@/shared/infra/cache/cache.decorator';
import { CACHE_MANAGER } from '@/shared/interfaces/cache/tokens.cache';
import { ICacheManager } from '@/shared/interfaces/cache/cache.interface';
import { CACHE_KEYS } from '@/@modules/post/domain/constants/cache-keys';

@Injectable()
export class GetPostsUseCase {
  constructor(
    @Inject(BLOG_POST_REPOSITORY)
    private readonly blogPostRepository: IBlogPostRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: ICacheManager,
  ) {}

  @Cacheable('cacheManager', CACHE_KEYS.ALL_POSTS, 500)
  async execute({ page, limit }: PaginationDto): Promise<PaginatedResult<BlogPost>> {
    return this.blogPostRepository.findAll(page, limit);
  }
}
