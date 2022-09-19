import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class FriendTo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  friends: number;

  @Column({ default: false })
  isStatus: boolean;

  @ManyToOne(() => Users, (users) => users.friendto)
  user: Users;
}
