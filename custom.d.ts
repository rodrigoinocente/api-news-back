import { Types } from 'mongoose';

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

export interface ICommentNews {
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
  dataCommentId: Types.ObjectId;
  commentId: Types.ObjectId;
  likes: Like[];
};

interface Like {
  userId: Types.ObjectId;
  createdAt: Date;
};

export interface ILikeNews {
  newsId: Types.ObjectId;
  likes: Like[];
};

export interface ILikeReply {
  dataReplyCommentId: Types.ObjectId;
  replyCommentId: Types.ObjectId;
  likes: Like[];
};

export interface IReplyComment {
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
