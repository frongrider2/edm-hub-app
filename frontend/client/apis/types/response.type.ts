export interface ArtistApiResponse {
  items: ArtistResponseItem[];
  total: number;
  hasNext: boolean;
  limit: number;
  skip: number;
}

export interface ArtistResponseItem {
  _id: string;
  id: string;
  external_urls: Externalurls;
  followers: Followers;
  genres: Genre[];
  href: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Genre {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Followers {
  href: null;
  total: number;
}

interface Externalurls {
  spotify: string;
}

export interface PlaylistApiResponse {
  items: PlaylistResponseItem[];
  total: number;
  hasNext: boolean;
  limit: number;
  skip: number;
}

export interface PlaylistResponseItem {
  _id: string;
  name: string;
  description: string;
  createdBy: CreatedBy;
  tracks: any[];
  playCount: number;
  lastPlayedAt: null;
  isPublic: boolean;
  slug: string;
  coverImageUrl: null;
  deletedAt: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CreatedBy {
  _id: string;
  name: string;
  email: string;
  picture: string;
}

export interface TrackApiResponse {
  items: TrackResponseItem[];
  total: number;
  hasNext: boolean;
  limit: number;
  skip: number;
}

export interface TrackResponseItem {
  _id: string;
  id: string;
  artists: Artist[];
  artistRefs: ArtistRef[];
  albumRef: AlbumRef;
  available_markets: any[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: Externalurls;
  href: string;
  is_playable: boolean;
  name: string;
  preview_url: null;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  playCount: number;
}

interface AlbumRef {
  _id: string;
  id: string;
  album_type: string;
  total_tracks: number;
  external_urls: Externalurls;
  href: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
  artists: Artist[];
  artistRefs: string[];
  album_group: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ArtistRef {
  _id: string;
  id: string;
  external_urls: Externalurls;
  followers: Followers;
  genres: string[];
  href: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Followers {
  href: null;
  total: number;
}

interface Artist {
  external_urls: Externalurls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface Externalurls {
  spotify: string;
}
