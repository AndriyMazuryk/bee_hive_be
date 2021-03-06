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
import { PhotoAlbum } from './PhotoAlbum';
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
  url: string;

  @Column('boolean', { name: 'is_avatar', default: false })
  isAvatar: boolean;

  @Column('int', { default: 0 })
  likes: number;

  @Column('int', { default: 0 })
  dislikes: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    onUpdate: 'NOW()',
    nullable: true,
  })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.photos)
  user: User;

  @ManyToOne(() => PhotoAlbum, photoAlbum => photoAlbum.photos)
  photoAlbum: PhotoAlbum;

  @OneToMany(() => User, users => users.avatar)
  users: User[];
}
