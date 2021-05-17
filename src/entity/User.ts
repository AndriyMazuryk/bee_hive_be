import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int", { default: 0 })
  count: number;

  @Column("text")
  firstName: string;

  @Column("text")
  lastName: string;

  @Column("text")
  email: string;

  @Column("text")
  password: string;

  @Column("text")
  occupation: string;

  @Column("text")
  location: string;

  @Column("date")
  birthDate: string;

  @Column("text")
  userInfo: string;

  @CreateDateColumn({ type: "timestamptz", default: "NOW()" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", onUpdate: "NOW()", nullable: true })
  updatedAt: Date;
}
