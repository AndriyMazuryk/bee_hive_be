import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Wall } from './Wall';

@Entity('photos')
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  filename: string;

  @Column('text')
  mimetype: string;

  @Column('text')
  encoding: string;

  @Column('text')
  location: string;

  @Column('int', { default: 0 })
  likes: number;

  @Column('int', { default: 0 })
  dislikes: number;

  @CreateDateColumn({ type: 'timestamptz', default: 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    onUpdate: 'NOW()',
    nullable: true,
  })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.posts)
  author: User;

  @ManyToOne(() => Wall, wall => wall.posts)
  wall: Wall;
}
