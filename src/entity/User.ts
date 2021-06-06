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
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Photo } from './Photo';
import { PhotoAlbum } from './PhotoAlbum';
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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    onUpdate: 'NOW()',
    nullable: true,
  })
  updatedAt: Date;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @OneToMany(() => Photo, photo => photo.user)
  photos: Photo[];

  @OneToMany(() => PhotoAlbum, photoAlbums => photoAlbums.user)
  photoAlbums: PhotoAlbum[];

  @OneToOne(() => Photo, avatar => avatar.owner)
  @JoinColumn()
  avatar: Photo;

  @OneToOne(() => Wall, wall => wall.user)
  @JoinColumn()
  wall: Wall;

  @ManyToMany(() => User, subscriber => subscriber.subscriptions)
  @JoinTable()
  subscribers: User[];

  @ManyToMany(() => User, subscription => subscription.subscribers)
  subscriptions: User[];
}
