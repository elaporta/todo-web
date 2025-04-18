# 📝 Todo Web Application

A modern Angular web application for managing tasks, built with Angular 19.

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm (version 9 or higher)
- Angular CLI (version 19 or higher)

## 🚀 Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm start
   ```

3. Open browser and navigate to `http://localhost:4200`

## 📦 Build

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🔌 API Integration

The application integrates with a REST API at `http://api.elaporta.site/` for:
- User authentication
- Task management

## 🔧 Environment Configuration

To change the API URL, modify the environment files located in `src/environments/`:

1. For development (`environment.ts`):

2. For production (`environment.prod.ts`):