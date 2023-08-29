import { Request, Response, NextFunction } from "express";
import * as postService from "../service/postService";

export const getPostList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postList = await postService.getPostList();
    res.status(200).json(postList);
  } catch (err) {
    next(err);
  }
};

export const postRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await postService.postRegister(
      req.body.posttitle,
      req.body.postcontent,
      req.body.courseid
    );
    res.status(200).send("post register success");
  } catch (err) {
    next(err);
  }
};

export const getPostTimeline = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postList = await postService.getPostTimeline(req.body.userid);
    res.status(200).json(postList);
  } catch (err) {
    next(err);
  }
};
