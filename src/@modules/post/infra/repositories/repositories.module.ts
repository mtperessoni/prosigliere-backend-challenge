import { Module } from '@nestjs/common';
import { BlogPostRepository } from './prisma/blog-post.repository';
import { PrismaService } from '@/shared/infra/prisma/prisma.service';
import { BLOG_POST_REPOSITORY } from '../../domain/repositories/tokens.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: BLOG_POST_REPOSITORY,
      useClass: BlogPostRepository,
    },
  ],
  exports: [
    PrismaService,
    {
      provide: BLOG_POST_REPOSITORY,
      useClass: BlogPostRepository,
    },
  ],
})
export class RepositoriesModule {}
