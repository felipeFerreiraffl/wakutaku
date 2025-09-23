// types/jikan.ts
// Interfaces baseadas na documentação oficial da Jikan API v4

// ==================== TIPOS BÁSICOS ====================

export interface JikanImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface JikanImages {
  jpg: JikanImage;
  webp: JikanImage;
}

export interface JikanTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
  images: {
    image_url: string | null;
    small_image_url: string | null;
    medium_image_url: string | null;
    large_image_url: string | null;
    maximum_image_url: string | null;
  };
}

export interface JikanTitle {
  type: string;
  title: string;
}

export interface JikanDateRange {
  from: string | null;
  to: string | null;
  prop: {
    from: {
      day: number | null;
      month: number | null;
      year: number | null;
    };
    to: {
      day: number | null;
      month: number | null;
      year: number | null;
    };
  };
  string: string;
}

export interface JikanBroadcast {
  day: string | null;
  time: string | null;
  timezone: string | null;
  string: string | null;
}

export interface JikanMalUrl {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

// ==================== ANIME INTERFACES ====================

export interface JikanAnime {
  mal_id: number;
  url: string;
  images: JikanImages;
  trailer: JikanTrailer;
  approved: boolean;
  titles: JikanTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: 'TV' | 'OVA' | 'Movie' | 'Special' | 'ONA' | 'Music' | null;
  source: string;
  episodes: number | null;
  status: 'Finished Airing' | 'Currently Airing' | 'Not yet aired';
  airing: boolean;
  aired: JikanDateRange;
  duration: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  season: 'winter' | 'spring' | 'summer' | 'fall' | null;
  year: number | null;
  broadcast: JikanBroadcast;
  producers: JikanMalUrl[];
  licensors: JikanMalUrl[];
  studios: JikanMalUrl[];
  genres: JikanMalUrl[];
  explicit_genres: JikanMalUrl[];
  themes: JikanMalUrl[];
  demographics: JikanMalUrl[];
  relations?: JikanRelation[];
  external?: JikanExternal[];
  streaming?: JikanStreaming[];
}

export interface JikanAnimeCharacter {
  character: {
    mal_id: number;
    url: string;
    images: JikanImages;
    name: string;
  };
  role: string;
  favorites: number;
  voice_actors: {
    person: {
      mal_id: number;
      url: string;
      images: JikanImages;
      name: string;
    };
    language: string;
  }[];
}

export interface JikanAnimeStaff {
  person: {
    mal_id: number;
    url: string;
    images: JikanImages;
    name: string;
  };
  positions: string[];
}

export interface JikanAnimeStatistics {
  watching: number;
  completed: number;
  on_hold: number;
  dropped: number;
  plan_to_watch: number;
  total: number;
  scores: {
    [score: string]: {
      votes: number;
      percentage: number;
    };
  };
}

export interface JikanReview {
  mal_id: number;
  url: string;
  type: string;
  reactions: {
    overall: number;
    nice: number;
    love_it: number;
    funny: number;
    confusing: number;
    informative: number;
    well_written: number;
    creative: number;
  };
  date: string;
  review: string;
  score: number | null;
  tags: string[];
  is_spoiler: boolean;
  is_preliminary: boolean;
  episodes_watched: number | null;
  user: {
    url: string;
    username: string;
    images: JikanImages;
  };
}

export interface JikanRelation {
  relation: string;
  entry: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
}

export interface JikanExternal {
  name: string;
  url: string;
}

export interface JikanStreaming {
  name: string;
  url: string;
}

export interface JikanRecommendation {
  entry: {
    mal_id: number;
    url: string;
    images: JikanImages;
    title: string;
  };
  url: string;
  votes: number;
}

export interface JikanNewsArticle {
  mal_id: number;
  url: string;
  title: string;
  date: string;
  author_username: string;
  author_url: string;
  forum_url: string;
  images: JikanImages;
  comments: number;
  excerpt: string;
}

// ==================== MANGA INTERFACES ====================

export interface JikanManga {
  mal_id: number;
  url: string;
  images: JikanImages;
  approved: boolean;
  titles: JikanTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: 'Manga' | 'Novel' | 'Light Novel' | 'One-shot' | 'Doujinshi' | 'Manhwa' | 'Manhua' | null;
  chapters: number | null;
  volumes: number | null;
  status: 'Finished' | 'Publishing' | 'On Hiatus' | 'Discontinued' | 'Not yet published';
  publishing: boolean;
  published: JikanDateRange;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  authors: JikanMalUrl[];
  serializations: JikanMalUrl[];
  genres: JikanMalUrl[];
  explicit_genres: JikanMalUrl[];
  themes: JikanMalUrl[];
  demographics: JikanMalUrl[];
  relations?: JikanRelation[];
  external?: JikanExternal[];
}

export interface JikanMangaCharacter {
  character: {
    mal_id: number;
    url: string;
    images: JikanImages;
    name: string;
  };
  role: string;
}

export interface JikanMangaStatistics {
  reading: number;
  completed: number;
  on_hold: number;
  dropped: number;
  plan_to_read: number;
  total: number;
  scores: {
    [score: string]: {
      votes: number;
      percentage: number;
    };
  };
}

// ==================== CHARACTER INTERFACES ====================

export interface JikanCharacter {
  mal_id: number;
  url: string;
  images: JikanImages;
  name: string;
  name_kanji: string | null;
  nicknames: string[];
  favorites: number;
  about: string | null;
}

// ==================== PERSON INTERFACES ====================

export interface JikanPerson {
  mal_id: number;
  url: string;
  website_url: string | null;
  images: JikanImages;
  name: string;
  given_name: string | null;
  family_name: string | null;
  alternate_names: string[];
  birthday: string | null;
  favorites: number;
  about: string | null;
}

// ==================== SEASON INTERFACES ====================

export interface JikanSeason {
  year: number;
  season: string;
}

export interface JikanSeasonArchive {
  year: number;
  seasons: string[];
}

export interface JikanScheduleDay {
  monday: JikanAnime[];
  tuesday: JikanAnime[];
  wednesday: JikanAnime[];
  thursday: JikanAnime[];
  friday: JikanAnime[];
  saturday: JikanAnime[];
  sunday: JikanAnime[];
  other: JikanAnime[];
  unknown: JikanAnime[];
}

// ==================== GENRE INTERFACES ====================

export interface JikanGenre {
  mal_id: number;
  name: string;
  url: string;
  count: number;
}

// ==================== PRODUCER/MAGAZINE INTERFACES ====================

export interface JikanProducer {
  mal_id: number;
  url: string;
  titles: JikanTitle[];
  images: JikanImages;
  favorites: number;
  about: string | null;
  established: string | null;
  count: number;
}

export interface JikanMagazine {
  mal_id: number;
  name: string;
  url: string;
  count: number;
}

// ==================== RESPONSE WRAPPERS ====================

export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface JikanResponse<T> {
  data: T;
}

export interface JikanPaginatedResponse<T> {
  data: T[];
  pagination: JikanPagination;
}

// ==================== SPECIFIC RESPONSE TYPES ====================

export type JikanAnimeResponse = JikanResponse<JikanAnime>;
export type JikanAnimeListResponse = JikanPaginatedResponse<JikanAnime>;
export type JikanAnimeCharactersResponse = JikanPaginatedResponse<JikanAnimeCharacter>;
export type JikanAnimeStaffResponse = JikanPaginatedResponse<JikanAnimeStaff>;
export type JikanAnimeStatisticsResponse = JikanResponse<JikanAnimeStatistics>;
export type JikanAnimeReviewsResponse = JikanPaginatedResponse<JikanReview>;
export type JikanAnimeRecommendationsResponse = JikanPaginatedResponse<JikanRecommendation>;
export type JikanAnimeNewsResponse = JikanPaginatedResponse<JikanNewsArticle>;

export type JikanMangaResponse = JikanResponse<JikanManga>;
export type JikanMangaListResponse = JikanPaginatedResponse<JikanManga>;
export type JikanMangaCharactersResponse = JikanPaginatedResponse<JikanMangaCharacter>;
export type JikanMangaStatisticsResponse = JikanResponse<JikanMangaStatistics>;
export type JikanMangaReviewsResponse = JikanPaginatedResponse<JikanReview>;

export type JikanCharacterResponse = JikanResponse<JikanCharacter>;
export type JikanCharacterListResponse = JikanPaginatedResponse<JikanCharacter>;

export type JikanPersonResponse = JikanResponse<JikanPerson>;
export type JikanPersonListResponse = JikanPaginatedResponse<JikanPerson>;

export type JikanGenresResponse = JikanResponse<JikanGenre[]>;
export type JikanProducersResponse = JikanPaginatedResponse<JikanProducer>;
export type JikanMagazinesResponse = JikanPaginatedResponse<JikanMagazine>;

export type JikanSeasonResponse = JikanPaginatedResponse<JikanAnime>;
export type JikanSeasonArchiveResponse = JikanResponse<JikanSeasonArchive[]>;
export type JikanScheduleResponse = JikanResponse<JikanScheduleDay>;

// ==================== SEARCH PARAMETERS ====================

export interface AnimeSearchParams {
  q?: string;
  page?: number;
  limit?: number;
  type?: 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music';
  score?: number;
  min_score?: number;
  max_score?: number;
  status?: 'airing' | 'complete' | 'upcoming';
  rating?: 'g' | 'pg' | 'pg13' | 'r17' | 'r' | 'rx';
  sfw?: boolean;
  genres?: string;
  genres_exclude?: string;
  order_by?: 'mal_id' | 'title' | 'type' | 'rating' | 'start_date' | 'end_date' | 'episodes' | 'score' | 'scored_by' | 'rank' | 'popularity' | 'members' | 'favorites';
  sort?: 'desc' | 'asc';
  letter?: string;
  producer?: string;
}

export interface MangaSearchParams {
  q?: string;
  page?: number;
  limit?: number;
  type?: 'manga' | 'novel' | 'lightnovel' | 'oneshot' | 'doujin' | 'manhwa' | 'manhua';
  score?: number;
  min_score?: number;
  max_score?: number;
  status?: 'publishing' | 'complete' | 'hiatus' | 'discontinued' | 'upcoming';
  sfw?: boolean;
  genres?: string;
  genres_exclude?: string;
  order_by?: 'mal_id' | 'title' | 'type' | 'start_date' | 'end_date' | 'chapters' | 'volumes' | 'score' | 'scored_by' | 'rank' | 'popularity' | 'members' | 'favorites';
  sort?: 'desc' | 'asc';
  letter?: string;
  magazine?: string;
}