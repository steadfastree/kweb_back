import { Entity, PrimaryColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Course } from "./course";

@Entity()
export class User {
  @PrimaryColumn()
  userid: string;

  @Column()
  userpassword: string;

  @Column()
  username: string;

  @Column()
  useridnumber: string;

  @Column()
  isProf: boolean;

  @Column({ nullable: true })
  refreshtoken: string;

  @ManyToMany((type) => Course, (course) => course.users)
  @JoinTable()
  courses: Course[];
}
