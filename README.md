# **Real-Time Chat Application**

This project is a real-time chat application developed using the MERN stack (MongoDB, Express.js, React, Node.js) with Socket.IO for instant communication.
It supports public and private chat rooms, media sharing, authentication, and persistent chat history.
The backend and frontend are organized separately within the same project.

---

## **Features**

### **Real-Time Messaging**

Messages are delivered instantly using WebSockets without requiring page refresh.

### **Public Chat Rooms**

Users can freely join any public room.

### **Private Rooms with Access Codes**

Users can create private rooms that generate a unique 6-character code.
Anyone with the code can join the room.

### **Media & File Sharing**

Images and files can be uploaded and sent in chats.
Media is stored using Cloudinary.

### **Persistent Chat History**

All messages are stored in MongoDB and can be viewed later.

### **User Authentication**

JWT-based secure signup and login functionality.

### **Responsive UI**

The interface adjusts smoothly across desktops, tablets, and mobile screens.

---

## **Tech Stack**

### **Frontend**

* React.js
* Axios
* Socket.IO Client
* CSS

### **Backend**

* Node.js
* Express.js
* MongoDB with Mongoose
* Socket.IO
* Cloudinary

---

## **Project Structure**

```
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
```

---

## **Setup Instructions (Local Development)**

### **1. Clone the Repository**

```
git clone https://github.com/Eeshatwayi/CHAT_APPLICATION.git
cd CHAT_APPLICATION
```

---

## **2. Backend Setup**

### Install dependencies:

```
cd backend
npm install
```

### Create `.env` file (based on `.env.example`):

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_app_password
```

### Start the backend:

```
npm start
```

Backend will run at:

```
http://localhost:5000
```

---

## **3. Frontend Setup**

Open a new terminal:

### Install dependencies:

```
cd frontend
npm install
```

### Create `.env` file (based on `.env.example`):

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Start the frontend:

```
npm start
```

Frontend will run at:

```
http://localhost:3000
```

---

## **Notes**

* You must manually create `.env` files in both backend and frontend.
* If using MongoDB Atlas, update the backend `.env` MONGODB_URI accordingly.
* File uploads behave differently depending on browser handling; downloaded files may not decode properly in some cases.
* Private rooms require users to share the generated 6-character code.

---

## **Drawbacks / Limitations**

* Private rooms cannot share the same name because room names are unique in the database.
* File decryption or decoding depends on the recipient’s browser; certain downloads may not open correctly.
* Cloudinary free tier limits file size and bandwidth.

---

## **Real-World Relevance**

This project demonstrates concepts used in popular communication tools like Slack, WhatsApp, and Microsoft Teams, such as real-time messaging, chat rooms, authentication, and media sharing.

---

## **License**

This project is created for academic and learning purposes.

