import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Post } from './Post';
import { Wall } from './Wall';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { default: 0 })
  count: number;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('text')
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  occupation: string;

  @Column('text')
  location: string;

  @Column('date')
  birthDate: string;

  @Column('text')
  userInfo: string;

  @CreateDateColumn({ type: 'timestamptz', default: 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    onUpdate: 'NOW()',
    nullable: true,
  })
  updatedAt: Date;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @OneToOne(() => Wall, wall => wall.user)
  @JoinColumn()
  wall: Wall;

  @ManyToOne(() => User, user => user.subscriptions)
  subscription: User;

  @OneToMany(() => User, user => user.subscription)
  subscriptions: User[];

  @ManyToOne(() => User, user => user.subscribers)
  subscriber: User;

  @OneToMany(() => User, user => user.subscriber)
  subscribers: User[];
}
