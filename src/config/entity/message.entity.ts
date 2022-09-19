import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  idRoom: string;

  @Column({ nullable: false })
  idUser: string;

  @Column({ nullable: false })
  name: string;

  @Column('text')
  text: string;
}
