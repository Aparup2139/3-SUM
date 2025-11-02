export type httpRequstType = {
  _id: string;
  user: User;
  token: string;
  url?: string;
  message?: string;
  data?: any;
};

export interface User {
  createdAt: string;
  email: string;
  fullName: string;
  role: string;
  profileImgUrl?: string;
  _id: string;
}

export enum UserRole {
  NORMAL = "normal",
  USER = "user",
  ADMIN = "admin",
}

export interface profileDataType extends AuthDataType {
  videosUploaded?: number;
  rating?: number;
  tasksCompleted?: number;
}

export enum YTUploadStages {
  VIDEO_UPLOAD,
  THUMBNAIL_UPLOAD,
  PUBLISH_VIDEO,
  SUCCESSFULL,
  ERROR,
}

export type AuthDataType = {
  _id: string;
  name: string;
  email: string;
  profileImgUrl: string | null;
  Oauth: boolean;
  bio: string | null;
  attachedLinks: string;
  videosUploaded?: number;
  editable: boolean;
  createdAt: string;
  rating?: number;
  tasksCompleted?: number;
  role: UserRole;
  bannerImgUrl?: string | null;
};

export interface TopEditorsData extends AuthDataType {
  score: number;
}

export enum Rating_val {
  unrated = "unrated",
  one = "one",
  two = "two",
  three = "three",
  four = "four",
  five = "five",
}

export interface TaskDataType {
  id: string;
  short_description: string;
  long_description: string;
  organizer: string;
  start_date: Date;
  end_date: Date;
  location: string;
  category: string;
  totalTickets: number;
  ticketsSold: number;
  basePrice: number;
  priceMin: number;
  priceMax: number;
  currentPrice: number;
  title: string;
  eventImageUrl : string;
}

export interface userSearchType {
  id: string;
  name: string;
  email: string;
  profileImgUrl?: string;
  role: UserRole;
}

export interface NotificationType {
  id: number;
  title: string;
  content: string;
  read: boolean;
  userId: number;
  user: Partial<AuthDataType>;
  createdAt?: string;
  link?: string;
}
