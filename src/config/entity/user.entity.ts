import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../commons/role/enum/role.enum';
import { FriendTo } from './friends.entity';
import { Posts } from './post.entity';
import { Shares } from './share.entity';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  isStatus: boolean;

  @Column({ default: false })
  isRegisteredWithGoogle: boolean;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @OneToMany(() => Posts, (post: Posts) => post.author)
  posts?: Posts[];

  @Column({ nullable: true })
  currentHashedRefreshToken?: string;

  @OneToMany(() => FriendTo, (friendto) => friendto.user)
  friendto?: FriendTo[];

  @OneToMany(() => Shares, (share: Shares) => share.user)
  shares?: Shares[];
}
