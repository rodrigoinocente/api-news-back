import newsService from "../services/news.service.js";

const create = async (req, res) => {
    try {
        const { title, text, banner } = req.body;

        if (!title && !text && !banner) {
            return res.status(400).send({ message: "Submit all fields for registration" });
        }

        await newsService.createNewsService({
            title,
            text,
            banner,
            user: req.userId,
        });

        res.sendStatus(201);

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const findAll = async (req, res) => {
    try {
        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if (!limit) {
            limit = 5;
        }

        if (!offset) {
            offset = 0;
        }

        const news = await newsService.findAllNewsService(offset, limit);
        const total = await newsService.countNewsService();
        const currentUrl = req.baseUrl;

        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

        if (news.length === 0) {
            return res.status(400).send({ message: "There are no registered news" });
        }

        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,

            results: news.map((item) => ({
                newsId: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                datalikes: item.dataLike,
                likeCount: item.likeCount,
                dataComment: item.dataComment,
                commentCount: item.commentCount,
                comments: item.comments,
                name: item.user.name,
                userName: item.user.username,
            })),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const topNews = async (req, res) => {
    try {
        const news = await newsService.topNewsService();

        res.send({
            news: {
                newsId: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                userName: news.user.username,
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const findById = async (req, res) => {
    try {
        const news = req.news;

        return res.send({
            news: {
                newsId: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                dataLike: news.dataLike,
                likeCount: news.likeCount,
                dataComment: news.dataComment,
                commentCount: news.commentCount,
                name: news.user.name,
                userName: news.user.username,
            },
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query;

        const news = await newsService.searchByTitleService(title);

        if (news.length === 0) {
            return res.status(400).send({ message: "There are no posts with this title" });
        }

        return res.send({
            news: {
                results: news.map((item) => ({
                    newsId: item._id,
                    title: item.title,
                    text: item.text,
                    banner: item.banner,
                    likes: item.likes,
                    comments: item.comments,
                    name: item.user.name,
                    userName: item.user.username,
                })),
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const newsByUser = async (req, res) => {
    try {
        const userId = req.userId;
        const news = await newsService.newsByUserService(userId);

        return res.send({
            news: {
                results: news.map((item) => ({
                    id: item._id,
                    title: item.title,
                    text: item.text,
                    banner: item.banner,
                    likes: item.likes,
                    comments: item.comments,
                    name: item.user.name,
                    userName: item.user.username,
                })),
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const upDate = async (req, res) => {
    try {
        const { title, text, banner } = req.body;
        const news = req.news;

        if (!title && !text && !banner) {
            return res.status(400).send({ message: "Submit at least one fields to update the post" });
        }

        if (String(news.user._id) !== req.userId) {
            return res.status(400).send({ message: "You didn't update this post" });
        }

        await newsService.upDateService(news._id, title, text, banner);
        return res.send({ message: "Post successfully updated" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const erase = async (req, res) => {
    try {
        const news = req.news;

        if (String(news.user._id) !== req.userId) {
            return res.status(400).send({ message: "You didn't delete this post" });
        }

        await newsService.eraseService(news._id);

        return res.send({ message: "Post deleted successfully" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const likeNews = async (req, res) => {
    try {
        const news = req.news;
        const userId = req.userId;

        if (!news.dataLike) {
            await newsService.createNewsDataLikeService(news._id, userId);
            return res.send({ message: "Like done successfully" });
        }

        const isLiked = await newsService.isUserInLikeNewsArray(news.dataLike, userId);
        if (!isLiked) {
            await newsService.likeNewsService(news.dataLike, userId);
            return res.send({ message: "Like done successfully" });
        } else {
            await newsService.deleteLikeNewsService(news.dataLike, userId);
            return res.status(200).send({ message: "Like successfully removed" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const getPaginatedLikes = async (req, res) => {
    try {
        const news = req.news;
        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if (!limit) limit = 10;
        if (!offset) offset = 0;

        const total = news.likeCount;
        const currentUrl = req.baseUrl;
        const likes = await newsService.likesPipelineService(news.dataLike, offset, limit);
        if (likes.length === 0) return res.status(400).send({ message: "There are no registered likes" });

        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}/likePage/${news._id}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null ? `${currentUrl}/likePage/${news._id}?limit=${limit}&offset=${previous}` : null;

        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,
            likes
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const addComment = async (req, res) => {
    try {
        const news = req.news;
        const userId = req.userId;
        const { content } = req.body;

        if (!content) return res.status(400).send({ message: "Write a message to comment" });

        if (!news.dataComment) {
            await newsService.createCommentDataService(news._id, userId, content);
            return res.send({ message: "Comment successfully completed" });
        } else {
            await newsService.upDateCommentDataService(news.dataComment, userId, content);
            res.send({ message: "Comment successfully completed" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const deleteComment = async (req, res) => {
    try {
        const { dataCommentId, commentId } = req.params;
        const comment = req.comment;
        const userId = req.userId;

        if (String(comment.comment[0].userId) !== userId) return res.status(400).send({ message: "You can't delete this comment" });

        await newsService.deleteCommentService(dataCommentId, commentId)
        res.send({ message: "Comment successfully removed" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const getPaginatedComments = async (req, res) => {
    try {
        const news = req.news;
        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if (!limit) limit = 10;
        if (!offset) offset = 0;

        const total = news.commentCount;
        const currentUrl = req.baseUrl;
        const comments = await newsService.commentsPipelineService(news.dataComment, offset, limit);
        if (comments.length === 0) return res.status(400).send({ message: "There are no registered comments" });

        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}/commentPage/${news._id}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null ? `${currentUrl}/commentPage/${news._id}?limit=${limit}&offset=${previous}` : null;

        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,
            comments
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const likeComment = async (req, res) => {
    try {
        const { dataCommentId, commentId } = req.params;
        const userId = req.userId;
        const comment = req.comment;

        const commentDataLikeId = comment.comment[0].dataLike;
        if (!commentDataLikeId) {
            await newsService.createLikeCommentDataService(dataCommentId, commentId, userId);
            return res.send({ message: "Like done successfully" });
        }

        const isLiked = await newsService.isUserInLikeCommentArray(commentDataLikeId, userId);
        if (!isLiked) {
            await newsService.likeCommentService(commentDataLikeId, userId);
            return res.status(200).send({ message: "Like done successfully" });
        } else {
            await newsService.deleteLikeCommentService(commentDataLikeId, userId);
            return res.status(200).send({ message: "Like successfully removed" });

        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const addReplyComment = async (req, res) => {
    try {
        const comment = req.comment;
        const { dataCommentId, commentId } = req.params;
        const userId = req.userId;
        const { content } = req.body;
        if (!content) return res.status(400).send({ message: "Write a message to reply" });

        const commentDataReplyId = comment.comment[0].dataReply;
        if (!commentDataReplyId) {
            await newsService.createReplyCommentDataService(dataCommentId, commentId, userId, content);
            return res.status(200).send({ message: "Reply successfully completed" });
        } else {
            await newsService.upDateReplyCommentDataService(commentDataReplyId, userId, content);
            return res.status(200).send({ message: "Reply successfully completed" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const deleteReply = async (req, res) => {
    try {
        const { dataReplyId, replyId } = req.params;
        const userId = req.userId;
        const reply = req.reply;

        if (String(reply.reply[0].userId) !== userId) return res.status(400).send({ message: "You can't delete this reply" });

        await newsService.deleteReplyCommentService(dataReplyId, replyId);
        res.send({ message: "Reply successfully removed" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const getPaginatedReply = async (req, res) => {
    try {
        const { dataCommentId, commentId } = req.params;
        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if (!limit) limit = 10;
        if (!offset) offset = 0;

        const comment = req.comment;
        const dataReply = comment.comment[0].dataReply;

        const total = comment.comment[0].replyCount;
        const currentUrl = req.baseUrl;
        const replies = await newsService.replyCommentsPipelineService(dataReply, offset, limit);
        if (replies.length === 0) return res.status(400).send({ message: "There are no registered replies" });

        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}/replyPage/${dataCommentId}/${commentId}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null ? `${currentUrl}/replyPage/${dataCommentId}/${commentId}?limit=${limit}&offset=${previous}` : null;

        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,
            replies
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const likeReply = async (req, res) => {
    try {
        const { dataReplyId, replyId } = req.params;
        const userId = req.userId;

        const reply = req.reply;
        const replyDataLikeId = reply.reply[0].dataLike;
        if (!replyDataLikeId) {
            await newsService.createLikeReplyDataService(dataReplyId, replyId, userId);
            return res.send({ message: "Like done successfully" });
        }

        const isLiked = await newsService.isUserInLikeReplyArray(replyDataLikeId, userId);
        if (!isLiked) {
            await newsService.likeReplyService(replyDataLikeId, userId);
            return res.status(200).send({ message: "Like done successfully" });
        } else {
            await newsService.deleteLikeReplyService(replyDataLikeId, userId);
            return res.status(200).send({ message: "Like successfully removed" });

        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

export default {
    create,
    findAll,
    topNews,
    findById,
    searchByTitle,
    newsByUser,
    upDate,
    erase,
    likeNews,
    addComment,
    deleteComment,
    addReplyComment,
    deleteReply,
    likeComment,
    getPaginatedComments,
    getPaginatedLikes,
    getPaginatedReply,
    likeReply
};