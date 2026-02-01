# MERN Task Management System

A full-stack **Task Management System** built using the **MERN stack (MongoDB, Express.js, React, Node.js)** with **JWT-based authentication**.  
The application allows users to manage projects and tasks with secure access and real-time task statistics.

---

## 📌 Features

### Authentication
- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes (frontend & backend)
- Logout functionality

### Project Management
- Create projects
- View all projects
- Delete projects
- Projects are user-specific

### Task Management
- Create tasks under projects
- Update task status (Todo, In Progress, Done)
- Update task priority (Low, Medium, High)
- Optional due date support
- Delete tasks
- Tasks are user-specific and project-based

### Dashboard
- Displays task statistics:
  - Todo
  - In Progress
  - Done
- Statistics update dynamically when tasks are added, updated, or deleted

---

## 🛠 Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

---


##  Project Structure
task-management-system/
│
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── models/
│ │ └── routes/
│ ├── server.js
│ ├── .env.example
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── tailwind.config.js
│ └── package.json
│
└── README.md


---

## 🗄 Database Models

### User
- name
- email
- password
- role

### Project
- name
- description
- user
- createdAt

### Task
- title
- description
- status
- priority
- dueDate
- project
- user
- createdAt

---

## 🔗 API Documentation

### Auth Routes
- `POST /api/auth/register` – Register user
- `POST /api/auth/login` – Login user

### Project Routes (Protected)
- `POST /api/projects` – Create project
- `GET /api/projects` – Get all projects
- `DELETE /api/projects/:id` – Delete project

### Task Routes (Protected)
- `POST /api/tasks` – Create task
- `GET /api/tasks` – Get all tasks
- `GET /api/tasks/project/:projectId` – Get tasks by project
- `PUT /api/tasks/:id` – Update task
- `DELETE /api/tasks/:id` – Delete task
- `GET /api/tasks/stats` – Get task statistics

---

## ⚙️ Environment Variables

Create a `.env` file in the **backend** directory using this example:

### `.env.example`




PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key


---

##  Setup Instructions

### Backend Setup


cd backend
npm install
npm run dev


### Frontend Setup


cd frontend
npm install
npm run dev


---

## ⏱ Estimated Time

8–12 hours

---

##  Conclusion

This project demonstrates a complete MERN stack application with secure authentication, project-task relationships, and a responsive dashboard UI.  
It follows clean architecture and industry best practices.

---

##  Author

Neelam Sujitha  
MERN Stack Developer


