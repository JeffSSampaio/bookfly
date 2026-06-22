
export interface TableOptions {
  page?: number
  itemsPerPage?: number
  sortBy?: SortOption[]
}

export interface SortOption {
  key: string
  order: 'asc' | 'desc'
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface TableHeader {
  title: string
  key: string
  sortable?: boolean
}