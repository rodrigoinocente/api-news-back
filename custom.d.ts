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
};

interface Paginated {
  nextUrl: string | null;
  previousUrl: string | null;
  offset: number;
  total: number;
  news?: INews[];
}

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