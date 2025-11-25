import { AuthProfileResponse } from "@/apis/types/auth-api.types";
import Endpoint from "./Endpoint";
import {
  PlaylistApiResponse,
  PlaylistResponseItem,
} from "@/apis/types/response.type";

export default class PlaylistEndpoints extends Endpoint {
  async createPlaylist(name: string, description: string) {
    return await this.axiosWrapper
      .post(`/playlist/create`, { name, description })
      .then((res) =>
        this.axiosWrapper.interceptor<{
          _id: string;
          name: string;
          description: string;
          slug: string;
        }>(res),
      )
      .catch((err) =>
        this.axiosWrapper.interceptor<{
          _id: string;
          name: string;
          description: string;
          slug: string;
        }>(err),
      );
  }

  async getPlaylistsPopular(limit: number, page: number) {
    return await this.axiosWrapper
      .get(`/playlist/popular`, { params: { limit, page } })
      .then((res) => this.axiosWrapper.interceptor<PlaylistApiResponse>(res))
      .catch((err) => this.axiosWrapper.interceptor<PlaylistApiResponse>(err));
  }

  async getUserPlaylists(limit: number, page: number) {
    return await this.axiosWrapper
      .get(`/playlist/user`, { params: { limit, page } })
      .then((res) => this.axiosWrapper.interceptor<PlaylistApiResponse>(res))
      .catch((err) => this.axiosWrapper.interceptor<PlaylistApiResponse>(err));
  }

  async addTrackToPlaylist(playlistId: string, trackId: string) {
    return await this.axiosWrapper
      .post(`/playlist/add`, { playlistId, trackId })
      .then((res) => this.axiosWrapper.interceptor<PlaylistResponseItem>(res))
      .catch((err) => this.axiosWrapper.interceptor<PlaylistResponseItem>(err));
  }

  async deleteTrackToPlaylist(playlistId: string, trackId: string) {
    return await this.axiosWrapper
      .post(`/playlist/delete`, { playlistId, trackId })
      .then((res) => this.axiosWrapper.interceptor<PlaylistResponseItem>(res))
      .catch((err) => this.axiosWrapper.interceptor<PlaylistResponseItem>(err));
  }

  async getPlaylistBySlug(slug: string) {
    return await this.axiosWrapper
      .get(`/playlist/${slug}`)
      .then((res) => this.axiosWrapper.interceptor<PlaylistResponseItem>(res))
      .catch((err) => this.axiosWrapper.interceptor<PlaylistResponseItem>(err));
  }
}
