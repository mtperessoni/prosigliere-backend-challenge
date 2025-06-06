import { ApiProperty } from '@nestjs/swagger';

export class CommentDetailsDto {
  @ApiProperty({
    description: 'The unique identifier of the comment',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The content of the comment',
    example: 'Great post! Thanks for sharing.',
  })
  content: string;

  @ApiProperty({
    description: 'When the comment was created',
    example: '2024-03-20T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the comment was last updated',
    example: '2024-03-20T10:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The ID of the post this comment belongs to',
    example: 1,
  })
  postId: number;

  constructor(props: Partial<CommentDetailsDto>) {
    Object.assign(this, props);
  }
}
