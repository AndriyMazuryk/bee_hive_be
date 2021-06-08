import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Entity('opinions')
export class Opinion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('boolean', { default: false })
  veryGood: boolean;

  @Column('boolean', { default: false })
  good: boolean;

  @Column('boolean', { default: false })
  neutral: boolean;

  @Column('boolean', { default: false })
  bad: boolean;

  @Column('boolean', { default: false })
  veryBad: boolean;

  @ManyToOne(() => User, user => user.opinions)
  user: User;

  @ManyToOne(() => Post, post => post.opinions)
  post: Post;
}
