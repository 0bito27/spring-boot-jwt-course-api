# CourseApp

Simple Spring Boot + React project for managing courses with JWT authentication.

## Structure

- `src/` → Backend (Spring Boot)
- `courseapp-frontend/` → Minimal frontend (React)
- `postman/` → Postman collection & test run files

## Features

- User registration and login with JWT
- Generated JWT token lasts for 1 day
- Role-based access control (`USER`, `ADMIN`)
- CRUD operations for courses admin's can do (`GET`, `POST`, `PUT`, `DELETE`)
- Frontend login and register forms
- Backend secures all course-related endpoints

## Setup

1. **Backend**

   - Make sure you have Java 17+ and Maven installed.
   - Configure your `application.properties` (JWT secret, database URL, username, password).
   - Run:
     ```bash
     mvn spring-boot:run
     ```
   - By default, backend runs on `http://localhost:8080`.

2. **Frontend**

   - Go to `courseapp-frontend/` folder:
     ```bash
     npm install
     npm start
     ```
   - Frontend runs on `http://localhost:3000`.

3. **Database**

   - Database tables are auto-created by Spring JPA based on the entities.
   - Make sure your database credentials in `application.properties` are correct.

4. **Testing with Postman**

   - Import Postman collection from `postman/` folder.
   - You can test all endpoints including login, register, and courses CRUD.

## Future Improvements

- Improve frontend UI/UX
- Add pagination and filtering for courses
- Add unit and integration tests
- Dockerize the application
- Deploy backend and frontend (e.g. Render / Vercel)


