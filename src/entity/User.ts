import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Message } from './Message';
import { Opinion } from './Opinion';
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

  @Column('text', { name: 'first_name' })
  firstName: string;

  @Column('text', { name: 'last_name' })
  lastName: string;

  @Column('text')
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  occupation: string;

  @Column('text')
  location: string;

  @Column('date', { name: 'birth_date' })
  birthDate: string;

  @Column('text', { name: 'user_info' })
  userInfo: string;

  @Column('float', { default: 0 })
  karma: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    onUpdate: 'NOW()',
    nullable: true,
  })
  updatedAt: Date;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @OneToMany(() => Photo, photo => photo.user)
  photos: Photo[];

  @OneToMany(() => PhotoAlbum, photoAlbums => photoAlbums.user, {
    cascade: true,
  })
  photoAlbums: PhotoAlbum[];

  @ManyToOne(() => Photo, avatar => avatar.users)
  avatar: Photo;

  @OneToMany(() => Opinion, opinions => opinions.user)
  opinions: Opinion[];

  @OneToOne(() => Wall, wall => wall.user)
  wall: Wall;

  @ManyToMany(() => User, subscriber => subscriber.subscriptions)
  @JoinTable()
  subscribers: User[];

  @ManyToMany(() => User, subscription => subscription.subscribers)
  subscriptions: User[];

  @OneToMany(() => Message, message => message.author)
  sentMessages: Message[];

  @OneToMany(() => Message, message => message.recipient)
  receivedMessages: Message[];
}
