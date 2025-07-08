import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  IconButton,
  Box
} from '@mui/material';
import { Close } from '@mui/icons-material';
import Button from '../ui/Button';
import Input from '../ui/Input';
import ErrorMessage from '../ui/ErrorMessage';
import type { Book, CreateBookDto, UpdateBookDto } from '../../types/api';

interface BookFormProps {
  book?: Book;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBookDto | UpdateBookDto) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const BookForm: React.FC<BookFormProps> = ({
  book,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<CreateBookDto>({
    title: '',
    author: '',
    published_year: undefined,
    genre: '',
  });
  const [errors, setErrors] = useState<{
    title?: string;
    author?: string;
    published_year?: string;
    genre?: string;
  }>({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        published_year: book.published_year,
        genre: book.genre || '',
      });
    } else {
      setFormData({
        title: '',
        author: '',
        published_year: undefined,
        genre: '',
      });
    }
    setErrors({});
  }, [book, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      author?: string;
      published_year?: string;
      genre?: string;
    } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (formData.published_year && (formData.published_year < 1000 || formData.published_year > new Date().getFullYear())) {
      newErrors.published_year = 'Please enter a valid year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      genre: formData.genre || undefined,
    };

    try {
      await onSubmit(submitData);
      onClose();
    } catch {
      // Error is handled by parent component
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'published_year') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value ? parseInt(value) : undefined 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear field error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {book ? 'Edit Book' : 'Add New Book'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {error && (
              <ErrorMessage message={error} />
            )}

            <Input
              label="Title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Enter book title"
            />

            <Input
              label="Author"
              name="author"
              type="text"
              required
              value={formData.author}
              onChange={handleChange}
              error={errors.author}
              placeholder="Enter author name"
            />

            <Input
              label="Published Year"
              name="published_year"
              type="number"
              inputProps={{ min: 1000, max: new Date().getFullYear() }}
              value={formData.published_year || ''}
              onChange={handleChange}
              error={errors.published_year}
              placeholder="Enter publication year"
            />

            <Input
              label="Genre"
              name="genre"
              type="text"
              value={formData.genre}
              onChange={handleChange}
              error={errors.genre}
              placeholder="Enter genre (optional)"
            />
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {book ? 'Update Book' : 'Add Book'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookForm;
