import { Types } from 'mongoose';

export interface INews {
  _id: Types.ObjectId;
  title: string;
  content: string;
  subtitle: string;
  banner: string;
  authorId: IUser;
  category: string;
  tags: [string];
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
  profilePicture: string;
  active: boolean;
  email: string;
  createdAt: Date;
};