# Online Course Management System

A full-stack web application for managing online courses. This system allows administrators and teachers to create, update, and delete courses and their corresponding lessons. Students can register, log in, and view the available courses.

## Architecture & Tech Stack

The project follows a client-server architecture:

- **Frontend (Client):** Developed with **Angular**.
- **Backend (Server):** Developed with **Node.js** and the **Express.js** framework.
- **Database:** **SQLite** for data storage.
- **API Testing:** A Postman collection is provided for easy API endpoint testing.

## Features

- **User Authentication:** Secure registration and login for users.
- **Course Management:**
  - View all courses.
  - Add a new course.
  - Delete an existing course.
- **Lesson Management:**
  - View all lessons for a specific course.
  - Add a new lesson to a course.
  - Delete a lesson from a course.
- **Role-Based Access:** Certain actions, like course and lesson management, are restricted to admin users.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (which includes npm)

### Installation & Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/chagitk/Courses.git
   cd Courses
   ```

2. **Set up the Backend Server:**
   ```sh
   cd CourseOnlineServer
   npm install
   ```

3. **Set up the Frontend Application:**
   ```sh
   cd ../CourseOnlineClient
   npm install
   ```

### Running the Application

You need to run both the backend and frontend servers concurrently in two separate terminals.

1. **Run the Backend Server:**
   - Navigate to the `CourseOnlineServer` directory.
   - Run the command:
     ```sh
     npm start
     ```
   - The server will start on `http://localhost:3000`.

2. **Run the Frontend Application:**
   - Navigate to the `CourseOnlineClient` directory.
   - Run the command:
     ```sh
     npm start
     ```
   - The application will open automatically in your browser at `http://localhost:4200`.

## API Testing

An exported Postman collection is available in the project for testing the backend API.

- **File:** `CourseOnlineServer/online_courses_api.postman_collection.json`
- Import this file into Postman to access a pre-configured collection of all available API requests.
