import dataSource from "../config/dataSource";
import { Course } from "../entity/course";
import { User } from "../entity/user";
import { Post } from "../entity/post";

const courseRepository = dataSource.getRepository(Course);
const userRepository = dataSource.getRepository(User);
const postRepository = dataSource.getRepository(Post);

//모든 리스트 가져오기
export const getPostList = async () => {
  try {
    const postList = await postRepository.find();
    return postList;
  } catch (err) {
    console.error("게시물 리스트 오류 : ", err);
  }
};

//게시물 작성
export const postRegister = async (
  posttitle: string,
  postcontent: string,
  courseid: string
) => {
  try {
    const course = await courseRepository.findOne({
      where: { courseid: courseid },
    });
    await postRepository.insert({
      posttitle: posttitle,
      postcontent: postcontent,
      course: course,
    });
    console.log(`${posttitle}가 등록되었습니다.`);
  } catch (err) {
    console.error("게시물 작성 오류 : ", err);
  }
};

//코스 - 포스트로 이중 Join해서 리턴
export const getPostTimeline = async (userid: string) => {
  try {
    const postTimeline = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.courses", "course")
      .leftJoinAndSelect("course.posts", "post")
      .where("user.userid = :userid", { userid })
      .orderBy("post.postid", "ASC")
      .getMany();

    const filteredPostTimeline = postTimeline.map((user) => {
      const filteredCourses = user.courses.map((course) => {
        return {
          coursetitle: course.coursetitle,
          posts: course.posts.map((post) => ({
            postid: post.postid,
            posttitle: post.posttitle,
            postcontent: post.postcontent,
          })),
        };
      });

      return {
        userid: user.userid,
        courses: filteredCourses,
      };
    });

    console.log(filteredPostTimeline);

    return filteredPostTimeline;
  } catch (err) {
    console.error("타임라인 오류 : ", err);
  }
};
