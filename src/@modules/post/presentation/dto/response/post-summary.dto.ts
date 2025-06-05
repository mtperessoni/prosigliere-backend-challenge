export class PostSummaryDto {
  id: number;
  title: string;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor({ id, title, createdAt, updatedAt, commentsCount }: Partial<PostSummaryDto>) {
    if (id !== undefined) this.id = id;
    if (title !== undefined) this.title = title;
    if (createdAt !== undefined) this.createdAt = createdAt;
    if (updatedAt !== undefined) this.updatedAt = updatedAt;
    if (commentsCount !== undefined) this.commentsCount = commentsCount;
  }
}
