import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlusCircle, Search, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mb-6">
          Manage your personal library and discover new books to read.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/books">
            <Button className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              View My Books
            </Button>
          </Link>
          <Link to="/books">
            <Button variant="outline" className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Add New Book
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">—</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Genres</p>
              <p className="text-2xl font-bold text-gray-900">—</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Additions</p>
              <p className="text-2xl font-bold text-gray-900">—</p>
            </div>
            <PlusCircle className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/books" className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
              <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Browse Books</p>
              <p className="text-xs text-gray-500">View your collection</p>
            </div>
          </Link>
          <Link to="/books" className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
              <PlusCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Book</p>
              <p className="text-xs text-gray-500">Add a new book to your library</p>
            </div>
          </Link>
          <Link to="/books" className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
              <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Search</p>
              <p className="text-xs text-gray-500">Find books in your library</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
