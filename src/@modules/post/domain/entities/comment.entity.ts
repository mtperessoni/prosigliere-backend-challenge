export class Comment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  postId: number;

  constructor(props: Partial<Comment>) {
    Object.assign(this, props);
  }
}
