import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity('messages')
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  text: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    onUpdate: 'NOW()',
    nullable: true,
  })
  updatedAt: Date;

  @ManyToOne(() => User, author => author.sentMessages)
  @JoinTable()
  author: User;

  @ManyToOne(() => User, recipient => recipient.receivedMessages)
  @JoinTable()
  recipient: User;
}
