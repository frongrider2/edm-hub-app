import AuthEndpoints from "@/apis/endpoints/auth-endpoints";
import AxiosWrapper from "./axiosWrapper";
import PlaylistEndpoints from "@/apis/endpoints/playlist-endpoint";
import ArtistsEndpoints from "@/apis/endpoints/artist-endpoint";
import TracksEndpoints from "@/apis/endpoints/track-endpoint";

export default class ServerService {
  readonly auth: AuthEndpoints;
  readonly playlist: PlaylistEndpoints;
  readonly artist: ArtistsEndpoints;
  readonly track: TracksEndpoints;

  constructor(axiosWrapper: AxiosWrapper) {
    this.auth = new AuthEndpoints(axiosWrapper);
    this.playlist = new PlaylistEndpoints(axiosWrapper);
    this.artist = new ArtistsEndpoints(axiosWrapper);
    this.track = new TracksEndpoints(axiosWrapper);
  }
}
