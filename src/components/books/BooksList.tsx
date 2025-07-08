import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import { Search, Add, MenuBook, KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import api from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import BookForm from './BookForm';
import BookCard from './BookCard';
import type { Book, CreateBookDto, UpdateBookDto, PaginatedResponse } from '../../types/api';

const BooksList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState(''); // The actual search term being used for API calls
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'published_year' | 'created_at' | 'updated_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
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
      let fetchedBooks: Book[] = [];
      if (response.data && Array.isArray(response.data)) {
        // Direct array response
        fetchedBooks = response.data;
        setCurrentPage(1);
        setTotalPages(1);
      } else if (response.data && response.data.data) {
        // Paginated response with data field
        fetchedBooks = response.data.data || [];
        setCurrentPage(response.data.page || 1);
        setTotalPages(response.data.totalPages || 1);
      } else {
        // Empty or unexpected response
        fetchedBooks = [];
        setCurrentPage(1);
        setTotalPages(1);
      }
      
      // Extract unique genres for the filter dropdown
      const genres = [...new Set(fetchedBooks.filter(book => book.genre).map(book => book.genre!))];
      setAvailableGenres(genres.sort());
      
      setBooks(fetchedBooks);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books. Please make sure the backend server is running.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to apply client-side sorting and filtering
  const getFilteredAndSortedBooks = () => {
    let filteredBooks = books;

    // Apply genre filter
    if (selectedGenre) {
      filteredBooks = filteredBooks.filter(book => book.genre === selectedGenre);
    }

    // Apply sorting
    filteredBooks.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortBy === 'title') {
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
      } else if (sortBy === 'published_year') {
        aValue = a.published_year || 0;
        bValue = b.published_year || 0;
      } else if (sortBy === 'created_at') {
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
      } else if (sortBy === 'updated_at') {
        aValue = new Date(a.updated_at).getTime();
        bValue = new Date(b.updated_at).getTime();
      } else {
        return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filteredBooks;
  };

  useEffect(() => {
    fetchBooks(currentPage, activeSearch);
  }, [currentPage, activeSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveSearch(searchTerm); // This will trigger the useEffect to fetch with the new search term
  };

  const handleCreateBook = async (data: CreateBookDto) => {
    try {
      setFormLoading(true);
      setFormError(null);
      
      console.log('Creating book with data:', data);
      const response = await api.post<Book>('/books', data);
      console.log('Book created successfully:', response.data);
      
      // Close the form first
      setIsFormOpen(false);
      setSelectedBook(undefined);
      
      // Refresh the books list from server to ensure consistency
      await fetchBooks(currentPage, activeSearch);
    } catch (err: unknown) {
      console.error('Error creating book:', err);
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
      
      console.log('Updating book with data:', data);
      const response = await api.patch<Book>(`/books/${selectedBook.id}`, data);
      console.log('Book updated successfully:', response.data);
      
      // Close the form first
      setIsFormOpen(false);
      setSelectedBook(undefined);
      
      // Refresh the books list from server to ensure consistency
      await fetchBooks(currentPage, activeSearch);
    } catch (err: unknown) {
      console.error('Error updating book:', err);
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
      console.log('Deleting book with ID:', bookId);
      await api.delete(`/books/${bookId}`);
      console.log('Book deleted successfully');
      
      // Refresh the books list from server to ensure consistency
      await fetchBooks(currentPage, activeSearch);
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete book');
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '256px' }}>
        <LoadingSpinner size="lg" />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        alignItems: { sm: 'center' }, 
        justifyContent: 'space-between',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MenuBook sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
            My Books
          </Typography>
        </Box>
        <Button onClick={handleAddBook} startIcon={<Add />}>
          Add Book
        </Button>
      </Box>

      {/* Search and Filters */}
      <Stack spacing={2}>
        {/* Search Bar */}
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Input
              type="text"
              placeholder="Search books by title or author"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
          <Button type="submit" variant="outline">
            <Search />
          </Button>
        </Box>

        {/* Filters and Sorting */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2, 
          alignItems: { sm: 'center' } 
        }}>
          {/* Genre Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Genre</InputLabel>
            <Select
              value={selectedGenre}
              label="Genre"
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <MenuItem value="">All Genres</MenuItem>
              {availableGenres.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sort By */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value as 'title' | 'published_year' | 'created_at' | 'updated_at')}
            >
              <MenuItem value="created_at">Date Created</MenuItem>
              <MenuItem value="updated_at">Date Updated</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="published_year">Year Published</MenuItem>
            </Select>
          </FormControl>

          {/* Sort Order Toggle */}
          <Tooltip title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'} - Click to toggle`}>
            <IconButton
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.50'
                }
              }}
            >
              {sortOrder === 'asc' ? (
                <KeyboardArrowUp fontSize="small" />
              ) : (
                <KeyboardArrowDown fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* Active Filters */}
          {(selectedGenre || activeSearch) && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Filters:
              </Typography>
              {activeSearch && (
                <Chip
                  label={`Search: "${activeSearch}"`}
                  size="small"
                  onDelete={() => {
                    setSearchTerm('');
                    setActiveSearch('');
                  }}
                />
              )}
              {selectedGenre && (
                <Chip
                  label={`Genre: ${selectedGenre}`}
                  size="small"
                  onDelete={() => setSelectedGenre('')}
                />
              )}
            </Box>
          )}
        </Box>
      </Stack>

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Books Grid */}
      {(() => {
        const filteredBooks = getFilteredAndSortedBooks();
        return filteredBooks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <MenuBook sx={{ fontSize: 48, color: 'text.disabled', mx: 'auto', display: 'block', mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5 }}>
              No books found
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              {activeSearch || selectedGenre ? 'Try adjusting your search terms or filters.' : 'Get started by adding your first book.'}
            </Typography>
            {!activeSearch && !selectedGenre && (
              <Button onClick={handleAddBook} startIcon={<Add />}>
                Add Book
              </Button>
            )}
          </Box>
        ) : (
          <>
            {/* Results Summary */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Showing {filteredBooks.length} of {books.length} books
                {(() => {
                  switch (sortBy) {
                    case 'title': return ' sorted by title';
                    case 'published_year': return ' sorted by year published';
                    case 'created_at': return ' sorted by date created';
                    case 'updated_at': return ' sorted by date updated';
                    default: return '';
                  }
                })()}
                {sortOrder === 'desc' ? ' (newest first)' : ' (oldest first)'}
              </Typography>
            </Box>

            {/* Books Grid */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
              gap: 3 
            }}>
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEditBook}
                  onDelete={(book) => handleDeleteBook(book.id)}
                />
              ))}
            </Box>
          </>
        );
      })()}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 4 }}>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <Typography variant="body2" sx={{ color: 'text.secondary', mx: 2 }}>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </Box>
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
    </Box>
  );
};

export default BooksList;
