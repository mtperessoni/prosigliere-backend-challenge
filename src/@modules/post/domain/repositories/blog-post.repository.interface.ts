import { PaginatedResult } from '@/shared/interfaces/pagination/pagination.interface';
import { BlogPost } from '../entities/blog-post.entity';
import { Comment } from '../entities/comment.entity';

export interface BlogPostPersistenceDTO {
  title: string;
  content: string;
}

export interface IBlogPostRepository {
  findAll(page: number, limit: number): Promise<PaginatedResult<BlogPost>>;
  findById(id: number): Promise<BlogPost | null>;
  create(post: BlogPostPersistenceDTO): Promise<BlogPost>;
  addComment(postId: number, comment: string): Promise<Comment>;
}
