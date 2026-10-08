export type AsyncStatus = 'initial' | 'ready' | 'loading' | 'canceled' | 'success' | 'error';

export interface PaginationLinks {
  first?: string | null;
  last?: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginatedResultModel<T> {
  data: T[];
  current_page?: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
  total?: number;
  per_page?: number;
  last_page?: number;
  links?: PaginationLinks | any[];
}
