# Viyu.in - Smart Classroom Resource Optimizer 🏫

A real-time dashboard for monitoring classroom resources (PCs, Projectors) across the SVVV College campus.

## 🚀 Features
- **Real-time Monitoring**: Live status (Online/Offline) of all devices via Socket.io.
- **Hierarchical View**: Browse by Campus -> Block -> Department -> Lab.
- **Interactive Dashboard**: Filter resources using the Sidebar.
- **Smart Alerts**: Visual indicators for offline devices.
- **Simulation**: Dev tool to simulate lab activity.

## 🛠️ Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18+)
- **MongoDB** (Local or Cloud)
- **Redis** (Required for real-time presence)

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repo-url>
cd Viyu.in
```

### 2. Backend Setup
```bash
cd backend
npm install
```
**Configuration:**
Create a `.env` file in the `backend` folder (copy from `.env.example`):
```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/viyu
REDIS_URL=redis://localhost:6379
DEVICE_SECRET=change_this_to_a_secure_secret
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Database Seeding (Important!) 
Populate the database with the SVVV Infrastructure (Blocks, Labs, PCs):
```bash
cd ../backend
node seed_svvv.js
```

## 🏃‍♂️ Running the Project

You will need **3 Terminal Windows**:

**Terminal 1: Backend**
```bash
cd backend
npm run dev
```

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

**Terminal 3: Device Simulator (Optional)**
To see "Online" devices without setting up real agents:
```bash
cd agent
# Copy .env.example to .env and set DEVICE_SECRET matching backend
node simulate_lab.js
```

## 📂 Project Structure
- **backend/**: Express API, Socket.io logic, MongoDB models.
- **frontend/**: React + Vite, Tailwind CSS dashboard.
- **agent/**: Scripts for client devices (`agent.js` for real PCs, `simulate_lab.js` for dev).

## 🤝 Contributing
1.  Fork the repo
2.  Create a feature branch
3.  Commit your changes
4.  Push to the branch
5.  Create a Pull Request
