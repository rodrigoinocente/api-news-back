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
                likes: item.likes,
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
        let { newsId } = req.params;
        let userId = req.userId;
        const news = await newsService.findByIdService(newsId);

        if (!news.dataLike) {
            const newDataLike = await newsService.createDataLikeService(newsId, userId);
            await newsService.updateDataLikeService(newsId, newDataLike._id);

            return res.send({ message: "Like done successfully" });
        }

        const newsLiked = await newsService.likeNewsService(news.dataLike, userId);

        if (!newsLiked) {
            await newsService.deletelikeNewsService(news.dataLike, userId);
            return res.status(200).send({ message: "Like successfully removed" });
        }

        res.send({ message: "Like done successfully" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const likeComment = async (req, res) => {
    try {
        const { id, idComment } = req.params;
        const userId = req.userId;

        const commentLiked = await newsService.likeCommentService(id, idComment, userId);

        if (!commentLiked) {
            await newsService.deletelikeCommentService(id, idComment, userId);
            return res.status(200).send({ message: "Like successfully removed" });
        }

        res.send({ message: "Like done successfully" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).send({ message: "Write a message to comment" });
        }

        await newsService.addCommentService(id, userId, comment);

        res.send({ message: "Comment successfully completed" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const deleteComment = async (req, res) => {
    try {
        const { id, idComment } = req.params;
        const userId = req.userId;

        const commentDeleted = await newsService.deleteCommentService(id, idComment, userId);

        const findComment = commentDeleted.comments.find((comment) => comment.idComment === idComment);

        if (!findComment) {
            return res.status(404).send({ message: "Comment not found" });
        }

        if (findComment.userId !== userId) {
            return res.status(400).send({ message: "You can't delete this comment" });
        }

        res.send({ message: "Comment successfully removed" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const addReplyToComment = async (req, res) => {
    try {
        const { id, idComment } = req.params;
        const userId = req.userId;
        const { reply } = req.body;

        if (!reply) {
            return res.status(400).send({ message: "Write a message to comment" });
        }

        const newReply = await newsService.addReplyToCommentService(id, idComment, userId, reply);

        res.send({ message: "Reply successfully completed" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const deleteReply = async (req, res) => {
    try {
        const { id, idComment, idReply } = req.params;
        const userId = req.userId;

        const replyDeleted = await newsService.deleteReplyService(id, idComment, idReply, userId);

        const findReply = replyDeleted.comments.find(
            comment => comment.idComment === idComment && comment.replies.some(reply => reply.idReply === idReply));

        if (!findReply) {
            return res.status(404).send({ message: "Reply not found" });
        }

        if (findReply.userId !== userId) {
            return res.status(400).send({ message: "You can't delete this reply" });
        }

        res.send({ message: "Reply successfully removed" });

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
    addReplyToComment,
    deleteReply,
    likeComment
};