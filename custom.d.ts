import { Types } from 'mongoose';

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

export interface IJournalist {
  _id: Types.ObjectId;
  name: string;
  bio: string;
  active:boolean;
  createdAt: Date;
};