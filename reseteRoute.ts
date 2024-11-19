import { Router } from "express";
const route = Router();

import {  Request, Response } from "express";
import { NewsModel, JournalistModel } from "./src/database/db";

route.delete("/", async (req: Request, res: Response) => {
    await NewsModel.deleteMany({});
    await JournalistModel.deleteMany({});
    res.send({ message: "Data deleted" })
});
//for development only

export default route;
