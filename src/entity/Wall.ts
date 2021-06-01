import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Entity('walls')
export class Wall extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.wall)
  user: User;

  @OneToMany(() => Post, post => post.wall)
  posts: Post[];
}
