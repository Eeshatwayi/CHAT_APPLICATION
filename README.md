Real-Time Chat Application
This project is a real-time chat application built using the MERN stack (MongoDB, Express.js, React, and Node.js) along with Socket.IO for instant communication.
It supports public chat rooms, private rooms with access codes, file and image sharing, and secure user authentication.
Both backend and frontend are organized as separate applications inside the same project folder.

Features
Real-Time Messaging

Messages are delivered instantly using WebSockets without refreshing the page.

Public Chat Rooms

Users can join any public room immediately and start chatting.

Private Rooms with Codes

Users can create private rooms that generate a unique 6-character code.
Anyone who has this code can join the room.

Media Sharing

Users can upload and send images or files.
Uploaded media is stored using Cloudinary.

Message History

All chat messages are stored in MongoDB and can be viewed later.

Authentication

Registration and login are implemented using JWT-based authentication.

Responsive UI

The frontend layout adapts smoothly to desktop, tablet, and mobile screens.

Tech Stack
Frontend

React.js

Axios

Socket.IO Client

CSS

Backend

Node.js

Express.js

MongoDB + Mongoose

Socket.IO

Cloudinary (for media uploads)

Project Structure
chat_assignment/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    server.js
    package.json
    .env.example

  frontend/
    public/
    src/
      components/
      context/
      services/
      App.js
      index.js
    package.json
    .env.example

  README.md

Setup Instructions (Local Development)
1. Clone the repository
git clone https://github.com/Eeshatwayi/CHAT_APPLICATION.git
cd CHAT_APPLICATION

2. Backend Setup
cd backend
npm install


Create a new .env file inside the backend folder (based on .env.example):

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_app_password


Run the backend:

npm start


The backend will start at:

http://localhost:5000

3. Frontend Setup

Open a new terminal:

cd frontend
npm install


Create a .env file inside the frontend folder (based on .env.example):

REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000


Start the frontend:

npm start


The app will run at:

http://localhost:3000

Notes

Users must create their own .env files in both backend and frontend.

If using MongoDB Atlas, update the backend .env MONGODB_URI accordingly.

File uploads depend on browser support. When downloading files, some media may not decode properly due to browser-side limitations.

Private rooms require sharing the room code manually with other users.

Limitations / Drawbacks

Two private rooms cannot have the same name for a single user, as room names are unique in the database.

File uploads depend on how each browser handles media encoding and decoding.

When downloading files shared in chat, certain formats may not decrypt or open correctly depending on browser behavior.

Cloudinary free tier limits file size, bandwidth, and upload frequency.

Real-World Relevance

This project reflects concepts used in applications like Slack, WhatsApp, and Microsoft Teams, such as real-time communication, room-based messaging, authentication, and file sharing.

License

This project was created for academic and learning purposes.
