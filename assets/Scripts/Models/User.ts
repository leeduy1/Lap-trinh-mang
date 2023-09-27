import { BaseModel } from "../Shared/Interface";

export enum UserRole {
  User = "USER",
  Admin = "ADMIN",
}

export class User extends BaseModel {
  deletedAt: string | null;
  username: string;
  nickname: string;
  phone: string | null;
  isPlaying: boolean;
  role: UserRole | string;
  avatar: string | null;
}
