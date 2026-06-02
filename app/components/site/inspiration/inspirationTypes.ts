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

export type InspirationContent = {
  music: {
    favoriteSong: string;
  };
  book: {
    currentBook: string;
    insight: string;
    progress: number;
    readingTime: string;
    favoriteBook: string;
    favoriteBookQuote1: string;
    favoriteBookQuote2: string;
  };
  film: {
    currentFilm: string;
    filmQuote: string;
    favoriteFilm: string;
    favoriteFilmQuote1: string;
    favoriteFilmQuote2: string;
  };
};

export type InspirationApiResponse = {
  id: string;
  sectionKey: string;
  title: string | null;
  content: InspirationContent;
  isPublished: boolean;
  updatedAt: string;
};
