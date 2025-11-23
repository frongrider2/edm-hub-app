import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { SpotifyAlbumTrackTypeResponse } from 'src/core/types/spotify-album-track.type';
import { SpotifyAlbumTypeResponse } from 'src/core/types/spotify-album.type';
import { SpotifyArtistType } from 'src/core/types/spotify-artist.type';

@Injectable()
export class SpotifyService implements OnModuleInit {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly apiDevEndpoint: string;
  private readonly apiEndpoint: string;
  private readonly logger = new Logger(SpotifyService.name);

  // Token and expiry tracking
  private token: string | null = null;
  private tokenExpiresAt: number | null = null; // Unix timestamp in ms

  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<string>('SPOTIFY_CLIENT_ID') || '';
    this.clientSecret =
      this.configService.get<string>('SPOTIFY_CLIENT_SECRET') || '';
    if (!this.clientId || !this.clientSecret) {
      this.logger.error(
        'SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are required',
      );
      throw new Error(
        'SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are required',
      );
    }
    this.apiDevEndpoint = 'https://accounts.spotify.com/api';
    this.apiEndpoint = 'https://api.spotify.com/v1';
    this.logger.log('SpotifyService initialized');
  }

  async onModuleInit() {
    this.logger.log(
      'Module initialization started. Fetching Spotify access token...',
    );
    await this.getAccessToken();
  }

  private isTokenValid(): boolean {
    // If token does not exist or has expired, return false
    if (!this.token || !this.tokenExpiresAt) {
      return false;
    }
    // Check if token is still valid (buffer 30 seconds for safety)
    return Date.now() < this.tokenExpiresAt - 30000;
  }

  private async getAccessToken(): Promise<string> {
    if (this.isTokenValid() && this.token) {
      // Token exists and is still valid
      return this.token;
    }

    this.logger.log('Requesting Spotify access token...');
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);

    try {
      const response = await axios.post(
        `${this.apiDevEndpoint}/token`,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      if (response.status === 200) {
        const token = response.data as {
          access_token: string;
          expires_in: number;
          token_type: string;
        };
        this.token = token.access_token;
        this.tokenExpiresAt = Date.now() + token.expires_in * 1000;
        this.logger.log('Spotify access token retrieved successfully');
      } else {
        this.logger.error(
          `Failed to retrieve Spotify access token. Status: ${response.status}`,
        );
        throw new Error(
          `Failed to retrieve Spotify access token. Status: ${response.status}`,
        );
      }
    } catch (error) {
      this.logger.error(
        'Error occurred while retrieving Spotify access token',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }

    return this.token;
  }

  /**
   * Perform an authenticated GET request to the Spotify API (apiEndpoint)
   * @param endpoint - relative path (e.g., "/search")
   * @param config - (optional) AxiosRequestConfig for custom params, headers, etc.
   */
  private async getApi<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const accessToken = await this.getAccessToken();

    try {
      const response = await axios.get(`${this.apiEndpoint}${endpoint}`, {
        ...(config || {}),
        headers: {
          ...(config && config.headers ? config.headers : {}),
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data as T;
    } catch (error) {
      this.logger.error(
        `Spotify API GET request failed: ${endpoint}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async getArtist(artistId: string) {
    return this.getApi<SpotifyArtistType>(`/artists/${artistId}`);
  }

  async getArtists(artistIds: string[]) {
    return this.getApi<{
      artists: SpotifyArtistType[];
    }>(`/artists?ids=${artistIds.join(',')}`);
  }

  async getArtistAlbums(
    artistId: string,
    limit: number = 10,
    offset: number = 0,
  ) {
    return this.getApi<SpotifyAlbumTypeResponse>(
      `/artists/${artistId}/albums`,
      {
        params: {
          limit,
          offset,
        },
      },
    );
  }

  async getAlbumsTracks(
    albumId: string,
    limit: number = 10,
    offset: number = 0,
  ) {
    return this.getApi<SpotifyAlbumTrackTypeResponse>(
      `/albums/${albumId}/tracks`,
      {
        params: {
          limit,
          offset,
          market: 'TH',
        },
      },
    );
  }
}
