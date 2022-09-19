import { Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Posts } from './post.entity';
import { Users } from './user.entity';

@Entity()
export class Shares {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (users: Users) => users.shares)
  user: Users;

  @ManyToOne(() => Posts, (posts: Posts) => posts.shares)
  post: Posts;
}
