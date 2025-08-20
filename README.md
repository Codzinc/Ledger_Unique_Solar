# Ledger Unique Solar

A comprehensive solar project management system built with Django backend and React frontend.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop (make sure it's running)
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ledger_Unique_Solar
   ```

2. **Start the application**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000
   - Database: localhost:5432

## 🐳 Docker Configuration

### Development Environment
The project is configured for development by default. In the `Dockerfile`, the last line uses:
```dockerfile
CMD ["/app/scripts/dev.sh"]
```

### Scripts
- **`scripts/dev.sh`** - Development environment setup
- **`scripts/prod.sh`** - Production environment setup

**Important**: Ensure `dev.sh` uses LF (Line Feed) line endings, not CRLF.

## 🔧 Development Workflow

### Git Workflow for Frontend Development

When working on JavaScript or CSS files that don't appear in git commits:

1. **Check gitignore file** - Remove `.js` and `.css` entries if they're blocking your files
2. **Make your changes** and commit them
3. **Push your changes** first
4. **Revert gitignore changes** back to original state
5. **Push the reverted gitignore** as a separate commit

### Why This Workflow?
This approach ensures that:
- Your development files are properly tracked during development
- The production gitignore remains clean and secure
- No sensitive or build files are accidentally committed

## 📁 Project Structure

```
Ledger_Unique_Solar/
├── backend/          # Django backend application
├── frontend/         # React frontend application
├── scripts/          # Docker and deployment scripts
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🛠️ Available Commands

```bash
# Stop all containers
docker-compose down

# Start containers with rebuild
docker-compose up --build

# View logs
docker-compose logs -f

# Access container shell
docker-compose exec backend bash
```

## 📝 Notes

- Always ensure Docker Desktop is running before executing docker commands
- The development server runs on port 5173 (frontend) and 8000 (backend)
- Database migrations run automatically on container startup
- Static files are collected automatically in development mode

## 🤝 Contributing

1. Follow the git workflow described above for frontend development
2. Ensure all changes are properly tested before committing
3. Keep the gitignore file clean and secure

## 📄 Last Updated at:

20 Aug 2025 by Mujtaba