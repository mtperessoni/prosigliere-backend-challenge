import { ApiProperty } from '@nestjs/swagger';
import { CommentDetailsDto } from './comment-details.dto';

export class PostDetailsDto {
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
    description: 'The content of the post',
    example: 'This is the content of my first blog post...',
  })
  content: string;

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

  @ApiProperty({
    description: 'Number of comments on the post',
    example: 5,
    required: false,
  })
  commentsCount?: number;

  @ApiProperty({
    description: 'Comments on the post',
    type: [CommentDetailsDto],
    example: [],
  })
  comments: CommentDetailsDto[] = [];

  constructor(props: Partial<PostDetailsDto>) {
    Object.assign(this, props);
  }
}
