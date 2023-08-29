import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Course } from "./course";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  postid: string;

  @Column()
  posttitle: string;

  @Column()
  postcontent: string;

  @ManyToOne((type) => Course, (course) => course.posts)
  course: Course;
}
