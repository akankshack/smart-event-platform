# Smart Event Management Platform - Backend

This is the backend API for the Smart Event Management Platform. It is built using Node.js, Express, MongoDB/Mongoose, JWT authentication, and Cloudinary for media storage.

## Features

- **Authentication**: JWT-based secure session handling with role-based routing (Admin, Organizer, Attendee).
- **Event Management**: CRUD endpoints for organizers, file upload support, status tracking (`Upcoming`, `Ongoing`, `Completed`).
- **Registrations**: Manage registrations and capacity checking.
- **Admin Utilities**: User listing/deletion and overall statistics aggregation.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the backend root directory (you can copy `.env.example` as a starting point) and update the values:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/smart_event_db
   JWT_SECRET=your_jwt_secret_key_here
   
   # Cloudinary Credentials (Optional, falls back to memory/base64 uploads if missing)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Start the Database**
   Ensure your local MongoDB instance is running, or hook up a MongoDB Atlas URI in your `.env`.

4. **Run the Server**
   - Development mode (with nodemon):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```
