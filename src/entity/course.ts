import { Entity, PrimaryColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { User } from "./user";
import { Post } from "./post";

@Entity()
export class Course {
  @PrimaryColumn()
  courseid: string;

  @Column()
  coursetitle: string;

  @Column()
  coursedescription: string;

  @OneToMany((type) => Post, (post) => post.course)
  posts: Post[];

  @ManyToMany((type) => User, (user) => user.courses)
  users: User[];
}
