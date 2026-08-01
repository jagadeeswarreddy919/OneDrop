# ONEDROP 🩸 - Full-Stack Emergency Blood Donation Platform

[![Production Status](https://img.shields.io/badge/Vercel-Production%20Live-emerald?style=for-the-badge&logo=vercel)](https://onedrop-india.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20MongoDB%20%7C%20Socket.io-blue?style=for-the-badge)](https://onedrop-india.vercel.app)
[![Capacity](https://img.shields.io/badge/Capacity-50k%20Concurrent%20Users-rose?style=for-the-badge)](https://onedrop-india.vercel.app)

**ONEDROP** is a full-stack blood donation platform that connects donors, recipients, hospitals, and administrators through real-time communication, intelligent matching, and emergency notifications.

---

## 🛠️ Architecture & Core System Features

### 🩸 Location-Based Matching & Emergency Dispatch
- **State & District Geocoding**: Matches blood requests with active donors across all 29 Indian states through hierarchical location indexing without external paid mapping API dependencies.
- **Multi-Channel Alert Dispatch**: Dispatches WebSocket events, SMS dispatches, email notifications, and FCM push notifications to eligible donors when an emergency request is created.
- **Two-Stage Request Lifecycle**:
  - Pledging a request sets its status to **`Accepted`**, keeping the ticket open for direct donor-recipient coordination via real-time chat.
  - When the requester marks the donation as verified, the status transitions to **`Fulfilled`**, awarding **+200 Reward Points**, a thank-you notification, and an **Official Appreciation Certificate** to the donor.

### 🔔 Real-Time Notification Pipeline
- **Sidebar Notification Center**: Consolidates all notifications (blood matches, chat messages, greetings, admin announcements) into the sidebar console across donor, recipient, and hospital dashboards.
- **Cross-Platform FCM WebPush**: Native status bar push notifications configured with custom icons, badges, vibration patterns, and deep-link routing.
- **Automated Greetings**: Scheduled morning, afternoon, and evening notifications.

### ⚡ High-Concurrency & System Scaling (50,000 Concurrent Users)
- **MongoDB Compound Indexing**: Compound indexes on `User`, `BloodRequest`, and `Notification` models for fast geospatial and location-hierarchy queries.
- **`.lean()` Execution**: Bypasses Mongoose document hydration on high-throughput read operations to reduce memory usage.
- **Parallel Telemetry Loading**: Admin dashboard telemetry requests execute in parallel via `Promise.all`, reducing load times (~150ms).
- **Optimized Network Sync**: 30-second background polling fallback coupled with instant WebSocket & FCM push delivery.

### 📧 3-Tier Contact & Feedback Delivery
- REST API gateway with browser SDK fallback and server-side fallback (`POST /api/auth/contact-feedback`).

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Redux Toolkit, TailwindCSS, Framer Motion, Lucide React |
| **Backend** | Node.js, Express.js, Socket.io, Mongoose (MongoDB Atlas), Nodemailer |
| **Push & Gateway** | Firebase Cloud Messaging (FCM Admin SDK), Service Worker WebPush API |
| **Deployment** | Vercel (Frontend SPA), Node Server Hosting (Backend API) |

---

## 📁 Repository Structure

```
ONEDROP/
├── client/                     # Frontend React SPA
│   ├── public/                 # Static assets & Firebase Service Worker (firebase-messaging-sw.js)
│   ├── src/
│   │   ├── components/        # Reusable UI components (NotificationBar, Navbar, Certificate)
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

- **AI Demand Forecasting**: Predicting regional blood demand spikes using historical donation patterns.
- **Donor Recommendation Engine**: Automated donor ranking based on response rate, distance, and donation eligibility cooldown.
- **Blood Shortage Prediction**: Proactive alerting for hospital blood bank inventory shortages.

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
