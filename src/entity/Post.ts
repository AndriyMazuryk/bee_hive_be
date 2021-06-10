import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Opinion } from './Opinion';
import { User } from './User';
import { Wall } from './Wall';

@Entity('posts')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  text: string;

  @Column('int', { name: 'votes_value', default: 0 })
  votesValue: number;

  @Column('int', { name: 'votes_count', default: 0 })
  votesCount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    onUpdate: 'NOW()',
    nullable: true,
  })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.posts)
  author: User;

  @ManyToOne(() => Wall, wall => wall.posts)
  wall: Wall;

  @OneToMany(() => Opinion, opinions => opinions.post)
  opinions: Opinion[];

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
}
