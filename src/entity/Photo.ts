import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from './User';

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

  @Column('boolean', { default: false })
  isAvatar: boolean;

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

  @ManyToOne(() => User, user => user.photos)
  user: User;

  @OneToOne(() => User, user => user.avatar)
  avatar: User;
}
