import {Router} from "express";
import journalistRouter from "./journalist.route";
import authRouter from "./auth.route";
// import newsRouter from "./news.route";
import swaggerRouter from "./swagger.route";
import reseteRouter from "../../reseteRoute"

const router = Router();

router.use("/journalist", journalistRouter);
router.use("/auth", authRouter);
// router.use("/news", newsRouter);
router.use("/doc", swaggerRouter);
router.use("/resete", reseteRouter);

export default router;