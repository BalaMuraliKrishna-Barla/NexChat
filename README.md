# Konnect | Real-Time Chat Application

**Konnect** is a modern, full-featured, real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.IO. It provides a seamless and interactive user experience with features like one-on-one messaging, group chats, file sharing, and real-time notifications.

This project demonstrates a comprehensive understanding of full-stack development, real-time communication protocols, and modern UI/UX principles.

---

## Key Features

Konnect is packed with features designed for a modern communication experience.

#### **Core Chat Functionality**
*   **Real-time Messaging:** Instant message delivery using **Socket.IO**.
*   **One-on-One & Group Chats:** Easily create and manage both private and group conversations.
*   **Multimedia Sharing:** Securely upload and share images, videos, and documents via **Cloudinary**.
*   **Typing Indicators:** See when another user is typing a message in real-time.
*   **Read Receipts:** Double-check marks confirm when your message has been seen.
*   **Message Replies:** Reply directly to specific messages for threaded context.
*   **Emoji Support:** A built-in emoji picker to add personality to your messages.

#### **User & Group Management**
*   **Secure Authentication:** User signup and login with JWT (JSON Web Tokens) for secure, stateless authentication.
*   **User Search:** Find and start conversations with other registered users.
*   **Group Administration:** Create groups, rename them, change the group icon, and add or remove members.
*   **Profile Updates:** Users can update their name and profile picture.

#### **UI/UX Enhancements**
*   **Responsive Design:** A beautiful and functional UI on all screen sizes, built with **Tailwind CSS**.
*   **Dark & Light Mode:** A seamless theme toggle for user comfort.
*   **Real-time Notifications:** Receive notifications for new messages in chats you are not currently viewing.
*   **Online Presence Indicator:** See which users are currently online.
*   **Smooth Scrolling:** Auto-scrolling to new messages and a "scroll to bottom" helper arrow.
*   **Custom Font:** Uses the elegant "Poppins" font for a clean, modern look.

---

## Tech Stack & Architecture

| Category | Technology |
| :--- | :--- |
| **Frontend** | React, Context API, Tailwind CSS, Axios, Socket.IO Client |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Real-Time Engine**| Socket.IO |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js |
| **File Storage** | Cloudinary API |
| **Deployment** | Render (Web Service + Static Site) |

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   **Node.js** (v18 or higher recommended)
*   **MongoDB** (A local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

### Installation & Setup

1.  **Clone the Repository**
    ```sh
    git clone https://github.com/BalaMuraliKrishna-Barla/Konnect.git
    cd Konnect
    ```

2.  **Install Backend Dependencies**
    ```sh
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```sh
    cd ../frontend
    npm install
    ```

4.  **Configure Environment Variables**
    *   In the `backend` directory, create a new file named `.env`.
    *   Add the following variables and replace the placeholder values with your own.
    ```env
    # Server port
    PORT=5000

    # Your MongoDB Atlas connection string
    GLOBAL_MONGO_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/Konnect?retryWrites=true&w=majority"
    
    # A long, random string for JWT
    SECRET_KEY="your-super-secret-jwt-key"
    
    # Your Cloudinary API environment variable
    CLOUDINARY_URL="cloudinary://<api_key>:<api_secret>@<cloud_name>"
    
    # The URL for your local frontend (for CORS)
    CLIENT_URL="http://localhost:3000"
    ```

5.  **Run the Application**
    *   Open two separate terminals.
    *   In the first terminal, start the backend server:
      ```sh
      cd backend
      npm start
      ```
    *   In the second terminal, start the React frontend:
      ```sh
      cd frontend
      npm start
      ```

Your application should now be running locally at `http://localhost:3000`.

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Contact

Bala Murali Krishna Barla

*   Email: [krishnamurali.barla@sasi.ac.in](mailto:krishnamurali.barla@sasi.ac.in)
*   Project Link: [https://github.com/BalaMuraliKrishna-Barla/NexChat](https://github.com/BalaMuraliKrishna-Barla/NecChat)