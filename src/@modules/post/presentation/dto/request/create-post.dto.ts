import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    minLength: 3,
    example: 'My First Blog Post',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    minLength: 5,
    example: 'This is the content of my first blog post...',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  content: string;
}
