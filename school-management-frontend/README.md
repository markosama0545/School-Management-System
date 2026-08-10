# INNUVA School Management System

A full-stack School Management System developed as an internship project at INNUVA IT Solutions.

The system manages students, teachers, classes, courses, and grades, with different access permissions for Admins, Teachers, and Students.

---

## Main Features

### Admin
The Admin Dashboard allows the admin to:

- View, add, edit, and delete students
- View, add, edit, and delete teachers
- View, add, edit, and delete classes
- View, add, edit, and delete courses
- Assign teachers to courses
- Assign courses to classes
- View dashboard statistics

### Teacher
The Teacher Dashboard allows a teacher to:

- View assigned courses
- View assigned classes
- View students inside those classes
- View student grades
- Update grades for courses they teach

### Student
The Student Dashboard allows a student to:

- View their class
- View classmates
- View courses
- View the teacher of each course
- View grades
- View their average grade

---

## Technologies

### Backend
- Java
- Spring Boot
- Spring Data JPA
- MySQL
- Maven
- Jakarta Validation

### Frontend
- React
- Vite
- JavaScript
- Axios / Fetch
- CSS
- Lucide React

### Tools
- IntelliJ IDEA
- MySQL
- Postman
- Git
- GitHub

---

## Project Architecture

The backend uses a layered structure:

```text
Frontend
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
MySQL Database
```

### Controller
Receives HTTP requests and returns HTTP responses.

Example: `POST /api/courses` is received by `CourseController`.

### Service
Contains the business logic.

For example, `CourseService` validates the teacher and classes before saving a course.

### Repository
Communicates with the database using Spring Data JPA.

### DTO
DTOs are used for request and response data instead of exposing database entities directly.

Examples:
- `CourseRequest`
- `CourseResponse`
- `StudentRequest`
- `TeacherResponse`

---

## Roles and Rights

The project does not depend only on role names such as Admin or Teacher.

It uses a Rights system.

Examples of rights:

```text
CanViewStudent
CanAddStudent
CanEditStudent
CanDeleteStudent

CanViewClass
CanAddClass
CanEditClass
CanDeleteClass

CanViewCourse
CanAddCourse
CanEditCourse
CanDeleteCourse
```

Roles are connected to rights through the `rolerights` table.

The backend uses `UserBehavior` to check permissions.

Example:

```java
userBehavior.requireCanAddCourse(userId);
```

This keeps permission checking in one place instead of repeating role checks throughout controllers and services.

---

## Example: Adding a Course

When an Admin creates a course:

1. React sends a POST request to `/api/courses`.
2. `CourseController` receives the request.
3. `CourseService` checks that the user has permission.
4. The service validates that the selected teacher exists.
5. It validates that the selected classes exist.
6. The course is saved using `CourseRepository`.
7. The course-class relationships are saved.
8. A `CourseResponse` is returned to React.
9. The Admin Dashboard refreshes the course list.

This demonstrates the main application flow:

```text
React → Controller → Service → Repository → Database
```

---

## Database

The main tables include:

- `users`
- `roles`
- `rights`
- `rolerights`
- `students`
- `teachers`
- `classes`
- `courses`
- `grades`
- `classcourses`

Important relationships include:

- A Student belongs to a Class
- A Student can have a User account
- A Teacher can have a User account
- A Course has a Teacher
- Courses can be assigned to Classes
- Grades connect Students and Courses
- Roles are connected to Rights

---

## Validation

The backend validates important operations before saving data.

Examples:

- Duplicate usernames are rejected
- Invalid class IDs are rejected
- Invalid teacher IDs are rejected
- Duplicate course names are rejected
- Grades must be between 0 and 100
- A user must have the required right before protected operations
- Some records cannot be deleted while related data still exists

---

## Frontend Design

The frontend is branded as **INNUVA School Management System**.

It includes:

- Shared INNUVA header
- INNUVA logo and colors
- Responsive dashboards
- Summary cards
- Forms
- Tables and management cards
- Confirmation modals
- Success and error messages

The Admin, Teacher, and Student dashboards use the same visual design while showing different information for each role.

---

## Running the Project

### Backend

From the project root:

```powershell
.\mvnw spring-boot:run
```

### Frontend

Open the frontend folder:

```powershell
cd school-management-frontend
```

Install packages if needed:

```powershell
npm install
```

Run Vite:

```powershell
npm run dev
```

Production build:

```powershell
npm run build
```

---

## What I Learned

This project helped me practice:

- Building a full-stack application
- REST API development
- CRUD operations
- Spring Boot layered architecture
- Spring Data JPA
- MySQL relationships
- DTOs
- Validation and exception handling
- Role/Rights authorization
- React state and API integration
- Responsive UI design
- Git and GitHub workflow

The most important architectural idea in the project is keeping authorization logic centralized through `UserBehavior` and Rights instead of spreading role checks throughout the application.

---

## Future Improvements

Possible future improvements:

- Password hashing
- JWT or session-based authentication
- Attendance management
- Search and filtering improvements
- More automated tests
- Reporting and analytics
- Production deployment

---

## Author

**Mark Osama**

Internship project developed at INNUVA IT Solutions.
