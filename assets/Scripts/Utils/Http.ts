import axios, { AxiosInstance } from "../Lib/axios.min.js";
import { getAccessToken, getRefreshToken } from "./Auth";

export class Http {
  instance: AxiosInstance;
  private accessToken: string;
  private refreshToken: string;

  constructor() {
    this.accessToken = getAccessToken();
    this.refreshToken = getRefreshToken();
    this.instance = axios.create({
      baseURL: "https://garena-api.xfsteam.net",
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}

const http = new Http().instance;
export default http;
