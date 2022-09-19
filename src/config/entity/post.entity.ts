import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  ManyToOne,
  RelationId,
  OneToMany,
} from 'typeorm';
import { Users } from './user.entity';
import { Comments } from './comment.entity';
import { Shares } from './share.entity';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text', { array: true, nullable: true })
  image: string[];

  @Column('text', { array: true, nullable: true })
  videos: string[];

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  @Index('post_authorId_index')
  @ManyToOne(() => Users, (author: Users) => author.posts)
  author: Users;

  @RelationId((post: Posts) => post.author)
  authorId: number;

  @OneToMany(() => Comments, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Shares, (shares) => shares.post)
  shares: Shares[];

  @Column({ default: false })
  isBlocked: boolean;
}
