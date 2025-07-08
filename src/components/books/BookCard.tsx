import React from 'react';
import { Edit, Trash2, Calendar, User } from 'lucide-react';
import Button from '../ui/Button';
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
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {book.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <User className="h-4 w-4 mr-2" />
            <span className="text-sm">{book.author}</span>
          </div>
          {book.published_year && (
            <div className="flex items-center text-gray-600 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">{book.published_year}</span>
            </div>
          )}
          {book.genre && (
            <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
              {book.genre}
            </span>
          )}
        </div>
        <div className="flex space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(book)}
            className="p-2"
            title="Edit book"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(book)}
            className="p-2"
            title="Delete book"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 border-t pt-3">
        Added {formatDate(book.created_at)}
        {book.updated_at !== book.created_at && (
          <span> • Updated {formatDate(book.updated_at)}</span>
        )}
      </div>
    </div>
  );
};

export default BookCard;
