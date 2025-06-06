import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    minLength: 3,
    example: 'Great post! Thanks for sharing.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  content: string;
}
