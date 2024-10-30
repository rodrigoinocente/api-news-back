import { Types } from "mongoose";
import { ICommentNews, ICreateAndUpdateNewsBody, ILikeNews, INews, IReplyComment, Paginated} from "../../custom";
import newsRepositories from "../repositories/news.repositories";

const createNewsService = async (body: ICreateAndUpdateNewsBody, user: Types.ObjectId): Promise<INews> => {
    const { title, text, banner } = body;
    if (!title || !text || !banner) throw new Error("Submit all fields to post");

    const newsData = { ...body, user };
    const news: INews = await newsRepositories.createNewsRepositories(newsData);

    return news
};

const findAllNewsService = async (offset: number, limit: number, currentUrl: string): Promise<Paginated> => {

    const news: INews[] = await newsRepositories.findAllNewsRepositories(offset, limit);
    const total: number = await newsRepositories.countNewsRepositories();

    const next = offset + limit;
    const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

    if (news.length === 0)
        throw new Error("No news found");

    return ({
        nextUrl,
        previousUrl,
        offset,
        total,
        news
    });
};

const topNewsService = async (): Promise<INews> => {
    const news: INews | null = await newsRepositories.topNewsRepositories();
    if (!news)
        throw new Error("No news found")

    return news;
};

const findByIdService = async (newsId: Types.ObjectId): Promise<INews> => {
    const news: INews | null = await newsRepositories.findNewsByIdRepositories(newsId);
    if (!news)
        throw new Error("No news found")

    return news;
};

const searchByTitleService = async (title: string): Promise<INews[]> => {
    const news: INews[] | [] = await newsRepositories.searchByTitleRepositories(title);
    if (news.length === 0)
        throw new Error("No news found");

    return news;
};

const newsByUserService = async (userId: string): Promise<INews[]> => {
    const news: INews[] | [] = await newsRepositories.newsByUserRepositories(userId);
    if (news.length === 0)
        throw new Error("No news found");

    return news;
};

const updateNewsService = async (newsId: Types.ObjectId, body: ICreateAndUpdateNewsBody, userLoggedId: Types.ObjectId): Promise<INews> => {
    const { title, text, banner } = body;


    if (!title && !text && !banner)
        throw new Error("Submit at least one fields to update the post");

    const news: INews | null = await newsRepositories.findNewsByIdRepositories(newsId);
    if (!news)
        throw new Error("News not found");

    if (String(news.user._id) !== String(userLoggedId))
        throw new Error("You didn't update this post");

    const newsUpdate: INews | null = await newsRepositories.upDateRepositories(newsId, title, text, banner);
    if (!newsUpdate)
        throw new Error("An unexpected error occurred");

    return newsUpdate;

};

const eraseNewsService = async (newsId: Types.ObjectId, userLoggedId: Types.ObjectId): Promise<INews> => {
    const news: INews | null = await newsRepositories.findNewsByIdRepositories(newsId)
    if (!news)
        throw new Error("News not found");

    if (String(news.user._id) !== String(userLoggedId))
        throw new Error("You didn't delete this post");

    const newsDeleted = await newsRepositories.eraseNewsRepositories(news._id);
    if (!newsDeleted)
        throw new Error("An unexpected error occurred");

    return newsDeleted;
};

const likeNewsService = async (newsId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> => {
    const news: INews | null = await newsRepositories.findNewsByIdRepositories(newsId);
    if (!news)
        throw new Error("News not found");

    if (!news.dataLikeId) {
        const newDataLike = await newsRepositories.createNewsDataLikeRepositories(news._id, userId);
        if (!newDataLike) throw new Error("An unexpected error occurred");

        const updateNewsDataLikeId = await newsRepositories.updateNewsDataLikeId(news._id, newDataLike._id)
        if (!updateNewsDataLikeId) throw new Error("An unexpected error occurred");
        return await checkLikeNews(newDataLike._id, userId)
    }

    const isLiked = await newsRepositories.isUserInLikeNewsArray(news.dataLikeId, userId);
    if (!isLiked) {
        await newsRepositories.likeNewsRepositories(news.dataLikeId, userId);

        return await checkLikeNews(news.dataLikeId, userId)
    } else {
        await newsRepositories.deleteLikeNewsRepositories(news.dataLikeId, userId);

        return await checkLikeNews(news.dataLikeId, userId)
    }
};

const checkLikeNews = async (newsDataLike: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> => {
    const checkLike = await newsRepositories.isUserInLikeNewsArray(newsDataLike, userId)
    if (checkLike) return true
    else return false
};

const getPaginatedLikesService = async (limit: number, offset: number, currentUrl: string, newsId: Types.ObjectId): Promise<Paginated> => {
    const news: INews | null = await newsRepositories.findNewsByIdRepositories(newsId);
    if (!news)
        throw new Error("News not found");

    const total: number = news.likeCount;

    const likes: ILikeNews[] = await newsRepositories.likesPipelineRepositories(news.dataLikeId, offset, limit);
    if (likes.length === 0) throw new Error("There are no registered likes");

    const next = offset + limit;
    const nextUrl = next < total ? `${currentUrl}/likePage/${news._id}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl = previous != null ? `${currentUrl}/likePage/${news._id}?limit=${limit}&offset=${previous}` : null;

    return ({
        nextUrl,
        previousUrl,
        offset,
        total,
        likes
    });
};

const addCommentService = async (newsId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<ICommentNews> => {
    if (!content) throw new Error("Write a message to comment");

    const news: INews | null = await newsRepositories.findNewsByIdRepositories(newsId);
    if (!news) throw new Error("News not found");

    if (!news.dataCommentId) {
        const createdDataComment = await newsRepositories.createCommentDataRepositories(news._id, userId, content);
        if (!createdDataComment) throw new Error("Failed to create comment");

        const updateNewsDataCommentId = await newsRepositories.updateNewsDataCommentId(news._id, createdDataComment._id)
        if (!updateNewsDataCommentId) throw new Error("Failed to create comment");

        return createdDataComment;
    } else {
        const upDateComment = await newsRepositories.upDateCommentDataRepositories(news.dataCommentId, userId, content);
        if (!upDateComment) throw new Error("Failed to create comment");

        return upDateComment;
    }
};

const deleteCommentService = async (dataCommentId: Types.ObjectId, commentId: Types.ObjectId, userId: Types.ObjectId): Promise<void> => {
    const comment: ICommentNews | null = await newsRepositories.findCommentByIdRepositories(dataCommentId, commentId)
    if (!comment)
        throw new Error("Comment not found");

    if (String(comment.comment[0].userId) !== String(userId))
        throw new Error("You can't delete this comment")

    const commentDelete = await newsRepositories.deleteCommentRepositories(dataCommentId, commentId)
    if (commentDelete === null)
        throw new Error("Failed to delete comment")
};

const getPaginatedCommentsService = async (newsId: Types.ObjectId, limit: number, offset: number, currentUrl: string): Promise<Paginated> => {
    const news: INews | null = await newsRepositories.findNewsByIdRepositories(newsId);
    if (!news)
        throw new Error("News not found");

    const total: number = news.commentCount;

    const comments: ICommentNews[] = await newsRepositories.commentsPipelineRepositories(news.dataCommentId, offset, limit);
    if (comments.length === 0)
        throw new Error("There are no registered comments")

    const next = offset + limit;
    const nextUrl = next < total ? `${currentUrl}/commentPage/${news._id}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl = previous != null ? `${currentUrl}/commentPage/${news._id}?limit=${limit}&offset=${previous}` : null;

    return ({
        nextUrl,
        previousUrl,
        offset,
        total,
        comments
    });
};

const likeCommentService = async (dataCommentId: Types.ObjectId, commentId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> => {
    const comment = await newsRepositories.findCommentByIdRepositories(dataCommentId, commentId);
    if (!comment) throw new Error("Comment not found")

    const commentDataLikeId = comment.comment[0].dataLikeId;
    if (!commentDataLikeId) {
        const newDataLike = await newsRepositories.createLikeCommentDataRepositories(dataCommentId, commentId, userId);
        if (!newDataLike) throw new Error("An unexpected error occurred");

        const updateCommentDataLikeId = await newsRepositories.updateCommentDataLikeId(dataCommentId, commentId, newDataLike._id)
        if (!updateCommentDataLikeId) throw new Error("An unexpected error occurred");

        return await checkLikeComment(newDataLike._id, userId);
    }

    const isLiked = await newsRepositories.isUserInLikeCommentArray(commentDataLikeId, userId);
    if (!isLiked) {
        await newsRepositories.likeCommentRepositories(commentDataLikeId, userId);

        return await checkLikeComment(commentDataLikeId, userId);
    } else {
        await newsRepositories.deleteLikeCommentRepositories(commentDataLikeId, userId);

        return await checkLikeComment(commentDataLikeId, userId);
    }
};

const checkLikeComment = async (commentDataLike: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> => {
    const checkLike = await newsRepositories.isUserInLikeCommentArray(commentDataLike, userId)
    if (checkLike) return true
    else return false
};

const addReplyCommentService = async (dataCommentId: Types.ObjectId, commentId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<IReplyComment> => {
    if (!content)
        throw new Error("Write a message to reply")

    const comment: ICommentNews | null = await newsRepositories.findCommentByIdRepositories(dataCommentId, commentId);
    if (!comment) throw new Error("Comment not found")

    const commentDataReplyId = comment.comment[0].dataReplyId;
    if (!commentDataReplyId) {
        const newDataReply = await newsRepositories.createReplyCommentDataRepositories(dataCommentId, commentId, userId, content);
        if (!newDataReply) throw new Error("Failed to create reply")

        const updateCommentDataReply = await newsRepositories.updateCommentDataReplyRepositories(dataCommentId, commentId, newDataReply._id);
        if (!updateCommentDataReply) throw new Error("Failed to create reply")

        return newDataReply;
    } else {
        const newReply = await newsRepositories.addReplyCommentDataRepositories(commentDataReplyId, userId, content);
        if (!newReply) throw new Error("Failed to add response")

        return newReply;
    }
};

const deleteReplyService = async (dataReplyId: Types.ObjectId, replyId: Types.ObjectId, userId: Types.ObjectId): Promise<IReplyComment> => {
    const reply: IReplyComment | null = await newsRepositories.findReplyByIdRepositories(dataReplyId, replyId);
    console.log("reply: ", reply);
    if (!reply)
        throw new Error("Reply not found")

    if (String(reply.reply[0].userId) !== String(userId))
        throw new Error("You can't delete this reply")

    const replyDeleted = await newsRepositories.deleteReplyCommentRepositories(dataReplyId, replyId);
    console.log("replyDeleted: ", replyDeleted);
    if (!replyDeleted)
        throw new Error("Failed to delete reply")

    return reply
};

const getPaginatedReplyService = async (dataCommentId: Types.ObjectId, commentId: Types.ObjectId, limit: number, offset: number, currentUrl: string): Promise<Paginated> => {
    const comment: ICommentNews | null = await newsRepositories.findCommentByIdRepositories(dataCommentId, commentId)
    if (!comment)
        throw new Error("Comment not found");

    const dataReplyId = comment.comment[0].dataReplyId;
    const total: number = comment.comment[0].replyCount;

    const replies: IReplyComment[] = await newsRepositories.replyCommentsPipelineRepositories(dataReplyId, offset, limit);
    if (!replies)
        throw new Error("Failed to retrieve replies")
    if (replies.length === 0){
        console.log("PASSOU AQUI");
        throw new Error("There are no registered replies");}

    const next = offset + limit;
    const nextUrl = next < total ? `${currentUrl}/replyPage/${dataCommentId}/${commentId}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl = previous != null ? `${currentUrl}/replyPage/${dataCommentId}/${commentId}?limit=${limit}&offset=${previous}` : null;

    return ({
        nextUrl,
        previousUrl,
        offset,
        total,
        replies
    })
};

const likeReplyService = async (dataReplyId: Types.ObjectId, replyId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> => {
    const reply = await newsRepositories.findReplyByIdRepositories(dataReplyId, replyId);
    if (!reply) throw new Error("Reply not found")

    const replyDataLikeId = reply.reply[0].dataLikeId;
    if (!replyDataLikeId) {
        const newDataLike = await newsRepositories.createLikeReplyDataRepositories(dataReplyId, replyId, userId);
        if (!newDataLike) throw new Error("An unexpected error occurred");

        const updateReplyDataLike = await newsRepositories.updateReplyDataLikeRepositories(dataReplyId, replyId, newDataLike._id);
        if (!updateReplyDataLike) throw new Error("An unexpected error occurred");

        return await checkLikeReply(newDataLike._id, userId);
    }

    const isLiked = await checkLikeReply(replyDataLikeId, userId);
    if (!isLiked) {
        await newsRepositories.likeReplyRepositories(replyDataLikeId, userId);

        return await checkLikeReply(replyDataLikeId, userId);
    } else {
        await newsRepositories.deleteLikeReplyRepositories(replyDataLikeId, userId);

        return await checkLikeReply(replyDataLikeId, userId);
    }
};

const checkLikeReply = async (commentDataLike: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> => {
    const checkLike = await newsRepositories.isUserInLikeReplyArray(commentDataLike, userId)
    if (checkLike) return true
    else return false
};



export default {
    createNewsService,
    findAllNewsService,
    topNewsService,
    findByIdService,
    searchByTitleService,
    newsByUserService,
    updateNewsService,
    eraseNewsService,
    likeNewsService,
    addCommentService,
    deleteCommentService,
    addReplyCommentService,
    deleteReplyService,
    likeCommentService,
    getPaginatedCommentsService,
    getPaginatedLikesService,
    getPaginatedReplyService,
    likeReplyService
};