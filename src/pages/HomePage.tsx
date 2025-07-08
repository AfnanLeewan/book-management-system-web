import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Container
} from '@mui/material';
import { 
  BookOpen, 
  PlusCircle, 
  Search, 
  TrendingUp 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import type { Book, PaginatedResponse } from '../types/api';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalGenres: 0,
    recentBooks: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch books to calculate statistics
        const response = await api.get<PaginatedResponse<Book>>('/books?page=1&limit=100');
        console.log('HomePage stats response:', response.data);
        
        // Handle different response structures
        let books: Book[] = [];
        let totalBooks = 0;
        
        if (response.data && Array.isArray(response.data)) {
          // Direct array response
          books = response.data;
          totalBooks = books.length;
        } else if (response.data && response.data.data) {
          // Paginated response with data field
          books = response.data.data || [];
          totalBooks = response.data.total || books.length;
        }
        
        // Calculate stats
        const genres = new Set(books.filter(book => book.genre).map(book => book.genre));
        const totalGenres = genres.size;
        
        // Count recent books (added in last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentBooks = books.filter(book => 
          new Date(book.created_at) > sevenDaysAgo
        ).length;

        setStats({
          totalBooks,
          totalGenres,
          recentBooks,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Welcome Section */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h3" sx={{ mb: 1, color: 'text.primary' }}>
              Welcome back, {user?.firstName}!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Manage your personal library and discover new books to read.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <Button
                component={Link}
                to="/books"
                variant="contained"
                startIcon={<BookOpen size={20} />}
                sx={{ px: 3 }}
              >
                View My Books
              </Button>
              <Button
                component={Link}
                to="/books"
                variant="outlined"
                startIcon={<PlusCircle size={20} />}
                sx={{ px: 3 }}
              >
                Add New Book
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5 }}>
                    Total Books
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {stats.loading ? '—' : stats.totalBooks}
                  </Typography>
                </Box>
                <BookOpen size={32} style={{ color: '#2563eb' }} />
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5 }}>
                    Genres
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {stats.loading ? '—' : stats.totalGenres}
                  </Typography>
                </Box>
                <TrendingUp size={32} style={{ color: '#10b981' }} />
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5 }}>
                    Recent Additions
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {stats.loading ? '—' : stats.recentBooks}
                  </Typography>
                </Box>
                <PlusCircle size={32} style={{ color: '#6366f1' }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Quick Actions */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
              <Card 
                component={Link}
                to="/books"
                sx={{
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.50',
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <BookOpen size={32} style={{ color: '#9ca3af', marginBottom: '8px' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5 }}>
                    Browse Books
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    View your collection
                  </Typography>
                </CardContent>
              </Card>
              <Card 
                component={Link}
                to="/books"
                sx={{
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.50',
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <PlusCircle size={32} style={{ color: '#9ca3af', marginBottom: '8px' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5 }}>
                    Add Book
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Add a new book to your library
                  </Typography>
                </CardContent>
              </Card>
              <Card 
                component={Link}
                to="/books"
                sx={{
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.50',
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Search size={32} style={{ color: '#9ca3af', marginBottom: '8px' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5 }}>
                    Search
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Find books in your library
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default HomePage;
