# ONEDROP 🩸 - Full-Stack Emergency Blood Donation Platform

[![Production Status](https://img.shields.io/badge/Vercel-Production%20Live-emerald?style=for-the-badge&logo=vercel)](https://onedrop-india.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20MongoDB%20%7C%20Socket.io-blue?style=for-the-badge)](https://onedrop-india.vercel.app)

**ONEDROP** is a full-stack blood donation platform that connects donors, recipients, hospitals, and administrators through real-time communication, location-based matching, and emergency notifications.

---

## 🛠️ Key Technical Features & Implementation

### 🔐 Authentication & Access Control
- **JWT Authentication**: Secure token-based user session management with password hashing using `bcryptjs`.
- **Role-Based Authorization**: Middleware-enforced access control across 5 user roles (`Donor`, `Recipient`, `Hospital`, `Admin`, `Super Admin`).

### 🩸 Location-Based Matching Engine
- **Hierarchical Location Indexing**: Matches blood requests with donors across Indian states, districts, and cities without paid external map API dependencies.
- **Two-Stage Request Lifecycle**:
  - Pledging a request transitions status to **`Accepted`**, keeping the ticket open for direct communication via real-time chat.
  - Verification by the requester transitions status to **`Fulfilled`**, awarding **+200 Reward Points**, a thank-you notification, and an **Appreciation Certificate**.

### ⚡ Real-Time Communication & Notifications
- **Socket.IO Real-Time Communication**: Event-driven WebSockets for instant message delivery, live request alerts, and status updates.
- **Firebase Cloud Messaging (FCM)**: Cross-platform background WebPush status bar notifications with custom icons, badges, vibration patterns, and deep-link routing.
- **Unified Notification Center**: React sidebar component displaying blood request alerts, chat messages, scheduled greetings, and admin broadcasts.
- **Multi-Channel Dispatch**: Automated SMS dispatches and EmailJS integration for direct email notifications.

### 📊 Performance & Optimization
- **MongoDB Indexing**: Compound indexes on `User`, `BloodRequest`, and `Notification` collections for location filtering and fast query execution.
- **`.lean()` Execution**: Bypasses Mongoose document hydration on read endpoints to reduce server memory overhead.
- **Concurrent API Requests**: Admin dashboard telemetry queries executed in parallel using `Promise.all` (~150ms execution).
- **Intelligent Synchronization**: 30-second background polling fallback coupled with event-driven WebSockets.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Redux Toolkit, TailwindCSS, Framer Motion, Lucide React |
| **Backend** | Node.js, Express.js, Socket.IO, Mongoose (MongoDB Atlas), Nodemailer |
| **Security & Auth** | JWT (JSON Web Tokens), Bcryptjs, Express Rate Limit, Helmet |
| **Push & Messaging** | Firebase Cloud Messaging (FCM Admin SDK), Service Worker WebPush API |
| **Deployment** | Vercel (Frontend SPA), Node Server Hosting (Backend API) |

---

## 📡 API Endpoints Architecture

| Category | Endpoint | Method | Auth Required | Description |
| :--- | :--- | :---: | :---: | :--- |
| **Auth** | `/api/auth/register` | `POST` | No | User registration across Donor, Recipient, and Hospital roles |
| **Auth** | `/api/auth/login` | `POST` | No | JWT authentication & credential verification |
| **Auth** | `/api/auth/contact-feedback` | `POST` | No | EmailJS contact form and feedback submission gateway |
| **Requests** | `/api/requests` | `POST` | Yes | Create emergency or standard blood request ticket |
| **Requests** | `/api/requests` | `GET` | No | Query active blood requests filtered by location & blood group |
| **Requests** | `/api/requests/:id/pledge` | `POST` | Yes | Donor pledge action (transitions status to `Accepted`) |
| **Requests** | `/api/requests/:id/pledge/:pledgeId` | `PUT` | Yes | Requester verification (transitions status to `Fulfilled` + Certificate) |
| **Notifications** | `/api/notifications` | `GET` | Yes | Fetch user notification feed (`.lean()` query execution) |
| **Notifications** | `/api/notifications/read-all` | `PUT` | Yes | Bulk mark notifications as read |
| **Chat** | `/api/chat/messages` | `POST` | Yes | Send peer-to-peer chat message and trigger push alerts |
| **Admin** | `/api/admin/metrics` | `GET` | Yes (Admin) | Retrieve platform telemetry summary |
| **Admin** | `/api/admin/broadcast` | `POST` | Yes (Admin) | Dispatch multi-channel broadcast to targeted users |

---

## 📁 Repository Structure

```
ONEDROP/
├── client/                     # Responsive React SPA
│   ├── public/                 # Static assets & Service Worker (firebase-messaging-sw.js)
│   ├── src/
│   │   ├── components/        # UI components (NotificationBar, Navbar, Certificate)
│   │   ├── pages/             # Dashboard views (Donor, Recipient, Hospital, Admin, Chat)
│   │   ├── redux/             # Redux state slices (authSlice)
│   │   ├── utils/             # API client, Socket handlers, EmailJS, Firebase SDK
│   │   └── App.jsx            # Application router and global socket listener
│   └── vercel.json            # Deployment routing
└── server/                     # Backend API Service
    ├── src/
    │   ├── config/            # Database (db.js), Mail, Sockets setup
    │   ├── controllers/       # Request, Auth, Admin, Chat, Notification handlers
    │   ├── middleware/        # JWT Authentication and Rate Limiting
    │   ├── models/            # MongoDB Schemas (User, BloodRequest, Notification, Chat)
    │   ├── routes/            # Express router definitions
    │   ├── services/          # Cron notification scheduler (notificationScheduler.js)
    │   └── utils/             # Firebase Admin SDK, SMS, WhatsApp gateways
    └── .env                   # Server environment configuration
```

---

## 🔮 Future Enhancements

- **AI Demand Forecasting**: Predicting regional blood demand spikes using historical donation data.
- **Donor Recommendation Engine**: Automated donor ranking based on response rate, distance, and donation cooldown.
- **Blood Shortage Alerting**: Proactive alerting for hospital blood bank inventory shortages.

---

## ⚙️ Environment Configuration

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/onedrop
JWT_SECRET=onedrop-super-secret-jwt-key

# Nodemailer SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=onedroplifesaver@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=onedroplifesaver@gmail.com

# WhatsApp Gateway
WHATSAPP_CALLMEBOT_API_KEY=your_key
WHATSAPP_CALLMEBOT_PHONE=+918500508940
```

---

## 🏃 Local Development Setup

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/jagadeeswarreddy919/OneDrop.git
cd OneDrop

# Frontend dependencies
cd client
npm install

# Backend dependencies
cd ../server
npm install
```

### 2. Run Servers

```bash
# Terminal 1 - Backend Server
cd server
npm run dev

# Terminal 2 - Frontend SPA
cd client
npm run dev
```

---

## 🌍 Deployment Links

- **Live Production URL**: [https://onedrop-india.vercel.app](https://onedrop-india.vercel.app)
- **GitHub Repository**: [https://github.com/jagadeeswarreddy919/OneDrop.git](https://github.com/jagadeeswarreddy919/OneDrop.git)
