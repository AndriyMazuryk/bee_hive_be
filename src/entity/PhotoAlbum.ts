import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { Photo } from './Photo';

@Entity('photo_albums')
export class PhotoAlbum extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @CreateDateColumn({ type: 'timestamptz', default: 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    onUpdate: 'NOW()',
    nullable: true,
  })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.photoAlbums)
  user: User;

  @OneToMany(() => Photo, photo => photo.photoAlbum)
  photos: Photo[];
}
