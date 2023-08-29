import { Request, Response, NextFunction } from "express";
import * as userService from "../service/userService";
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokens = await userService.login(req.body.id, req.body.password);
    res.cookie("accesstoken", tokens[0], { httpOnly: true, secure: true }); //보안
    res.cookie("refreshtoken", tokens[1], { httpOnly: true, secure: true });
    res.status(200).send("login success");
  } catch (err) {
    next(err);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    await userService.register(
      req.body.id,
      req.body.name,
      req.body.password,
      req.body.idnumber,
      req.body.isProf
    );
    res.status(200).send("register success");
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await userService.logout(req.body.id);
    res.clearCookie("accesstoken", { httpOnly: true, secure: true });
    res.clearCookie("refreshtoken", { httpOnly: true, secure: true });
    res.status(200).send("logout success");
  } catch (err) {
    next(err);
  }
};
