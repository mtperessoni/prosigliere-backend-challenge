import { Module } from '@nestjs/common';
import { PostModule } from './@modules/post/post.module';

@Module({
  imports: [PostModule],
})
export class AppModule {}
