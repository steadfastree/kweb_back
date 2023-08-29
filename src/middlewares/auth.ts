import dataSource from "../config/dataSource";
import { User } from "../entity/user";
import { Request, Response, NextFunction } from "express";

const jwt = require("jsonwebtoken");
const userRepository = dataSource.getRepository(User);

export const auth_prof = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accesstoken;
  const refreshToken = req.cookies.refreshtoken;

  if (accessToken) {
    try {
      const decodedAccessToken = await jwt.verify(
        accessToken,
        process.env.SECRET_KEY
      );
      const user = await userRepository.findOne({
        where: { userid: decodedAccessToken.id }, //토큰이 유효하고 해당 정보가 존재하면 next
      });
      if (decodedAccessToken.isProf) next();
      const notProf = new Error("접근 권한이 없습니다.");
      next(notProf);
    } catch {
      try {
        //쿠키가 유효하지 않을 경우
        const decodedRefreshToken = await jwt.verify(
          refreshToken,
          process.env.SECRET_KEY
        );
        const user = await userRepository.findOne({
          where: { userid: decodedRefreshToken.id },
        });
        const dbRefreshToken = await jwt.verify(
          user.refreshtoken,
          process.env.SECRET_KEY
        );
        console.log("Access Token이 만료되어, Refresh Token을 검증합니다.");
        //db 저장된 refreshToken과 쿠키의 refreshToken 변조 체크
        if (decodedRefreshToken.id == dbRefreshToken.id) {
          //accessToken 재발급
          console.log(
            "Refresh Token이 유효하므로 Access Token을 재발급합니다."
          );
          const accessToken = jwt.sign(
            { id: user.userid, name: user.username, isProf: user.isProf },
            process.env.SECRET_KEY,
            { expiresIn: "10s" }
          );
          res.cookie("accesstoken", accessToken, {
            httpOnly: true,
            secure: true,
          });
          if (user.isProf) next();
          const notProf = new Error("접근 권한이 없습니다.");
          next(notProf);
        } else {
          const invalidToken = new Error("Invalid Token");
          console.log("유효하지 않은 토큰입니다. 다시 로그인해 주세요.");
          next(invalidToken);
        }
      } catch {
        const commonError = new Error("Something broke");
        console.log("다시 로그인이 필요합니다.");
        next(commonError);
      }
    }
  } else {
    const noToken = new Error("Login first"); //토큰이 존재하지 않음
    console.log("로그인이 필요합니다.");
    next(noToken);
  }
};

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accesstoken;
  const refreshToken = req.cookies.refreshtoken;

  if (accessToken) {
    try {
      const decodedAccessToken = await jwt.verify(
        accessToken,
        process.env.SECRET_KEY
      );
      const user = await userRepository.findOne({
        where: { userid: decodedAccessToken.id }, //토큰이 유효하고 해당 정보가 존재하면 next
      });
      next();
    } catch {
      try {
        //쿠키가 유효하지 않을 경우
        const decodedRefreshToken = await jwt.verify(
          refreshToken,
          process.env.SECRET_KEY
        );
        const user = await userRepository.findOne({
          where: { userid: decodedRefreshToken.id },
        });
        const dbRefreshToken = await jwt.verify(
          user.refreshtoken,
          process.env.SECRET_KEY
        );
        console.log("Access Token이 만료되어, Refresh Token을 검증합니다.");
        //db 저장된 refreshToken과 쿠키의 refreshToken 변조 체크
        if (decodedRefreshToken.id == dbRefreshToken.id) {
          //accessToken 재발급
          console.log(
            "Refresh Token이 유효하므로 Access Token을 재발급합니다."
          );
          const accessToken = jwt.sign(
            { id: user.userid, name: user.username, isProf: user.isProf },
            process.env.SECRET_KEY,
            { expiresIn: "10s" }
          );
          res.cookie("accesstoken", accessToken, {
            httpOnly: true,
            secure: true,
          });
          next();
        } else {
          const invalidToken = new Error("Invalid Token");
          console.log("유효하지 않은 토큰입니다. 다시 로그인해 주세요.");
          next(invalidToken);
        }
      } catch {
        const commonError = new Error("Something broke");
        console.log("다시 로그인이 필요합니다.");
        next(commonError);
      }
    }
  } else {
    const noToken = new Error("Login first"); //토큰이 존재하지 않음
    console.log("로그인이 필요합니다.");
    next(noToken);
  }
};

/*
1. 두 토큰을 쿠키에서 가져온다
2. access가 null일 경우 return false한다
3. access가 null이 아닐 경우 체크한다.
    1. 유효하면 패스한다.
    2. 유효하지 않으면 refresh를 체크한다.
        1. 유효하면 access를 재발급하고 패스한다.
        2. 유효하지 않으면 return false한다.
*/

//access 유효성 체크 - 교수면 통과, 아니면 Error로 next 넘기기(접근할 수 없는 페이지입니다)
//access가 expire -> refresh token 검증. 교수면 통과하고 아니면 학생 에러.
