import { Router } from "express";
import journalistRouter from "./journalist.route";
import authRouter from "./auth.route";
import newsAdminRouter from "./newsAdmin.route";
import newsPublicRouter from "./newsPublic.route";
import columnAdminRouter from "./columnAdmin.route";
import swaggerRouter from "./swagger.route";
import reseteRouter from "../../reseteRoute"

const router = Router();

router.use("/journalist", journalistRouter);
router.use("/auth", authRouter);
router.use("/newsAdmin", newsAdminRouter);
router.use("/newsPublic", newsPublicRouter);
router.use("/columnAdmin", columnAdminRouter);
router.use("/doc", swaggerRouter);
router.use("/resete", reseteRouter);

export default router;