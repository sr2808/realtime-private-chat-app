# Realtime Private Chat App

A **privacy-focused, ephemeral chat application** where users can create temporary chat rooms that automatically expire. Messages and rooms are short-lived by design, ensuring no long-term data storage.

This project explores **near real-time messaging**, **serverless-friendly architecture**, and **Redis-based coordination** using modern web tooling.

---

## ✨ Features

- 🔐 **Private Rooms** — Each room has a unique, shareable URL
- ⏱ **Auto-Expiring Rooms** — Rooms self-destruct after a fixed time
- 💬 **Near Real-Time Messaging** — Messages delivered using HTTP + Redis Pub/Sub
- 🧹 **Ephemeral Data** — Messages disappear when the room expires
- 🕶 **Anonymous Users** — No accounts, no sign-ups
- 🔗 **One-Click Invite** — Copy room link easily
- 📱 **Responsive UI** — Works across desktop and mobile
- 🌙 **Dark Theme** — Clean, minimal interface

---

## 🧠 Why This Project?

Most chat applications store messages indefinitely and require user accounts.  
This project was built to explore:

- How **temporary, privacy-first chat systems** can be designed
- Using **Redis** for real-time coordination instead of heavy databases
- Building **lightweight architectures** with clear trade-offs
- Managing **ephemeral data lifecycles** cleanly

---

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend / API**: Elysia (via Next.js API routes)
- **Data Store**: Upstash Redis
- **Messaging**: Redis Pub/Sub (HTTP-based delivery)
- **State Management**: TanStack Query
- **Validation**: Zod

---

## 🧱 Architecture Overview

Client (Browser)
↓ HTTP Requests
Next.js App (API Routes)
↓
Redis (Upstash)
├─ Room metadata
├─ Messages
└─ Pub/Sub broadcast


### Key Points
- No persistent database (no SQL / MongoDB)
- Redis manages **room metadata, messages, and expiration**
- Messages are synced using HTTP requests and cache invalidation
- Designed with **ephemeral data** as a core principle

---

## 🔁 Message Flow

1. User sends a message from the UI
2. Message is sent via an HTTP API request
3. Server publishes the message to Redis
4. Other clients receive updates through refetching
5. Messages exist only while the room is active

---

## ⏳ Room Expiry Logic

- Each room has a fixed TTL (time-to-live)
- Redis automatically removes room data after expiry
- Once expired:
  - Messages are deleted
  - Room becomes inaccessible
  - Users are redirected

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/sr2808/realtime-private-chat-app.git
cd realtime-private-chat-app


2️⃣ Install dependencies
npm install

3️⃣ Configure environment variables

Create a .env.local file:

UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token


You can get these from:
https://upstash.com

4️⃣ Run locally
npm run dev


Open:
http://localhost:3000