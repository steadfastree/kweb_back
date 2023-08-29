import * as express from "express";
import * as courseController from "../controller/course";
import auth from "../middlewares/auth";

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const router = express.Router();

router.use(auth);

router.get("/", courseController.getCourseList);

router.post("/register", courseController.courseRegister);

router.post("/enroll", courseController.courseEnroll);

router.post("/discard", courseController.courseDiscard);

router.post("/usercourse", courseController.getUserCourseList);

export default router;
