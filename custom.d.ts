import { Types } from 'mongoose';

export interface INews {
  _id: Types.ObjectId;
  title: string;
  content: string;
  subtitle: string;
  banner: string;
  bannerAlt: string;
  bannerFigcaption: string;
  authorId: IUser;
  category: string;
  tags: [string];
  commentCount: number;
  publishedAt: Date;
};

interface Paginated {
  nextUrl?: string | null;
  previousUrl?: string | null;
  offset?: number;
  total?: number;
  //old-^
  //new-v
  hasMore?: boolean;
  nextOffset?: number;
  news?: INews[];
  //TODO: THE ROUTE THAT SEARCHES FOR ALL NEWS IS STILL USING THIS TYPING. ADJUST IN THE FUTURE
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