import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { 
  AuthResponse, 
  LoginDto, 
  RegisterDto, 
  User, 
  Book, 
  CreateBookDto, 
  UpdateBookDto, 
  PaginatedResponse 
} from '../types/api';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterDto): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response: AxiosResponse<User> = await api.get('/auth/profile');
    return response.data;
  },
};

// Books API
export const booksApi = {
  getBooks: async (page = 1, limit = 10): Promise<PaginatedResponse<Book>> => {
    const response: AxiosResponse<PaginatedResponse<Book>> = await api.get(
      `/books?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getBook: async (id: string): Promise<Book> => {
    const response: AxiosResponse<Book> = await api.get(`/books/${id}`);
    return response.data;
  },

  createBook: async (bookData: CreateBookDto): Promise<Book> => {
    const response: AxiosResponse<Book> = await api.post('/books', bookData);
    return response.data;
  },

  updateBook: async (id: string, bookData: UpdateBookDto): Promise<Book> => {
    const response: AxiosResponse<Book> = await api.patch(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`);
  },

  searchBooks: async (query: string, page = 1, limit = 10): Promise<PaginatedResponse<Book>> => {
    const response: AxiosResponse<PaginatedResponse<Book>> = await api.get(
      `/books/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getBooksByAuthor: async (author: string, page = 1, limit = 10): Promise<PaginatedResponse<Book>> => {
    const response: AxiosResponse<PaginatedResponse<Book>> = await api.get(
      `/books/author/${encodeURIComponent(author)}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getBooksByGenre: async (genre: string, page = 1, limit = 10): Promise<PaginatedResponse<Book>> => {
    const response: AxiosResponse<PaginatedResponse<Book>> = await api.get(
      `/books/genre/${encodeURIComponent(genre)}?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

export default api;
