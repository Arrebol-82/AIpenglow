export type RecentTrack = {
  name: string;
  artist: string;
  album: string;
  image: string | null;
  images?: {
    small: string | null;
    medium: string | null;
    large: string | null;
    extralarge: string | null;
  };
  url: string | null;
  isNowPlaying: boolean;
  listenedAt: string | null;
};

export type LastFmState = {
  ok: boolean;
  reason: string | null;
  track: RecentTrack | null;
};
