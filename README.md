# Employee Service

A full‑stack **Employee Management** web application with a **Spring Boot + PostgreSQL** backend and a **React (Vite)** frontend.

## Why This Project?

This project was built to:

- Practice full‑stack development with a modern Java backend and React frontend.
- Learn to design and expose RESTful APIs.
- Work with a relational database (PostgreSQL) via JPA/Hibernate.
- Use a modern frontend toolchain (Vite + React).

The app models a simple employee system where each employee has a `name`, `manager`, and `salary`, and can be created, viewed, updated, and deleted.

---

## Tech Stack

**Backend**

- Java, Spring Boot
- Spring Web (REST)
- Spring Data JPA (Hibernate)
- PostgreSQL
- Lombok
- Maven

**Frontend**

- React (Vite)
- Axios
- @tanstack/react-table
- npm

---

## Getting Started

### Prerequisites

- Java 21+ (project `java.version` is 25)
- Maven 3+
- Node.js 18+ and npm
- PostgreSQL running locally or accessible
- Git (for version control / GitHub)

---

### Backend Setup (Spring Boot + PostgreSQL)

1. Configure the database in `src/main/resources/application.properties`:
   - JDBC URL
   - username
   - password
   - schema (e.g. `employee`)

2. From the project root:
   mvn spring-boot:run
3. Backend will run at:
   `http://localhost:8080`

---

## API Endpoints

Base URL: `http://localhost:8080`

All responses use JSON.

### Employee Resource

- **GET `/employees`**  
  Returns a list of all employees.

- **GET `/employees/{employeeId}`**  
  Returns a single employee by ID.

- **POST `/employees`**  
  Creates a new employee.
  
  - **PUT `/employees/{employeeId}`**  
  Updates an existing employee.

  - **DELETE `/employees/{employeeId}`**  
  Deletes the employee with the given ID.  
  Returns a message string indicating the result.

---

## Frontend Setup (React + Vite)

From the project root:

cd employee-web
npm install
npm run dev
The frontend dev server will run at (by default):

- `http://localhost:5173`

The React app uses Axios to call the backend API (e.g. `http://localhost:8080/employees`) and @tanstack/react-table to render employee data in a table.

---

## Running the Full Stack

1. Start PostgreSQL and ensure the database/schema exist.
2. In one terminal (project root):
   mvn spring-boot:run
   3. In another terminal:
   cd employee-web
   npm run dev
   4. Open `http://localhost:5173` in your browser to use the UI.

---

## Git & GitHub

Typical workflow for changes:

git status
git add .
git commit -m "Describe your change"
git push---

## Future Improvements

- Better form validation and error handling in the UI.
- Pagination, sorting, and filtering in the employee table.
- Authentication and role‑based access control.
- Automated tests (unit/integration for backend, component tests for frontend).
- Dockerization for backend + database, and CI/CD pipeline.
