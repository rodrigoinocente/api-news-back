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
        const { newsId } = req.params;

        const news = await newsService.findByIdService(newsId);

        if (!news) {
            return res.send({ message: "News not found" });
        }

        return res.send({
            news: {
                newsId: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
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
        const { newsId } = req.params;


        if (!title && !text && !banner) {
            return res.status(400).send({ message: "Submit at least one fields to update the post" });
        }

        const news = await newsService.findByIdService(newsId);

        if (!news) {
            return res.send({ message: "News not found" });
        }

        if (String(news.user._id) !== req.userId) {
            return res.status(400).send({ message: "You didn't update this post" });
        }

        await newsService.upDateService(newsId, title, text, banner);

        return res.send({ message: "Post successfully updated" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const erase = async (req, res) => {
    try {
        const { newsId } = req.params;
        const news = await newsService.findByIdService(newsId);

        if (!news) {
            return res.send({ message: "News not found" });
        }

        if (String(news.user._id) !== req.userId) {
            return res.status(400).send({ message: "You didn't delete this post" });
        }

        await newsService.eraseService(newsId);

        return res.send({ message: "Post deleted successfully" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const likeNews = async (req, res) => {
    try {
        const { newsId } = req.params;
        const userId = req.userId;

        const news = await newsService.findByIdService(newsId);
        if (!news.dataLike) {
            await newsService.createNewsDataLikeService(newsId, userId);
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
        const { newsId } = req.params;
        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if (!limit) limit = 10;
        if (!offset) offset = 0;

        const news = await newsService.findByIdService(newsId);
        const total = await newsService.totalLikesLengthService(news.dataLike)
        const likes = await newsService.likesPipelineService(news.dataLike, offset, limit);
        const currentUrl = req.baseUrl;

        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}/likePage/${newsId}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null ? `${currentUrl}/likePage/${newsId}?limit=${limit}&offset=${previous}` : null;

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
        const { newsId } = req.params;
        const userId = req.userId;
        const { content } = req.body;

        if (!content) return res.status(400).send({ message: "Write a message to comment" });

        const news = await newsService.findByIdService(newsId);
        if (!news.dataComment) {
            await newsService.createCommentDataService(newsId, userId, content);
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
        const { newsId } = req.params;
        const { commentId } = req.params;
        const userId = req.userId;
        const news = await newsService.findByIdService(newsId);

        const commentFind = await newsService.findCommentById(news.dataComment, commentId);
        if (!commentFind) return res.status(404).send({ message: "Comment not found" });

        if (!news) return res.status(404).send({ message: "News not found" });

        if (String(commentFind.comment[0].userId) !== userId) return res.status(400).send({ message: "You can't delete this comment" });

        await newsService.deleteCommentService(news.dataComment, commentId)
        res.send({ message: "Comment successfully removed" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const findAllCommentByNewsId = async (req, res) => {
    const { newsId } = req.params;
    const results = await newsService.getAllCommentsByNewsId(newsId);
    res.send(results);
};
//for now just for development--^
const getPaginatedComments = async (req, res) => {
    try {
        const { newsId } = req.params;
        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if (!limit) limit = 10;
        if (!offset) offset = 0;

        const news = await newsService.findByIdService(newsId);
        const total = await newsService.totalCommentLengthService(news.dataComment)
        const comments = await newsService.commentsPipelineService(news.dataComment, offset, limit);
        const currentUrl = req.baseUrl;

        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}/commentPage/${newsId}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null ? `${currentUrl}/commentPage/${newsId}?limit=${limit}&offset=${previous}` : null;

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

        const comment = await newsService.findCommentById(dataCommentId, commentId);
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
        const { dataCommentId, commentId } = req.params;
        const userId = req.userId;
        const { content } = req.body;
        if (!content) return res.status(400).send({ message: "Write a message to comment" });

        const comment = await newsService.findCommentById(dataCommentId, commentId);
        const commentDataReplyId = comment.comment[0].dataReply;

        if (!commentDataReplyId) {
            await newsService.createReplyCommentDataService(dataCommentId, commentId, userId, content);
            return res.status(200).send({ message: "Comment successfully completed" });
        } else {
            await newsService.upDateReplyCommentDataService(commentDataReplyId, userId, content);
            return res.status(200).send({ message: "Comment successfully completed" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const deleteReply = async (req, res) => {
    try {
        const { dataReplyId, replyId } = req.params;
        const userId = req.userId;

        const replyFind = await newsService.findReplyById(dataReplyId, replyId);
        if (!replyFind) return res.status(404).send({ message: "Reply not found" });

        if (String(replyFind.reply[0].userId) !== userId) return res.status(400).send({ message: "You can't delete this comment" });

        await newsService.deleteReplyCommentService(dataReplyId, replyId);
        res.send({ message: "Comment successfully removed" });

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
    findAllCommentByNewsId,
    getPaginatedComments,
    getPaginatedLikes
};