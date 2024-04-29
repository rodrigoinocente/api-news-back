import newsService from "../services/news.service.js";

const create = async (req, res) => {
    try {
        const { title, text, banner } = req.body;

        if (!title || !text || !banner) {
            return res.status(400).send({ message: "Submit all fields for registration" });
        }

        await newsService.createService({
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

        const news = await newsService.findAllService(offset, limit);
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
                id: item._id,
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
                id: news._id,
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
        const { id } = req.params;

        const news = await newsService.findByIdService(id);

        if (!news) {
            return res.send({ message: "News not found" });
        }

        return res.send({
            news: {
                id: news._id,
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

const byUser = async (req, res) => {
    try {
        const id = req.userId;
        const news = await newsService.byUserService(id);

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
        const { id } = req.params;


        if (!title && !text && !banner) {
            return res.status(400).send({ message: "Submit at least one fields to update the post" });
        }

        const news = await newsService.findByIdService(id);

        if (!news) {
            return res.send({ message: "News not found" });
        }

        if (String(news.user._id) !== req.userId) {
            return res.status(400).send({ message: "You didn't update this post" });
        }

        await newsService.upDateService(id, title, text, banner);

        return res.send({ message: "Post successfully updated" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const erase = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await newsService.findByIdService(id);

        if (!news) {
            return res.send({ message: "News not found" });
        }

        if (String(news.user._id) !== req.userId) {
            return res.status(400).send({ message: "You didn't delete this post" });
        }

        await newsService.eraseService(id);

        return res.send({ message: "Post deleted successfully" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const likeNews = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const newsLiked = await newsService.likeNewsService(id, userId);

        if (!newsLiked) {
            await newsService.deletelikeNewsService(id, userId);
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

        if(!findComment){
            return res.status(404).send({message: "Comment not found"});
        }

        if (findComment.userId !== userId) {
            return res.status(400).send({ message: "You can't delete this comment" });
        }

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
    byUser,
    upDate,
    erase,
    likeNews,
    addComment,
    deleteComment
};