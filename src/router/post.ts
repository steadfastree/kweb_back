import * as express from "express";
import * as postController from "../controller/post";

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const router = express.Router();

router.get("/", postController.getPostList);

router.post("/register", postController.postRegister);

router.post("/timeline", postController.getPostTimeline);

export default router;
