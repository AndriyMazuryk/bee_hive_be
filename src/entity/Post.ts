import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn} from "typeorm";
import { User } from "./User";

@Entity('posts')
export class Post extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    text: string;

    @Column("int")
    likes: number;

    @Column("int")
    dislikes: number;

    @Column("timestamptz")
    creationDate: Date;

    @Column("timestamptz")
    lastModificationDate: Date;

    @OneToOne(type => User)
    @JoinColumn()
    author: User

}