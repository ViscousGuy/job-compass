# Job Compass Backend

This is the backend API for Job Compass, a comprehensive job application tracking system.

## Tech Stack

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads
- Cloudinary for file storage

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local instance or MongoDB Atlas account)


## Authentication

Authentication is implemented using JWT (JSON Web Tokens):

1. **Token Generation**: When a user logs in or registers, a JWT is generated containing the user's ID and role.
2. **Token Storage**: The token is sent to the client in two ways:
   - As an HTTP-only cookie (for enhanced security)
   - In the response body (for clients that don't support cookies)
3. **Token Verification**: Protected routes use the `authMiddleware.protect` middleware to verify the token.
4. **Role-Based Access**: The `authMiddleware.restrictTo` middleware restricts access based on user roles.

### Cookie Configuration

Cookies are configured with the following options:
- `httpOnly: true` - Prevents JavaScript access to the cookie
- `secure: true` in production - Ensures cookies are only sent over HTTPS
- `sameSite: 'none'` in production - Allows cross-site requests
- Expiration set to 90 days by default (configurable via environment variables)

### CORS Configuration

CORS is configured to allow requests from the client URL specified in the environment variables:
```javascript
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

## API Routes

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | User login | Public |
| POST | `/logout` | User logout | Private |
| GET | `/me` | Get current user | Private |

### Jobs Routes (`/api/v1/jobs`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all jobs with pagination, filtering, and search | Private |
| GET | `/:id` | Get job by ID | Public |
| POST | `/` | Create a new job | Private (Employers only) |
| PATCH | `/:id` | Update a job | Private (Job owner or admin) |
| DELETE | `/:id` | Delete a job | Private (Job owner or admin) |

### Applications Routes (`/api/v1/applications`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all applications | Private |
| GET | `/applied-jobs` | Get all job IDs the current user has applied for | Private |
| GET | `/:id` | Get application by ID | Private |
| POST | `/` | Create a new application | Private (Job seekers only) |
| PATCH | `/:id/status` | Update application status | Private (Employers only) |

## Middleware

### Authentication Middleware

The `authMiddleware.protect` function:
1. Extracts the JWT from cookies or the Authorization header
2. Verifies the token using the JWT_SECRET
3. Checks if the user still exists in the database
4. Attaches the user to the request object

```javascript
// Example of protected route
router.get(
  "/me",
  authMiddleware.protect,
  authController.getCurrentUser
);
```

### Role Restriction Middleware

The `authMiddleware.restrictTo` function restricts access based on user roles:

```javascript
// Example of role-restricted route
router.post(
  "/",
  authMiddleware.protect,
  authMiddleware.restrictTo("employer"),
  jobsController.createJob
);
```

### File Upload Middleware

The `uploadMiddleware` handles file uploads using Multer:

```javascript
// Example of file upload route
router.post(
  "/",
  authMiddleware.protect,
  authMiddleware.restrictTo("jobseeker"),
  uploadMiddleware.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  applicationsController.createApplication
);
```

## Error Handling

The application includes a global error handling middleware that:
1. Captures all errors thrown in the application
2. Formats error responses consistently
3. Includes stack traces in development mode only
4. Returns appropriate HTTP status codes

```javascript
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      status: "error",
      message: err.message,
      stack: config.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
);
```