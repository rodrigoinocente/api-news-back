import { Router } from "express";
import authController from "../controllers/auth.controller";

const route = Router();

route.post("/", authController.loginService);

export default route;