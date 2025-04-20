# Job Compass

Job Compass is a comprehensive job application tracking system designed to streamline the job search process. It connects job seekers with employers, allowing employers to post job listings and job seekers to apply for positions.

## About

Job Compass provides a platform where:

- Employers can post job listings, manage applications, and track hiring metrics
- Job seekers can search for jobs, apply with their resume and cover letter, and track application status
- Users can filter jobs by category, location, and job type
- Dark/light mode for comfortable viewing

## Technologies Used

### Frontend

- React 18 with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling
- Lucide React for icons
- Recharts for data visualization
- Zod for form validation

### Backend

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Cloudinary for file storage

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local instance or MongoDB Atlas account)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/ViscousGuy/job-compass.git
cd job-compass
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/job-compass
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

4. Start the backend server:

```bash
npm run dev
```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the client directory with the following variables:

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

4. Start the frontend development server:

```bash
npm run dev
```

The client will run on http://localhost:5173

### Running Both Frontend and Backend

You can run both the frontend and backend concurrently from the root directory:

```bash
npm run dev
```

## Features

- User authentication (register, login, logout)
- Role-based access control (job seeker, employer, admin)
- Job posting and management for employers
- Job search with filters for job seekers
- Application submission and tracking
- Employer dashboard with analytics
- Job seeker dashboard with application history
- Dark/light mode toggle
- Responsive design for mobile and desktop
