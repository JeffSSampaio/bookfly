

export interface TableHeader {
  title: string
  key: string
  sortable?: boolean
}

export interface TableOptions {
  page?: number
  itemsPerPage?: number
  sortBy?: SortOption[]
  search: string
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



export interface SpringPageResponse<T> {
  content: T[]
  page: {
    totalElements: number
    totalPages: number
    number: number
    size: number
  }
}

export interface FlatPageResponse<T> {
  content: T[]
  totalElements: number
}