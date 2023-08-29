import dataSource from "../config/dataSource";
import { User } from "../entity/user";
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

const salt = 10;
const userRepository = dataSource.getRepository(User);

//로그인
export const login = async (id: string, password: string) => {
  try {
    const user = await userRepository.findOne({
      where: { userid: id },
    });

    if (!user) throw new Error("존재하지 않는 아이디입니다.");

    const match = await bcrypt.compare(password, user.userpassword);
    if (!match) throw new Error("비밀번호가 일치하지 않습니다.");

    const accessToken = jwt.sign(
      { id: user.userid, name: user.username, isProf: user.isProf },
      process.env.SECRET_KEY,
      { expiresIn: "10s" } // 테스트 10s
    );
    const refreshToken = jwt.sign(
      { id: user.userid, name: user.username, isProf: user.isProf },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );
    const refreshTokenUpdate = async () => {
      await userRepository.update(
        { userid: id },
        { refreshtoken: refreshToken }
      );
    };
    refreshTokenUpdate();

    return [accessToken, refreshToken];
  } catch (err) {
    console.error("로그인 오류 : ", err.message);
  }
};
//회원가입
export const register = async (
  id: string,
  name: string,
  password: string,
  idnumber: string,
  isProf: boolean
) => {
  try {
    const user = await userRepository.findOne({ where: { userid: id } });
    const hash = await bcrypt.hash(password, salt);

    if (user) throw new Error("이미 존재하는 아이디입니다");

    await userRepository.insert({
      userid: id,
      username: name,
      userpassword: hash,
      useridnumber: idnumber,
      isProf: isProf,
    });
    console.log("가입 완료");
  } catch (err) {
    console.error("회원가입 오류 : ", err.message);
  }
};

export const logout = async (userid: string) => {
  //쿠키 삭제는 컨트롤러에서.
  try {
    await userRepository.update({ userid: userid }, { refreshtoken: null });
  } catch (err) {
    console.error("로그아웃 오류 : ", err.message);
  }
};
