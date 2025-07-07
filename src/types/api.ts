export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  published_year?: number;
  genre?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookDto {
  title: string;
  author: string;
  published_year?: number;
  genre?: string;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
  published_year?: number;
  genre?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
