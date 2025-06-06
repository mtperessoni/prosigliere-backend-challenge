import { ApiProperty } from '@nestjs/swagger';

export class PostSummaryDto {
  @ApiProperty({
    description: 'The unique identifier of the post',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Blog Post',
  })
  title: string;

  @ApiProperty({
    description: 'Number of comments on the post',
    example: 5,
  })
  commentsCount: number;

  @ApiProperty({
    description: 'When the post was created',
    example: '2024-03-20T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the post was last updated',
    example: '2024-03-20T10:00:00Z',
  })
  updatedAt: Date;

  constructor({ id, title, createdAt, updatedAt, commentsCount }: Partial<PostSummaryDto>) {
    if (id !== undefined) this.id = id;
    if (title !== undefined) this.title = title;
    if (createdAt !== undefined) this.createdAt = createdAt;
    if (updatedAt !== undefined) this.updatedAt = updatedAt;
    if (commentsCount !== undefined) this.commentsCount = commentsCount;
  }
}
