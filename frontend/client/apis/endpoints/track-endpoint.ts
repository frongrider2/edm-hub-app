import {
  TrackApiResponse,
  TrackResponseItem,
} from "@/apis/types/response.type";
import Endpoint from "./Endpoint";

export default class TracksEndpoints extends Endpoint {
  async getTracksPopular(limit: number, page: number, query: string) {
    return await this.axiosWrapper
      .get(`/track/popular`, { params: { limit, page, query } })
      .then((res) => this.axiosWrapper.interceptor<TrackApiResponse>(res))
      .catch((err) => this.axiosWrapper.interceptor<TrackApiResponse>(err));
  }

  async getTracksRandom(limit: number) {
    return await this.axiosWrapper
      .get(`/track/random`, { params: { limit } })
      .then((res) => this.axiosWrapper.interceptor<TrackApiResponse>(res))
      .catch((err) => this.axiosWrapper.interceptor<TrackApiResponse>(err));
  }

  async getTrackById(id: string) {
    return await this.axiosWrapper
      .get(`/track/${id}`)
      .then((res) => this.axiosWrapper.interceptor<TrackResponseItem>(res))
      .catch((err) => this.axiosWrapper.interceptor<TrackResponseItem>(err));
  }

  async getTracksByArtistId(artistId: string, limit: number, page: number) {
    return await this.axiosWrapper
      .get(`/track/artist/${artistId}`, { params: { limit, page } })
      .then((res) => this.axiosWrapper.interceptor<TrackApiResponse>(res))
      .catch((err) => this.axiosWrapper.interceptor<TrackApiResponse>(err));
  }

  async getTracksByPlaylistId(playlistId: string, limit: number, page: number) {
    return await this.axiosWrapper
      .get(`/track/playlist/${playlistId}`, { params: { limit, page } })
      .then((res) => this.axiosWrapper.interceptor<TrackApiResponse>(res))
      .catch((err) => this.axiosWrapper.interceptor<TrackApiResponse>(err));
  }
}
