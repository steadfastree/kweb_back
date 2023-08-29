import dataSource from "../config/dataSource";
import { Course } from "../entity/course";
import { User } from "../entity/user";

const courseRepository = dataSource.getRepository(Course);
const userRepository = dataSource.getRepository(User);

//모든 리스트 가져오기
export const getCourseList = async () => {
  try {
    const courseList = await courseRepository.find();
    return courseList;
  } catch (err) {
    console.error("강의 리스트 오류 : ", err);
  }
};

//개설한 강의/수강신청한 강의 확인
export const getUserCourseList = async (userid: string) => {
  //특정 유저의 id와 연결된 course를 모두 조회 : 교수/학생에게 연결된 강의 조회
  try {
    const courseList = await userRepository.find({
      where: { userid: userid },
      relations: ["courses"],
    });
    return courseList;
  } catch (err) {
    console.error("강의실 오류 : ", err);
  }
};

//강의 등록
export const courseRegister = async (
  courseid: string,
  coursetitle: string,
  coursedescription: string,
  profid: string
) => {
  try {
    const course = await courseRepository.findOne({
      where: { courseid: courseid },
    });
    if (course) throw new Error(`${courseid}는 이미 존재하는 강의입니다.`);

    const prof = await userRepository.findOne({ where: { userid: profid } });
    if (!prof) throw new Error("존재하지 않는 교수 ID입니다.");

    const newCourse = new Course();
    newCourse.courseid = courseid;
    newCourse.coursetitle = coursetitle;
    newCourse.coursedescription = coursedescription;
    newCourse.users = [prof];
    await courseRepository.save(newCourse);

    console.log(`${courseid}가 등록되었습니다.`);
  } catch (err) {
    console.error("강의 개설 오류 : ", err);
  }
};

//수강 신청
export const courseEnroll = async (courseid: string, studentid: string) => {
  try {
    const course = await courseRepository.findOne({
      where: { courseid: courseid },
    });
    const student = await userRepository.findOne({
      where: { userid: studentid },
    });
    if (!course) throw new Error("존재하지 않는 강의입니다");
    if (!student) throw new Error("존재하지 않는 학생입니다.");

    course.users = [...course.users, student];
    await courseRepository.save(course);
  } catch (err) {
    console.error("수강 신청 오류 : ", err);
  }
};

//학생 수강 취소
export const courseDiscard = async (courseid: string, studentid: string) => {
  try {
    const course = await courseRepository.findOne({
      relations: { users: true },
      where: { courseid: courseid },
    });

    const student = await userRepository.findOne({
      where: { userid: studentid },
    });

    course.users = course.users.filter((user) => {
      return user.userid !== student.userid;
    });

    await courseRepository.save(course);
  } catch (err) {
    console.error("수강 취소 오류 : ", err);
  }
};

//이름, 기간, 시설, 장르로 검색
