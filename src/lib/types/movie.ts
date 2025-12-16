// IMDB API (imdbapi.dev) response types
export interface ImdbApiTitle {
  id: string;
  type?: string;
  primaryTitle?: string;
  originalTitle?: string;
  primaryImage?: {
    url: string;
    width: number;
    height: number;
  };
  startYear?: number;
  endYear?: number;
  runtimeSeconds?: number;
  genres?: string[];
  rating?: {
    aggregateRating?: number;
    voteCount?: number;
  };
  plot?: string;
}

export interface ImdbApiCredit {
  name: {
    id: string;
    nameText: {
      text: string;
    };
    primaryImage?: {
      url: string;
    };
  };
  characters?: Array<{
    name: string;
  }>;
  category?: {
    text: string;
  };
}

export interface ImdbApiCreditsResponse {
  credits?: {
    edges?: Array<{
      node: ImdbApiCredit;
    }>;
  };
}

export interface Genre {
  id: string;
  name: string;
}

// Application-level movie type (normalized)
export interface Movie {
  id: string;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  releaseYear: number;
  genres: string[];
  runtime?: number;
  cast?: Array<{
    name: string;
    character: string;
    profileUrl?: string;
  }>;
}
