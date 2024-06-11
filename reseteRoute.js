import { Router } from "express";
const route = Router();

import { NewsModel, CommentModel, LikeNewsModel } from "./src/database/db.js";

route.delete("/", async (req, res) => {
    await NewsModel.deleteMany({});
    await CommentModel.deleteMany({});
    await LikeNewsModel.deleteMany({});
    // await LikeCommentModel.deleteMany({});
    res.send({ message: "Data deleted" })
});
//for development only

export default route;
