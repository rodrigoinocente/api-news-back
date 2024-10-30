import { Types } from 'mongoose';

export interface ICreateAndUpdateNewsBody {
  title: string;
  text: string;
  banner: string;
  userId: Types.ObjectId;
};

export interface INews {
  _id: Types.ObjectId;
  title: string;
  text: string;
  banner: string;
  user: IUser;
  dataLikeId: Types.ObjectId;
  likeCount: number;
  dataCommentId: Types.ObjectId;
  commentCount: number;
  createdAt: Date;
  map: any;
  length: number;
  save(): unknown;
};

interface Paginated {
  nextUrl: string | null;
  previousUrl: string | null;
  offset: number;
  total: number;
  news?: INews[];
  likes?: ILike[];
  comments?: ICommentNews[];
  replies?: IReplyComment[];
}

export interface ICommentNews {
  _id: Types.ObjectId;
  newsId: Types.ObjectId;
  comment: IComment[];
};

interface IComment {
  userId: Types.ObjectId;
  content: string;
  dataLikeId: Types.ObjectId;
  dataReplyId: Types.ObjectId;
  likeCount: number;
  replyCount: number;
  createdAt: Date;
};

export interface ILikeComment {
  _id: Types.ObjectId;
  dataCommentId: Types.ObjectId;
  commentId: Types.ObjectId;
  likes: Like[];
};

interface Like {
  userId: Types.ObjectId;
  createdAt: Date;
};

export interface ILikeNews {
  _id: Types.ObjectId;
  newsId: Types.ObjectId;
  likes: Like[];
};

export interface ILikeReply {
  _id: Types.ObjectId;
  dataReplyCommentId: Types.ObjectId;
  replyCommentId: Types.ObjectId;
  likes: Like[];
};

export interface IReplyComment {
  _id: Types.ObjectId;
  dataCommentId: Types.ObjectId;
  commentId: Types.ObjectId;
  reply: Reply[];
};

interface IReply {
  userId: Types.ObjectId;
  content: string;
  dataLikeId: Types.ObjectId;
  likeCount: number;
  createdAt: Date;
};

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password: string;
};

export interface IUpdateTypeComment {
  $pull?: {
    comment?: {
      _id: string;
    };
  };
};

export interface IUpdateTypeReply {
  $pull?: {
    reply?: {
      _id: string;
    };
  };
};