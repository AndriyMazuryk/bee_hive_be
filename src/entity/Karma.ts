import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Entity('karmas')
export class Karma extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { default: 0 })
  value: number;

  @Column('int', { default: 0 })
  votes: number;

  @Column('int', { default: 0 })
  veryGood: number;

  @Column('int', { default: 0 })
  good: number;

  @Column('int', { default: 0 })
  neutral: number;

  @Column('int', { default: 0 })
  bad: number;

  @Column('int', { default: 0 })
  veryBad: number;

  @OneToOne(() => Post, post => post.karma)
  post: Post;

  @OneToMany(() => User, voters => voters.karma)
  voters: User[];
}
