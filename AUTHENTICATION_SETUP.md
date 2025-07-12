# Authentication Setup

This document explains the authentication system implemented in the StackIt Q&A platform.

## Overview

The authentication system uses:

-   **JWT (JSON Web Tokens)** for session management
-   **HTTP-only cookies** for secure token storage
-   **bcryptjs** for password hashing
-   **Zod** for form validation

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# JWT Secret for authentication (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/stackit

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## API Endpoints

### Authentication Endpoints

-   `POST /api/auth/login` - User login
-   `POST /api/auth/logout` - User logout
-   `POST /api/users` - User registration

### Protected Endpoints

The following endpoints require authentication:

-   `POST /api/questions` - Create question
-   `PUT /api/questions/:id` - Update question
-   `DELETE /api/questions/:id` - Delete question
-   `POST /api/questions/:id/vote` - Vote on question
-   `POST /api/answers` - Create answer
-   `PUT /api/answers/:id` - Update answer
-   `DELETE /api/answers/:id` - Delete answer
-   `POST /api/answers/:id/vote` - Vote on answer

## Frontend Authentication

### Components

1. **Login Page** (`/login`) - User login form with validation
2. **Register Page** (`/register`) - User registration form with validation
3. **Navigation** - Shows login/logout buttons and user menu
4. **AuthContext** - Provides authentication state throughout the app

### Usage

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
	const { user, login, logout, register } = useAuth();

	if (user) {
		return <div>Welcome, {user.username}!</div>;
	}

	return <div>Please log in</div>;
}
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcryptjs
2. **JWT Tokens**: Secure session management with expiration
3. **HTTP-only Cookies**: Prevents XSS attacks
4. **Form Validation**: Client and server-side validation with Zod
5. **Protected Routes**: Middleware protects sensitive endpoints
6. **CSRF Protection**: SameSite cookie attributes

## Middleware

The middleware (`src/middleware.ts`) handles:

-   Route protection for authenticated users
-   Redirect to login for protected routes
-   Redirect to home for authenticated users on auth pages
-   API route protection

## Validation Schemas

### Login Schema

```typescript
const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});
```

### Register Schema

```typescript
const registerSchema = z
	.object({
		username: z
			.string()
			.min(3, "Username must be at least 3 characters")
			.max(30, "Username must be less than 30 characters")
			.regex(
				/^[a-zA-Z0-9_]+$/,
				"Username can only contain letters, numbers, and underscores"
			),
		email: z.string().email("Please enter a valid email address"),
		password: z
			.string()
			.min(6, "Password must be at least 6 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number"
			),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});
```

## Getting Started

1. Install dependencies:

    ```bash
    pnpm install
    ```

2. Set up environment variables in `.env.local`

3. Start the development server:

    ```bash
    pnpm dev
    ```

4. Visit `http://localhost:3000/register` to create an account

5. Visit `http://localhost:3000/login` to sign in

## Production Considerations

1. **Change JWT Secret**: Use a strong, unique secret in production
2. **HTTPS**: Enable HTTPS in production for secure cookie transmission
3. **Database Security**: Use proper MongoDB authentication and network security
4. **Rate Limiting**: Implement rate limiting for auth endpoints
5. **Password Policy**: Consider implementing stronger password requirements
6. **Email Verification**: Add email verification for new accounts
7. **Password Reset**: Implement password reset functionality
