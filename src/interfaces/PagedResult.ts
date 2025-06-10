export interface PagedResult<T> {
  items: T[];
  totalNumber: number;
  pageNumber: number;
  pageSize: number;
}