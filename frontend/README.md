# Smart Event Management Platform - Frontend

This is the frontend client for the Smart Event Management Platform. It is built using React, TypeScript, Tailwind CSS, React Router, and Axios.

## Features

- **Auth Screens**: Registration, Login, and Forgot Password views.
- **Event Catalog**: Search, category filters, status filters, and clickable dynamic card links.
- **Event Detail**: Event parameters (date, time, capacity limit), Google Maps navigation redirect link, and register/cancel buttons.
- **Role-based Dashboards**:
  - Attendee: View registered events and registration summary.
  - Organizer: Create events, edit events, delete events, and view total registration counts.
  - Admin: System metrics and user listing with deletion control.

## Setup Instructions

1. **Install Dependencies**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Configure environment variables (Optional)**
   You can create a `.env` file in the frontend root directory to configure the backend API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   If omitted, the app will fall back to using `http://localhost:5000/api` automatically.

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   By default, the Vite server will start at [http://localhost:5173](http://localhost:5173).
