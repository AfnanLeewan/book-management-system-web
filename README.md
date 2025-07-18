# Book Management Frontend

A modern React application for managing your personal book library.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Dashboard**: Overview of your book collection with quick actions
- **Book Management**: Full CRUD operations for books
- **Search & Filter**: Find books by title, author, or genre
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Updates**: Optimistic UI updates with React Query

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API server running (see backend README)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd book-management-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

### Testing

```bash
npm run test
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── books/           # Book-related components
│   └── ui/              # Generic UI components
├── contexts/            # React contexts
├── pages/               # Route components
├── services/            # API services
├── types/               # TypeScript type definitions
└── App.tsx             # Main application component
```

## Key Components

## API Integration

The frontend communicates with the NestJS backend API:

- **Authentication**: JWT-based authentication
- **Books CRUD**: Full create, read, update, delete operations
- **Pagination**: Server-side pagination for large datasets
- **Search**: Real-time search functionality
- **Error Handling**: Comprehensive error handling and user feedback

## Features in Detail

### Dashboard
- Welcome message with user information
- Quick stats about book collection
- Quick action buttons for common tasks

### Book Management
- View all books in a responsive grid
- Search books by title, author, or genre
- Add new books with form validation
- Edit existing books
- Delete books with confirmation
- Pagination for large collections

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:3000
```