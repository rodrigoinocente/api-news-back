import {Router} from "express";
// import userRouter from "./user.route";
import authRouter from "./auth.route";
// import newsRouter from "./news.route";
import swaggerRouter from "./swagger.route";
import reseteRouter from "../../reseteRoute"

const router = Router();

// router.use("/user", userRouter);
router.use("/auth", authRouter);
// router.use("/news", newsRouter);
router.use("/doc", swaggerRouter);
router.use("/resete", reseteRouter);

export default router;