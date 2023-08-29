import * as express from "express";
import courseRouter from "./course";
import postRouter from "./post";
import { auth_prof } from "../middlewares/auth";

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const router = express.Router();

router.use(auth_prof);

router.use("/course", courseRouter);
router.use("/post", postRouter);

export default router;
