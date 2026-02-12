# Smart Classroom Resource Optimizer (Viyu.in)

> **Transforming traditional academic infrastructure into a data-driven environment.**

## 📖 Project Abstract
The **Smart Classroom Resource Optimizer** is an intelligent, full-stack management ecosystem designed to provide real-time visibility and control over classroom assets. Built on a high-performance **MERN** architecture, the platform introduces a **Software-Defined Monitoring (SDM)** model that utilizes lightweight "Heartbeat Agents" to monitor critical computing resources without expensive IoT sensors.

## 🚀 Key Objectives
- **Real-time Infrastructure Visibility**: Track "Active/Idle/Offline" status of resources with sub-second synchronization.
- **Zero-Cost Deployment**: Leverage existing computing infrastructure as the primary data source, eliminating IoT hardware costs.
- **Automated Operational Workflows**: Reduce administrative overhead with automated attendance and instant maintenance tickets.
- **Energy Sustainability**: Identify "Ghost Power" usage to reduce campus energy costs.
- **Hybrid Architectural Scalability**: Modular design capable of scaling to handle IoT sensor data in the future.

## 🛠️ Technical Stack

### Backend
- **Node.js & Express.js**: Asynchronous I/O for handling concurrent "heartbeat" pings.
- **Socket.io**: Full-duplex communication for real-time dashboard updates.
- **Passport.js & JWT**: Role-Based Access Control (RBAC) related security.

### Frontend
- **React.js**: Component-based architecture for the "Resource Grid" dashboard.
- **Tailwind CSS**: Utility-first framework for responsive styling.

### Data Layer
- **MongoDB Atlas**: Primary store for persistent data (User profiles, Asset metadata, Logs).
- **Redis**: Hot-path caching for "live status" data to ensure <150ms latency.

## 🏗️ System Architecture

The system follows a **Decoupled 3-Tier Architecture**:
1.  **Tier 1: Data Source (The Agent)** - Lightweight scripts on lab PCs.
2.  **Tier 2: Application Logic (The Controller)** - Node.js/Express backend handling auth and ingestion.
3.  **Tier 3: Presentation (The Dashboard)** - React.js frontend for visualization.

### Data Flow
1.  **Agent** sends heartbeat (every 60s).
2.  **API Gateway** validates request.
3.  **Redis** updates device status (Hot-Path).
4.  **MongoDB** logs event for history.
5.  **Socket.io** broadcasts `status_update`.
6.  **Dashboard** reflects change instantly.

## 🌟 Key Features

### 1. Real-Time Monitoring Module
- **Heartbeat Ingestion**: Processes status pings from lab PCs.
- **Status Categorization**: Online (<60s), Idle, Offline (>120s).
- **Live Dashboard**: Visual grid updating via Socket.io.

### 2. Automated Attendance Module
- **Dynamic QR Generation**: QR codes refresh every 30 seconds to prevent proxy attendance.
- **Verification**: Validates student identity and session parameters.

### 3. Maintenance & Ticketing Module
- **Automated Trigger**: Auto-generates tickets if a resource goes offline during a class.
- **Manual Reporting**: "One-Click Report" for physical issues.
- **Ticket Tracking**: Kanban-style board for maintenance staff.

### 4. Admin Analytics & Energy Insight
- **Utilization Heatmaps**: Identify over/under-utilized labs.
- **Energy Leakage Detector**: Flags "Ghost Power" usage (active devices in empty rooms).
- **Reporting Engine**: Weekly reports on hardware health and savings.

## 🔐 Security Framework
- **RBAC**: Admin, Faculty, and Student roles.
- **Anti-Proxy**: Dynamic QR codes with payload hashing and rotation.
- **API Security**: DeviceKey rotation and Rate Limiting for heartbeat pings.
- **Data Protection**: Environment variables for credentials, CORS policy, and bcrypt password hashing.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas Account
- Redis Server (or Cloud)

### Steps
1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/viyu-in.git
    cd viyu-in
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Configure .env file with MONGO_URI, REDIS_URL, JWT_SECRET, etc.
    npm start
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    npm start
    ```

4.  **Agent Setup (on Lab PCs)**
    - Deploy the heartbeat script to client machines.
    - Configure with unique `DeviceID` and Server URL.

## 🤝 Contribution
Contributions are welcome! Please follow the standard fork-and-pull request workflow.

## 📄 License
[MIT License](LICENSE)
