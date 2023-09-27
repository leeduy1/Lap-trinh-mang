import { sys } from "cc";
import { User } from "../Models/User";

export const setAccessToken = (accessToken: string) => {
  sys.localStorage.setItem("accessToken", accessToken);
};

export const setRefreshToken = (refreshToken: string) => {
  sys.localStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = () => sys.localStorage.getItem("accessToken") || "";

export const getRefreshToken = () => sys.localStorage.getItem("refreshToken") || "";

export const getProfile = () => {
  const result = sys.localStorage.getItem("profile");

  return result ? JSON.parse(result) : null;
};

export const setProfile = (profile: User) => {
  sys.localStorage.setItem("profile", JSON.stringify(profile));
};
