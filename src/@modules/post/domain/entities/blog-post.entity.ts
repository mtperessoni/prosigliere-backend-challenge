import { Comment } from './comment.entity';

export class BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  commentsCount?: number;
  comments: Comment[] = [];

  constructor(props: Partial<BlogPost>) {
    if (props.id !== undefined) this.id = props.id;
    if (props.title !== undefined) this.title = props.title;
    if (props.content !== undefined) this.content = props.content;
    if (props.createdAt !== undefined) this.createdAt = props.createdAt;
    if (props.updatedAt !== undefined) this.updatedAt = props.updatedAt;
    if (props.commentsCount !== undefined) this.commentsCount = props.commentsCount;
    if (props.comments !== undefined) this.comments = props.comments;
  }
}
