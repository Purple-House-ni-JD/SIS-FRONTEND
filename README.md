# SIS Frontend Documentation

## Overview

The `SIS-FRONTEND` project is a React application built with Vite. It provides the web user interface for a Student Information System (SIS) and supports three portal roles:

- `Admin`
- `Instructor`
- `Student`

The frontend uses React Router for client-side routing and integrates with a Django backend hosted in the `SIS-BACKEND/backend` project.

## Key Features

- Role-based portals and navigation
- JWT authentication and account activation flow
- CRUD operations for users, courses, enrollments, grades, and announcements
- Centralized API request handling with token management
- Responsive UI shell with nested routes

## Tech Stack

- React 19
- Vite
- React Router DOM 7
- Plain JavaScript (no TypeScript)
- ESLint for linting

## Project Structure

Important folders and files:

- `package.json` - project dependencies and scripts
- `src/main.jsx` - app bootstrap and router setup
- `src/App.jsx` - route definitions and portal layouts
- `src/layouts/AppShell.jsx` - shared shell and navigation layout
- `src/lib/apiClient.js` - API request helper and token storage
- `src/services/*.js` - domain-specific API wrappers
- `src/pages/` - page components for public, student, instructor, and admin portals
- `src/data/portalConfig.js` - portal navigation definitions
- `src/index.css` - global app styles

## How To Run

### Prerequisites

- Node.js installed
- `SIS-BACKEND` running and reachable from the frontend
- Environment variable `VITE_API_URL` configured to point at the backend API base URL

### Install dependencies

Open a terminal in `SIS-FRONTEND` and run:

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

This starts the Vite dev server. By default, it will serve the app on `http://localhost:5173` unless configured otherwise.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Backend Integration

The frontend communicates with the backend using REST API calls. All network requests are issued through `src/lib/apiClient.js`.

### API base URL

The backend base URL is read from the environment variable:

- `import.meta.env.VITE_API_URL`

If this environment variable is unset, requests are made to relative paths.

### Token storage

JWT tokens are stored in browser `localStorage` under:

- `sis_access`
- `sis_refresh`

The access token is attached to outgoing requests via the `Authorization` header.

### API helper behavior

The helper function `apiRequest(path, options)`:

- builds an absolute URL from `VITE_API_URL`
- attaches `Authorization: Bearer <access_token>` when available
- sends JSON request bodies when appropriate
- parses JSON responses
- throws a normalized error object on non-OK responses

### Response handling

`unwrapList(data)` is used to normalize list responses, accepting either an array or an object with a `results` array.

## Authentication and User Flow

Authentication is handled in `src/services/authService.js`.

### Login

- `loginJwt(email, password)` POSTs to `/auth/jwt/create/`
- stores tokens on success
- returns JWT access and refresh tokens

### Current user

- `fetchMe()` GETs `/auth/users/me/`
- caches the current user object in memory
- `clearMeCache()` and `getCachedMe()` are provided for cache control

### Profile update

- `patchMe(body)` PATCHes `/auth/users/me/`

### Logout

- `logout()` clears both stored tokens and cached user data

### Activation

- `activateAccount(body)` POSTs to `/auth/users/activation/`
- the activation page is routed at `/activate/:uid/:token`

## Domain Services and Endpoints

The frontend uses service modules for each data domain:

### Users

`src/services/usersService.js`

- `listUsers()` → GET `/api/users/`
- `createUser(body)` → POST `/api/users/`
- `updateUser(id, body)` → PATCH `/api/users/:id/`
- `resendActivation(id)` → POST `/api/users/:id/resend_activation/`
- `fetchNextReferenceId()` → GET `/api/users/next_reference_id/`

### Courses

`src/services/coursesService.js`

- `listCourses()` → GET `/api/courses/`
- `createCourse(body)` → POST `/api/courses/`
- `updateCourse(id, body)` → PATCH `/api/courses/:id/`
- `deleteCourse(id)` → DELETE `/api/courses/:id/`

### Enrollments

`src/services/enrollmentsService.js`

- `listEnrollments()` → GET `/api/enrollments/`
- `createEnrollment(body)` → POST `/api/enrollments/`
- `updateEnrollment(id, body)` → PATCH `/api/enrollments/:id/`
- `deleteEnrollment(id)` → DELETE `/api/enrollments/:id/`

### Grades

`src/services/gradesService.js`

- `listGrades()` → GET `/api/grades/`
- `createGrade(body)` → POST `/api/grades/`
- `updateGrade(id, body)` → PATCH `/api/grades/:id/`

## Routing and Page Structure

`src/App.jsx` defines the routes and portal layout.

### Public routes

- `/` → `PublicHome`
- `/activate/:uid/:token` → `ActivateAccountPage`

### Student portal

- `/student` → `StudentDashboard`
- `/student/grades` → `StudentGradesPage`
- `/student/announcements` → `StudentAnnouncementsPage`
- `/student/profile` → `StudentProfilePage`

### Instructor portal

- `/instructor` → `StaffDashboard`
- `/instructor/courses` → `StaffGradingPage`
- `/instructor/grades` → `StaffGradesPage`
- `/instructor/announcements` → `StaffAnnouncementsPage`
- `/instructor/profile` → `StaffProfilePage`

### Admin portal

- `/admin` → `AdminDashboard`
- `/admin/users` → `AdminUsersPage`
- `/admin/courses` → `AdminGradesPage`
- `/admin/enrollments` → `AdminEnrollmentsPage`
- `/admin/grades` → `AdminGradeRecordsPage`
- `/admin/announcements` → `AdminAnnouncementsPage`

### Shared layout

`AppShell` provides the common sidebar, navigation links, logout link, and nested outlet for portal pages.

## How it works

1. The app boots in `src/main.jsx` and wraps `App` with `BrowserRouter`.
2. `App` loads route definitions and renders portal shells for `/student`, `/instructor`, and `/admin`.
3. Each portal page uses service helpers to load backend data and present it in the UI.
4. `apiClient.js` centralizes network logic and attaches JWTs to requests.
5. Portal navigation is driven by `src/data/portalConfig.js`.
6. The backend is expected to expose REST resources under `/api/*` and auth endpoints under `/auth/*`.

## Practical notes

- This frontend assumes a working Django REST backend in `SIS-BACKEND/backend`.
- The app depends on the backend for authentication, user data, courses, enrollments, grades, and announcements.
- A matching `.env` or Vite environment configuration should define `VITE_API_URL` for local development.

## Recommended next steps

- Add a more complete `README.md` with environment setup and backend startup commands
- Document any expected backend ports and CORS settings
- Add service wrappers for announcements and any missing API domains
- Improve error handling UI and token refresh support if needed
