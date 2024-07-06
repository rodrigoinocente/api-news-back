import { Router } from "express";
const route = Router();

import {  Request, Response } from "express";
import { NewsModel, CommentModel, LikeNewsModel, LikeCommentModel, ReplyCommentModel, LikeReplyModel } from "./src/database/db";

route.delete("/", async (req: Request, res: Response) => {
    await NewsModel.deleteMany({});
    await CommentModel.deleteMany({});
    await LikeNewsModel.deleteMany({});
    await LikeCommentModel.deleteMany({});
    await ReplyCommentModel.deleteMany({});
    await LikeReplyModel.deleteMany({});
    res.send({ message: "Data deleted" })
});
//for development only

export default route;
