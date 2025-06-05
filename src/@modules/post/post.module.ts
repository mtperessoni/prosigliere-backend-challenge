import { Module } from '@nestjs/common';
import { PostController } from './presentation/post.controller';
import { CreatePostUseCase } from './use-cases/create-post/create-post.use-case';
import { GetPostsUseCase } from './use-cases/get-posts/get-posts.use-case';
import { GetPostByIdUseCase } from './use-cases/get-post/get-post-by-id.use-case';
import { AddCommentUseCase } from './use-cases/add-comment/add-comment.use-case';
import { RepositoriesModule } from './infra/repositories/repositories.module';
import { CacheModule } from '@/shared/infra/cache/cache.module';

@Module({
  imports: [RepositoriesModule, CacheModule],
  controllers: [PostController],
  providers: [CreatePostUseCase, GetPostsUseCase, GetPostByIdUseCase, AddCommentUseCase],
})
export class PostModule {}
