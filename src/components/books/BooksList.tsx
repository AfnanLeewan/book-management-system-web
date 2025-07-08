import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import api from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import BookForm from './BookForm';
import type { Book, CreateBookDto, UpdateBookDto, PaginatedResponse } from '../../types/api';

const BooksList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchBooks = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
      });
      
      console.log('Fetching books with params:', params.toString());
      const response = await api.get<PaginatedResponse<Book>>(`/books?${params}`);
      console.log('Books response:', response.data);
      
      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        // Direct array response
        setBooks(response.data);
        setCurrentPage(1);
        setTotalPages(1);
      } else if (response.data && response.data.items) {
        // Paginated response
        setBooks(response.data.items || []);
        setCurrentPage(response.data.currentPage || 1);
        setTotalPages(response.data.totalPages || 1);
      } else {
        // Empty or unexpected response
        setBooks([]);
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books. Please make sure the backend server is running.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks(1, searchTerm);
  };

  const handleCreateBook = async (data: CreateBookDto) => {
    try {
      setFormLoading(true);
      setFormError(null);
      
      const response = await api.post<Book>('/books', data);
      
      setBooks(prev => [response.data, ...prev]);
      setIsFormOpen(false);
      setSelectedBook(undefined);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create book';
      setFormError(errorMessage);
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateBook = async (data: UpdateBookDto) => {
    if (!selectedBook) return;
    
    try {
      setFormLoading(true);
      setFormError(null);
      
      const response = await api.patch<Book>(`/books/${selectedBook.id}`, data);
      
      setBooks(prev => 
        prev.map(book => 
          book.id === selectedBook.id ? response.data : book
        )
      );
      setIsFormOpen(false);
      setSelectedBook(undefined);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update book';
      setFormError(errorMessage);
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }
    
    try {
      await api.delete(`/books/${bookId}`);
      setBooks(prev => prev.filter(book => book.id !== bookId));
    } catch (err) {
      setError('Failed to delete book');
      console.error('Error deleting book:', err);
    }
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleAddBook = () => {
    setSelectedBook(undefined);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateBookDto | UpdateBookDto) => {
    if (selectedBook) {
      await handleUpdateBook(data as UpdateBookDto);
    } else {
      await handleCreateBook(data as CreateBookDto);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedBook(undefined);
    setFormError(null);
  };

  if (loading && books.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
        </div>
        <Button onClick={handleAddBook} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Book
        </Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search books by title, author, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button type="submit" variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first book.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button onClick={handleAddBook} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Book
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {book.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <span className="text-sm">by {book.author}</span>
                  </div>
                  {book.published_year && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <span className="text-sm">Published: {book.published_year}</span>
                    </div>
                  )}
                  {book.genre && (
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      {book.genre}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditBook(book)}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                    title="Edit book"
                  >
                    <Edit className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                    title="Delete book"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 border-t pt-3">
                Added {new Date(book.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
                {book.updated_at !== book.created_at && (
                  <span> • Updated {new Date(book.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}

      {/* Book Form Modal */}
      <BookForm
        book={selectedBook}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        isLoading={formLoading}
        error={formError}
      />
    </div>
  );
};

export default BooksList;
