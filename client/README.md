# Job Compass | Client

This is the frontend application for Job Compass, a comprehensive job application tracking system.

## Tech Stack

- React 18 with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling
- Lucide React for icons
- Recharts for data visualization
- Zod for form validation

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## Client Routes

| Route                    | Component            | Description                          | Access                              |
| ------------------------ | -------------------- | ------------------------------------ | ----------------------------------- |
| `/`                      | `Home`               | Landing page                         | Public                              |
| `/login`                 | `Login`              | User login page                      | Public                              |
| `/register`              | `Register`           | User registration page               | Public                              |
| `/jobs`                  | `Jobs`               | Job listings with search and filters | Protected (All authenticated users) |
| `/jobs/:id`              | `JobDetails`         | Detailed view of a specific job      | Protected (All authenticated users) |
| `/applications/:id`      | `ApplicationDetails` | Detailed view of a job application   | Protected (All authenticated users) |
| `/employer/dashboard/*`  | `EmployerDashboard`  | Dashboard for employers              | Protected (Employers only)          |
| `/jobseeker/dashboard/*` | `JobSeekerDashboard` | Dashboard for job seekers            | Protected (Job seekers only)        |

## Authentication

Authentication is managed using Redux Toolkit and HTTP-only cookies:

1. **Login/Register**: When a user logs in or registers, the auth thunk dispatches an action to the API, which returns user data and sets an HTTP-only cookie.

2. **Auth State**: The user data is stored in the Redux store:

```typescript
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  validationErrors: null,
};
```

3. **Auth Check**: On application load, the `checkAuthStatus` thunk is dispatched to verify if the user is authenticated:

```typescript
useEffect(() => {
  dispatch(checkAuthStatus());
}, [dispatch]);
```

4. **Protected Routes**: The `ProtectedRoute` component ensures that only authenticated users with the correct role can access certain routes:

```typescript
<Route
  path="/employer/dashboard/*"
  element={
    <ProtectedRoute
      element={<EmployerDashboard />}
      allowedRoles={["employer", "admin"]}
    />
  }
/>
```

5. **Logout**: When a user logs out, the cookie is cleared on the server, and the user state is reset in Redux.

## State Management

State is managed using Redux Toolkit with the following slices:

1. **Auth Slice**: Manages user authentication state

   - User information
   - Login/register loading states
   - Authentication errors

2. **Jobs Slice**: Manages job-related state

   - Job listings
   - Job details
   - Job creation/editing state

3. **Applications Slice**: Manages application-related state

   - Application listings
   - Application details
   - Application status updates

4. **Theme Slice**: Manages UI theme preferences
   - Dark/light mode toggle

## API Integration

API requests are made using Axios with a custom instance that:

- Sets the base URL from environment variables
- Includes credentials in requests (for cookies)
- Handles common error responses

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
```

## Form Handling

Forms are validated using Zod schemas:

```typescript
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
```

## Responsive Design

The application is fully responsive using Tailwind CSS:

- Mobile-first approach
- Responsive navigation
- Adaptive layouts for different screen sizes
