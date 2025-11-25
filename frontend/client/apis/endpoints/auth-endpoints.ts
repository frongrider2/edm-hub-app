import {
  AuthProfileResponse,
  AuthRegisterResponse,
  LoginRequest,
  RegisterRequest,
} from "@/apis/types/auth-api.types";
import Endpoint from "./Endpoint";

export default class AuthEndpoints extends Endpoint {
  async getGoogleAuthUrl() {
    return await this.axiosWrapper
      .get(`/auth/google-login`)
      .then((res) =>
        this.axiosWrapper.interceptor<{
          url: string;
        }>(res),
      )
      .catch((err) =>
        this.axiosWrapper.interceptor<{
          url: string;
        }>(err),
      );
  }

  async getProfile() {
    return await this.axiosWrapper
      .get(`/auth/profile`)
      .then((res) => this.axiosWrapper.interceptor<AuthProfileResponse>(res))
      .catch((err) => this.axiosWrapper.interceptor<AuthProfileResponse>(err));
  }

  async register(data: RegisterRequest) {
    return await this.axiosWrapper
      .post(`/auth/register`, data)
      .then((res) => this.axiosWrapper.interceptor<AuthRegisterResponse>(res))
      .catch((err) => this.axiosWrapper.interceptor<AuthRegisterResponse>(err));
  }

  async login(data: LoginRequest) {
    return await this.axiosWrapper
      .post(`/auth/login`, data)
      .then((res) => this.axiosWrapper.interceptor<AuthRegisterResponse>(res))
      .catch((err) => this.axiosWrapper.interceptor<AuthRegisterResponse>(err));
  }
}
