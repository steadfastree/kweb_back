import * as express from "express";
import userRouter from "./user";
import studentRouter from "./student";
import profRouter from "./prof";
const router = express.Router();
router.use(express.urlencoded({ extended: true })); //바디 파싱

router.use("/user", userRouter);

router.use("/student", studentRouter);

router.use("/prof", profRouter);

router.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

export default router;
