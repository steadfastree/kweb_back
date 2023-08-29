import * as express from "express";
import courseRouter from "./course";
import postRouter from "./post";
import { auth } from "../middlewares/auth";

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const router = express.Router();

router.use(auth);

router.use("/course", courseRouter);
router.use("/post", postRouter);

export default router;
