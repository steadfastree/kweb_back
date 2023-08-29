import { Request, Response, NextFunction } from "express";
import * as courseService from "../service/courseService";

export const getCourseList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseList = await courseService.getCourseList();
    res.status(200).json(courseList);
  } catch (err) {
    next(err);
  }
};

export const getUserCourseList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseList = await courseService.getUserCourseList(req.body.userid);
    res.status(200).json(courseList);
  } catch (err) {
    next(err);
  }
};

export const courseRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await courseService.courseRegister(
      req.body.courseid,
      req.body.coursetitle,
      req.body.coursedescription,
      req.body.profid
    );
    res.status(200).send("course register success");
  } catch (err) {
    next(err);
  }
};

export const courseEnroll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await courseService.courseEnroll(req.body.courseid, req.body.studentid);
    res.status(200).send("course enroll success");
  } catch (err) {
    next(err);
  }
};

export const courseDiscard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await courseService.courseDiscard(req.body.courseid, req.body.studentid);
    res.status(200).send("course discard success");
  } catch (err) {
    next(err);
  }
};
