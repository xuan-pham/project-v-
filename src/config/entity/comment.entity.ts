import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './post.entity';
import { Users } from './user.entity';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  comment: string;

  @ManyToOne(() => Users)
  @JoinTable()
  author: Users;

  @ManyToOne(() => Posts, (post) => post.comments)
  post: Posts;
}
