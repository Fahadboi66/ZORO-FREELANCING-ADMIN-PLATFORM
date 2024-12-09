
# ZORO-FREELANCING-PLATFORM-ADMIN-PANEL

A full-stack web application built with **React** (frontend) and **Node.js/Express** with **MongoDB** (backend).

---

## 📂 Project Structure

### 1. **Client** (Frontend)
- Built with **React** and **Vite**.
- Handles the user interface and client-side logic.
- Uses Firebase for additional functionality (e.g., authentication, storage).

### 2. **Server** (Backend)
- Built with **Node.js**, **Express**, and **MongoDB**.
- Handles API routes, business logic, and database operations.

---

## 🛠️ Tech Stack

### Frontend:
- React
- Vite
- Tailwind CSS (if applicable)
- Firebase (for authentication or other features)

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose ODM)

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js (v16+ recommended)
- MongoDB
- npm or yarn package manager

---

### 🔧 Installation

#### 1. Clone the Repository

#### 2. Install Dependencies
##### Frontend
```bash
cd client
npm install
```

##### Backend
```bash
cd server
npm install
```

---

### 🔑 Environment Variables

#### Frontend (`client/.env`)
```env
VITE_APP_API_URL=http://localhost:4000
VITE_FIREBASE_API_KEY="API KEY HERE"
```

#### Backend (`server/.env`)
```env
PORT=4000
MONGO_DB_URL="mongodb url here/database name"
ACCESS_TOKEN_SECRET="Secret key here"
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET="secret key here"
REFRESH_TOKEN_EXPIRY=30d
NODE_ENV="development"
```

---

### ▶️ Run the Application

#### Frontend
```bash
cd client
npm run dev
```
The frontend will be running on `http://localhost:5173` by default.

#### Backend
```bash
cd server
npm run dev
```
The backend will be running on `http://localhost:4000`.

---

## 📂 Folder Structure

### Frontend (Client)
```plaintext
client/
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/            # Page components
│   ├── assets/           # Static assets (images, 
icons, etc.)
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Entry point
|   .
|   .
|   .
└── vite.config.js        # Vite configuration
```

### Backend (Server)
```plaintext
server/
├── src/
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middlewares/      # Middleware functions
│   └── utils/            # Utility functions
├── app.js                # Main server app
└── index.js             # Entry point
```

---

## 💡 Features
- **User Authentication**: Secure login and registration using JWT and Firebase.
- **CRUD Operations**: Full CRUD functionality for key resources.
- **Responsive UI**: Built with modern design principles.
- **Scalable Architecture**: Backend organized with MVC principles.

---

## 🤝 Contributing
1. Fork the repository.
2. Create a new feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## ⚖️ License
This project is licensed under the [MIT License](LICENSE).

---

## 📧 Contact
If you have any questions, feel free to reach out:
- **Name**: Fahad Zafar
- **Email**: [fahadzafarmayo123@gmail.com](mailto:fahadzafarmayo123@gmail.com)
```
