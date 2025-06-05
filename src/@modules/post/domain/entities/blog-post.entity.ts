import { Comment } from './comment.entity';

export class BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[] = [];

  constructor(props: Partial<BlogPost>) {
    Object.assign(this, props);
  }
}
