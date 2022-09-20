import { ProcessEnum } from 'src/commons/process/enum/process.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Process {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ProcessEnum, default: ProcessEnum.Pending })
  status: ProcessEnum;

  @Column({ type: 'json', default: {} })
  log: string;
}
