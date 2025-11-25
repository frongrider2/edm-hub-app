import {
  ArtistApiResponse,
  ArtistResponseItem,
} from "@/apis/types/response.type";
import Endpoint from "./Endpoint";

export default class ArtistsEndpoints extends Endpoint {
  async getArtistsPopular(limit: number, page: number) {
    return await this.axiosWrapper
      .get(`/artist/popular`, { params: { limit, page } })
      .then((res) => this.axiosWrapper.interceptor<ArtistApiResponse>(res))
      .catch((err) => this.axiosWrapper.interceptor<ArtistApiResponse>(err));
  }

  async getArtistById(id: string) {
    return await this.axiosWrapper
      .get(`/artist/${id}`)
      .then((res) => this.axiosWrapper.interceptor<ArtistResponseItem>(res))
      .catch((err) => this.axiosWrapper.interceptor<ArtistResponseItem>(err));
  }
}
