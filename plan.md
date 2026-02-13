# Viyu.in Project Execution Plan (MVP)

> **Goal:** Build a "Live" Smart Classroom Resource Optimizer prototype in 4 days.

## 1. The Heart: Backend Engine (Node.js + Express)
**Focus:** Build only APIs that make the system "Live". Keep it lightweight.

### **Core Models (Mongoose)**
- `Resource`: `deviceId`, `roomNo`, `type` ["PC"], `status` ["Online", "Offline"], `lastSeen`.
- `Ticket`: `deviceId`, `issue`, `status`.
- `Attendance`: `studentId`, `sessionId`, `timestamp`.

### **Critical API Routes**
- **POST `/api/heartbeat`**:
  - **Header:** `x-device-token` (Values stored in .env).
  - **Logic:**
    1.  **Validate:** Middleware checks token.
    2.  **Redis Sync:** `SET device_id:status "Online" EX 65`.
    3.  **Real-time:** `io.emit('status_update', { deviceId, status: "Online" })` *immediately*.
    4.  **DB:** Async update to MongoDB `lastSeen`.
  - **Response:** 200 OK.

### **Redis "Magic" (Pro-Tip)**
- **Keyspace Notifications:** Configure Redis to emit events on key verify expiration.
- **Backend Listener:** When a key expires (device goes offline), a backend listener triggers:
  1.  Updates MongoDB status to "Offline".
  2.  Broadcasts `status_update` { status: "Offline" } to frontend.
  - *Benefit:* No manual "Offline" logic needed in the heartbeat loop.

### **"Zombie" PC Handling**
- **Server Init:** On startup, query Redis. If a device key is missing, mark as "Offline" in DB/State.

---

## 2. The Pulse: Agent Script (Node.js)
**Concept:** Lightweight background script.
**Logic:**
1.  **Loop:** `setInterval` (30s) -> POST `/api/heartbeat`.
2.  **Resilience:** `try-catch` to log errors without crashing.
3.  **Identity:** Sends `deviceId` in body and `x-device-token` in headers.

---

## 3. The Eye: Dashboard UI (React + Tailwind)
**Concept:** "Bird's Eye View" - Authenticity & Performance.

### **State Optimization (Pro-Tip)**
- **Data Structure:** Use a **Key-Value Map** instead of an Array for O(1) updates.
  ```javascript
  const [resources, setResources] = useState({
    "LAB1-PC01": { status: 'Online', lastSeen: ... },
  });
  ```
- **Benefit:** When Socket event arrives, update specific key instantly without array iteration.

### **Visuals & Authenticity**
- **Layout:** Sidebar (Labs) + Main Grid (PCs).
- **Indicators:**
  - **🟢 Green / 🔴 Red:** Status.
  - **Animation:** Use **Framer Motion** for smooth color transitions/blinks on status change.
- **Global Timer (Pro-Tip):** "Last Server Pulse: 2s ago" in the header (derived from last socket msg). Avoids per-card timers.

---

## 4. The Flow: Attendance & Tickets

### **Attendance (MVP Shortcut)**
- **Static QR URL:** `viyu.in/scan?session=CSE101_12Feb&secret=XYZ`
- **Flow:** Student scans -> Opens URL -> API marks attendance (Mock auth logic for MVP).

### **Ticketing System**
- **Interaction:** Click **Red** card -> "Report Issue" Modal -> Submit Ticket.

---

## 5. Execution Roadmap (4 Days)

| Day | Focus Area | Tasks |
| :--- | :--- | :--- |
| **Day 1** | **Backend & Redis** | Node/Express setup, Redis Keyspace Notifications, Heartbeat API. |
| **Day 2** | **Agent & Logic** | Robust Agent script, "Zombie" handler, Security Middleware. |
| **Day 3** | **Frontend Core** | React Map-based State, Grid Layout, Framer Motion, Socket.io. |
| **Day 4** | **Polish & Demo** | Attendance QR URL, Ticket Modal, End-to-end dry run. |

---

## 6. Tech Stack
- **Frontend:** React, Tailwind, Framer Motion, Lucide-React.
- **Backend:** Node.js, Express, Socket.io.
- **DB:** MongoDB (History), Redis (Live Status + Expiry Events).