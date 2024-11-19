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
  content: string;
  subtitle: string;
  banner: string;
  authorId: IUser;
  category: string;
  tags:[string];
  dataLikeId: Types.ObjectId;
  likeCount: number;
  dataCommentId: Types.ObjectId;
  commentCount: number;
  publishedAt: Date;
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