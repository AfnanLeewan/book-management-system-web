import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton,
  Divider
} from '@mui/material';
import { Edit, Delete, CalendarToday, Person } from '@mui/icons-material';
import type { Book } from '../../types/api';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card sx={{ transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{mr: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1,display: 'flex'}}>
              {book.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {book.author}
              </Typography>
            </Box>
            {book.published_year && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {book.published_year}
                </Typography>
              </Box>
            )}
            {book.genre && (
              <Chip 
                label={book.genre} 
                size="small" 
                sx={{ 
                  backgroundColor: 'primary.50', 
                  color: 'primary.800',
                    fontSize: '0.75rem'
                  
                }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => onEdit(book)}
              title="Edit book"
              sx={{ color: 'primary.main' }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(book)}
              title="Delete book"
              sx={{ color: 'error.main' }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Added {formatDate(book.created_at)}
          {book.updated_at !== book.created_at && (
            <span> • Updated {formatDate(book.updated_at)}</span>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BookCard;
