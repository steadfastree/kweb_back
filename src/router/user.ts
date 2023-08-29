import * as express from "express";
import * as userController from "../controller/user";
import { auth } from "../middlewares/auth";

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const router = express.Router();

router.post("/login", userController.login);

router.post("/register", userController.register);

router.post("/logout", userController.logout);

export default router;
