import mongoose from "mongoose";
import newsService from "../services/news.service";
import { CommentModel, LikeCommentModel, LikeNewsModel, LikeReplyModel, ReplyCommentModel } from "../database/db";
import { INews } from "../../custom";

const NewsSchema = new mongoose.Schema<INews>({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dataLikeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LikeNews",
    default: null,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  dataCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CommentDataList",
    default: null,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});
NewsSchema.pre("findOneAndDelete", async function (next) {
  const { _id: newsId } = this.getQuery();

  const news: INews | null = await newsService.findNewsByIdService(newsId);
  if (news) {
    if (news.dataLikeId) await LikeNewsModel.deleteOne(news.dataLikeId);
    if (news.dataCommentId) {
      const comments = await CommentModel.findById(news.dataCommentId);
      if (comments) {
        for (const comment of comments.comment) {
          if (comment.dataLikeId)
            await LikeCommentModel.deleteOne(comment.dataLikeId);
          if (comment.dataReplyId) {
            const replies = await ReplyCommentModel.findById(comment.dataReplyId);
            if (replies) {
              for (const reply of replies.reply) {
                if (reply.dataLikeId)
                  await LikeReplyModel.deleteOne(reply.dataLikeId);
              }
              await ReplyCommentModel.deleteOne(comment.dataReplyId);
            }
          }
        }
        await CommentModel.deleteOne(news.dataCommentId);
      }
    }
  }
  next();
});
export default NewsSchema;
