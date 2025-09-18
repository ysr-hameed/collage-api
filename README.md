# Collage API

A comprehensive REST API for college management system designed specifically for tier 3 cities, built with Fastify and MongoDB.

## Features

- **Student Management**: Complete CRUD operations for student records
- **Faculty Management**: Faculty registration and management
- **Course Management**: Course creation and enrollment management
- **Department Management**: Department administration and statistics
- **Authentication & Authorization**: JWT-based security for students and faculty
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Scalable Architecture**: Modular design suitable for small to medium colleges

## Technology Stack

- **Backend Framework**: Fastify
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ysr-hameed/collage-api.git
cd collage-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`
API Documentation will be available at `http://localhost:3000/docs`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `HOST` | Server host | 0.0.0.0 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/collage_db |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h |

## API Endpoints

### Authentication
- `POST /api/v1/auth/student/login` - Student login
- `POST /api/v1/auth/faculty/login` - Faculty login
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Students
- `POST /api/v1/students` - Create student (Faculty only)
- `GET /api/v1/students` - Get all students with filters
- `GET /api/v1/students/:id` - Get student by ID
- `PUT /api/v1/students/:id` - Update student
- `DELETE /api/v1/students/:id` - Delete student
- `GET /api/v1/students/department/:departmentId` - Get students by department

### Faculty
- `POST /api/v1/faculty` - Create faculty member
- `GET /api/v1/faculty` - Get all faculty with filters
- `GET /api/v1/faculty/:id` - Get faculty by ID
- `PUT /api/v1/faculty/:id` - Update faculty
- `DELETE /api/v1/faculty/:id` - Delete faculty
- `GET /api/v1/faculty/department/:departmentId` - Get faculty by department

### Courses
- `POST /api/v1/courses` - Create course
- `GET /api/v1/courses` - Get all courses with filters
- `GET /api/v1/courses/:id` - Get course by ID
- `PUT /api/v1/courses/:id` - Update course
- `DELETE /api/v1/courses/:id` - Deactivate course

### Departments
- `POST /api/v1/departments` - Create department
- `GET /api/v1/departments` - Get all departments with filters
- `GET /api/v1/departments/:id` - Get department by ID
- `PUT /api/v1/departments/:id` - Update department
- `DELETE /api/v1/departments/:id` - Deactivate department
- `GET /api/v1/departments/:id/stats` - Get department statistics

### Health Check
- `GET /health` - API health status

## Features for Tier 3 Cities

This API is specifically designed keeping tier 3 cities in mind:

- **Lightweight**: Minimal resource requirements
- **Offline-ready**: Designed to work with intermittent connectivity
- **Simple Deployment**: Easy to deploy on basic hosting services
- **Cost-effective**: Uses efficient technologies to minimize hosting costs
- **Scalable**: Can grow with the institution's needs

## Data Models

### Student
- Personal information (name, email, phone, address)
- Academic details (student ID, department, course, semester)
- Guardian information
- Status tracking

### Faculty
- Personal and professional information
- Department assignment
- Course associations
- Experience and qualifications

### Course
- Course details and prerequisites
- Enrollment management
- Fee structure
- Academic calendar

### Department
- Department information
- Faculty and student associations
- Statistics and reporting

## Security Features

- JWT-based authentication
- Role-based authorization (Student/Faculty)
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS configuration
- Security headers with Helmet

## Development

```bash
# Start in development mode with auto-reload
npm run dev

# Run linting (if configured)
npm run lint

# Run tests (if configured)
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue on the GitHub repository.
