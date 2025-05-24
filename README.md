# 💬 ChatBot – Real-Time Chat Application

This is a full-stack real-time chat application built using **React** (frontend) and **Node.js and express.js** with **Socket.IO** (backend). It supports sending both text and audio messages in a chat room.

---

## 🚀 Features

- 🔗 Real-time messaging with **Socket.IO**
- 👤 Join chat rooms with a username
- 💬 Send and receive **text** messages
- 🎙️ Record and send **audio** messages (browser mic access)
- 📦 Clean and modern UI with Tailwind CSS
- ⏰ Timestamps for all messages

---

## 🛠️ Tech Stack

### Frontend (`client/`)
- React
- Tailwind CSS
- react-scroll-to-bottom

### Backend (`server/`)
- Node.js
- Express
- Socket.IO

---

## 📁1. Project Structure

ChatBot-/
│
├── client/ # React frontend
│ ├── node_modules/
│ ├── public/
│ ├── src/
│ │ ├── App.css
│ │ ├── App.js
│ │ ├── Chat.js
│ │ ├── index.css
│ │ ├── index.js
│ │ └── reportWebVitals.js
│ ├── .gitignore
│ ├── package.json
│ ├── package-lock.json
│ ├── postcss.config.js
│ ├── tailwind.config.js
│ └── README.md
│
├── server/ # Node.js backend
 ├── node_modules/
 ├── index.js
 ├── package.json
 └── package-lock.json


🔧 2. Backend Setup (Express + Socket.IO)


cd server
npm init -y
npm install express socket.io nodemon cors


Here Create a file index.js this file is the entry point to our server.

⚛️ 3. Frontend Setup (React + Tailwind + Socket.IO)

cd ../client
npx create-react-app .
npm install socket.io-client react-scroll-to-bottom
npm install -D tailwindcss@3 postcss autoprefixer (If tailwind dependency throw error use this)
npx tailwindcss init -p


▶️ 4. Run the Application

In Terminal 1 (Backend):

cd server
node index.js


In Terminal 2 (Frontend):
cd client
npm start

GitHub link:- 
https://github.com/sainiSu/Chatbot/tree/main

