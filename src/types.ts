/** House of Parliament */
export enum House {
  Commons = 1,
  Lords = 2,
}

/** Pagination parameters accepted by search endpoints */
export interface PaginationParams {
  skip?: number;
  take?: number;
}

/** Standard paginated response wrapper from the Members/Questions APIs */
export interface PaginatedResponse<T> {
  items: T[];
  totalResults: number;
  resultContext: string;
  skip: number;
  take: number;
  links: Link[];
}

export interface Link {
  rel: string;
  href: string;
  method: string;
}

/** Wrapper that the Members API uses around individual items */
export interface MemberApiItem<T> {
  value: T;
  links: Link[];
}

/** Response wrapper used by the Questions & Statements API */
export interface QuestionsApiResponse<T> {
  totalResults: number;
  results: MemberApiItem<T>[];
}
