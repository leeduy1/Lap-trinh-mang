import { User } from "../Models/User";
import { setAccessToken } from "../Utils/Auth";
import http from "../Utils/Http";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const loginUser = async () => {
  try {
    const response = await http.post<LoginResponse>(
      "/auth/login",
      {
        username: "player1",
        password: "12345",
      },
    );

    setAccessToken(response.data.accessToken);
  } catch (error) {
    console.log(error);
  }
};

export const getUserProfile = async () => {
  try {
    const response = await http.get<User>("/users/profile");

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
