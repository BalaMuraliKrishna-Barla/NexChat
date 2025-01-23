# NexChat Project

## Project Overview

NexChat is a real-time chat application built using the MERN stack (MongoDB, Express, React, and Node.js). The application provides features for user authentication, real-time messaging, and chat room management. It is designed to offer a seamless and interactive user experience.

---

## Features

- User Authentication (Sign Up and Login)
- Real-Time Messaging
- Chat Rooms
- Responsive Design with Bootstrap
- Secure Authentication using JWT

---

## File Structure

### Root Directory

- **.gitignore**: Specifies files and directories to ignore in Git version control.
- **package.json**: Contains project metadata and dependencies.
- **package-lock.json**: Tracks dependency versions for consistent installations.

### Backend

- **server.js**: Entry point for the backend application.
- **config/**
  - `db.js`: MongoDB connection setup.
  - `jwt.js`: JSON Web Token (JWT) configuration.
- **controllers/**
  - `chatController.js`: Logic for chat-related operations.
  - `userControllers.js`: Logic for user-related operations.
- **data/**
  - `data.js`: Sample data for development purposes.
- **middleware/**
  - `authMiddleware.js`: Middleware for authenticating routes.
- **models/**
  - `chatModel.js`: MongoDB schema for chat data.
  - `messageModel.js`: MongoDB schema for messages.
  - `userModel.js`: MongoDB schema for user data.
- **routes/**
  - `chatRoutes.js`: API endpoints for chat operations.
  - `userRoutes.js`: API endpoints for user operations.

### Frontend

- **public/**
  - `index.html`: The main HTML template for the React application.
  - `robots.txt`: Directives for web crawlers.
- **src/**
  - `App.jsx`: Entry point for the React application.
  - `index.js`: React DOM rendering.
  - **Context/**
    - `ChatProvider.js`: Context API setup for managing global state.
  - **components/**
    - **Authentication/**
      - `Login.jsx`: Login form component.
      - `Signup.jsx`: Signup form component.
    - **Chats/**
      - `Body.jsx`: Main chat body component.
      - `Footer.jsx`: Footer for chat input.
      - `Header.jsx`: Header for chat UI.
    - **miscellaneous/**
      - `SideBar.jsx`: Sidebar navigation.
  - **pages/**
    - `ChatsPage.jsx`: Page for displaying chats.
    - `HomePage.jsx`: Home page component.
  - **styles/**
    - `App.css`: Core styling for the application.
    - `additionalStyles.css`: Additional styles.
    - `index.css`: Global styles.

### Bootstrap

Includes the full Bootstrap 5.3.3 distribution for styling and responsiveness.

---

## Installation

### Prerequisites

- Node.js
- MongoDB

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd NexChat-main
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
4. Configure environment variables:
   - Create a `.env` file in the `backend` directory with the following:
     ```env
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-secret-key>
     ```
5. Start the development server:
   - Backend:
     ```bash
     cd backend
     npm start
     ```
   - Frontend:
     ```bash
     cd ../frontend
     npm start
     ```

---

## Usage

1. Navigate to the frontend URL (usually `http://localhost:3000`).
2. Sign up or log in to your account.
3. Start chatting in real-time.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add feature name'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License.

---

## Contact

For any queries or issues, please contact the repository owner.

Murali Krishna Barla\
email: [nexchatproject@gmail.com](mailto\:nexchatproject@gmail.com)

