# Authentication Implementation

This document describes the authentication implementation for the Evera Frontend application.

## Backend Integration

The frontend is configured to work with a backend running on `http://localhost:5000/api/v1`.

## API Endpoints

The following authentication endpoints are implemented:

- **Login**: `POST /auth/login`
- **Register**: `POST /auth/register`
- **Logout**: `POST /auth/logout`
- **Forgot Password**: `POST /auth/forgot-password`
- **Reset Password**: `POST /auth/reset-password`

## Configuration

### Current Setup

The application is currently configured to make direct requests to the backend:

```javascript
// src/api/apiClient.ts
const axiosInstance = axios.create({
	baseURL: "http://localhost:5000/api/v1",
	timeout: 50000,
	headers: { "Content-Type": "application/json;charset=utf-8" },
});
```

### Alternative Proxy Configuration

If you prefer to use a proxy (useful for avoiding CORS issues), you can update the configuration:

1. Update `src/api/apiClient.ts`:
```javascript
baseURL: "/api",
```

2. Ensure `vite.config.ts` has the proxy configuration:
```javascript
proxy: {
  "/api": {
    target: "http://localhost:5000",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
    secure: false,
  },
},
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: If you see CORS errors, ensure your backend has CORS configured to allow requests from `http://localhost:3001`.

2. **400 Bad Request**: Check that your backend expects the following data format for registration:
   ```json
   {
     "username": "string",
     "email": "string", 
     "password": "string"
   }
   ```

3. **Connection Refused**: Ensure your backend is running on `http://localhost:5000`.

### Debugging

The application includes debug logging in the API client. Check the browser console for:
- Request URLs being called
- Request data being sent
- Response data received

### Testing Backend Connection

You can use the `BackendTest` component to verify your backend is accessible:

```jsx
import { BackendTest } from "@/components/BackendTest";

// Add this to any page to test backend connectivity
<BackendTest />
```

## Authentication Flow

### 1. Login
- User enters username/email and password
- Form validation ensures required fields
- API call to `/auth/login`
- On success, user token and info are stored
- User is redirected to homepage

### 2. Register
- User enters username, email, password, and confirm password
- Form validation ensures password match
- Only username, email, and password are sent to backend
- API call to `/auth/register`
- On success, user is redirected to login

### 3. Forgot Password
- User enters email address
- API call to `/auth/forgot-password`
- Backend sends reset email
- User is redirected to login

### 4. Reset Password
- User clicks reset link from email
- Link contains token parameter
- User enters new password and confirmation
- API call to `/auth/reset-password`
- On success, user is redirected to login

### 5. Logout
- API call to `/auth/logout`
- Local user data is cleared
- User is redirected to login

## State Management

User authentication state is managed using Zustand with the following stores:

- `userStore`: Manages user token and user info
- `useSignIn`: Hook for login functionality
- `useLogout`: Hook for logout functionality

## Security Features

- JWT tokens are automatically included in API requests
- 401 responses automatically clear user data
- Form validation on client side
- Secure password confirmation
- Token-based password reset

## File Structure

```
src/
├── api/
│   ├── apiClient.ts          # Axios configuration and interceptors
│   └── services/
│       └── userService.ts    # Authentication API calls
├── components/
│   └── BackendTest.tsx       # Backend connectivity test
├── pages/sys/login/
│   ├── index.tsx             # Main login page
│   ├── login-form.tsx        # Login form component
│   ├── register-form.tsx     # Register form component
│   ├── forgot-password-form.tsx  # Forgot password form
│   ├── reset-password-form.tsx   # Reset password form
│   └── reset-password-page.tsx   # Reset password page
├── store/
│   └── userStore.ts          # User state management
└── routes/sections/
    └── auth.tsx              # Authentication routes
```

## Usage

### Starting the Application

1. Ensure your backend is running on `http://localhost:5000`
2. Start the frontend development server:
   ```bash
   npm run dev
   ```
3. The application will be available at `http://localhost:3001`

### Testing Authentication

1. Navigate to `/auth/login`
2. Use the register form to create a new account
3. Login with your credentials
4. Test the forgot password flow
5. Test logout functionality

## Error Handling

- API errors are displayed as toast notifications
- Form validation errors are shown inline
- Network errors are handled gracefully
- 401 responses automatically redirect to login 