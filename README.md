# 🎉 Smart Event Platform

A full-stack Event Management Web Application built using the MERN Stack that enables organizers to create and manage events while allowing attendees to browse, register, and track event participation through a secure role-based system.

---

## 📌 Project Overview

Smart Event Platform is a web-based application designed to simplify event management by providing separate dashboards for **Admins**, **Organizers**, and **Attendees**.

The platform offers secure authentication, event registration, role-based authorization, and an intuitive interface for managing events efficiently.

---

## 🚀 Features

### 👤 Authentication
- Secure JWT Authentication
- User Registration & Login
- Forgot Password
- Role-Based Access Control

### 🎯 Organizer
- Create Events
- Edit Events
- Delete Events
- Upload Event Posters
- View Personal Events

### 🎟️ Attendee
- Browse Events
- Search & Filter Events
- View Event Details
- Register for Events
- Cancel Registration
- View Registered Events

### 🛡️ Admin
- Dashboard Analytics
- View All Users
- Delete Users
- Monitor Platform Activity

---

## 🛠 Tech Stack

### Frontend
- React.js
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary

### Deployment
- Render (Backend)
- Render / Static Hosting (Frontend)

---

## 📂 Project Structure

```
smart-event-platform/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## 🔐 User Roles

### Admin
- Manage Users
- View Dashboard
- Monitor Platform Statistics

### Organizer
- Create Events
- Update Events
- Delete Events
- View Created Events

### Attendee
- Browse Events
- Register for Events
- Cancel Registration
- View Registered Events

---

## 📸 Screenshots

> Add screenshots of the following pages:

- Home Page
- Login
- Registration
- Organizer Dashboard
- Admin Dashboard
- Event Details
- Create Event
- My Registrations

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/akankshack/smart-event-platform.git
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📈 Future Enhancements

- Email Notifications
- QR Code Based Event Check-In
- Online Payment Integration
- Certificate Generation
- Event Reviews & Ratings
- Calendar Integration
- Event Analytics Dashboard

---

## 🎯 Learning Outcomes

This project helped in understanding:

- REST API Development
- JWT Authentication
- Role-Based Authorization
- CRUD Operations
- MongoDB Relationships
- State Management
- API Integration
- Full-Stack Deployment
- MERN Architecture

---

## 👩‍💻 Author

**Akanksha C**

GitHub: https://github.com/akankshack

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
