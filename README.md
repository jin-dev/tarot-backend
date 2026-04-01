# Tarot Backend API - Progress Report

## 🛠️ Tech Stack & Environment

- **Runtime:** Node.js
- **Language:** TypeScript
- **Module System:** ECMAScript Modules (ESM)
- **Framework:** Express.js (Routing architecture)

## ⚙️ Core Configuration

The project is configured to use modern standard ESM alongside strict TypeScript compilation rules.

### Proejct structure

tarot-backend/
├── package.json # Project metadata, scripts, and dependencies
├── tsconfig.json # TypeScript compiler settings (ESM configured)
└── src/
├── app.ts # Main entry point: setups Express, middleware, and registers routes
├── routes/ # API Endpoints
│ └── tarot.routes.ts # Maps URL paths (e.g., GET /api/tarot) to controller functions
└── controllers/ # Business Logic
└── tarot.controller.ts # Handles the actual logic (e.g., drawing a card, formatting the response)

## 🏛️ Architecture: Why Firebase + Proxy/Gateway + AI API?

In this project, we utilize a unified architecture combining **Firebase**, an **API Gateway/Proxy**, and an **AI API** (like OpenAI or Gemini). Rather than calling the AI directly from the frontend or relying solely on Firebase's client-side SDKs, we route our traffic through a centralized backend proxy.

Here is why this approach is critical for a production-ready application:

### 1. 🔒 Security & API Key Protection

Never expose AI API keys on the client side. If the frontend calls the AI API directly, malicious users can extract your secret keys from the network tab and use them at your expense.

- **The Solution:** The client sends a request to our Proxy/Gateway. The Gateway safely injects the secret API keys environment variables and forwards the request to the AI service. The client never sees the keys.

### 2. 💸 Cost Control & Rate Limiting

AI API calls are expensive and computationally heavy. Without a middleman, a user (or a bot) could spam your frontend and rack up massive API bills.

- **The Solution:** The API Gateway acts as a bouncer. We can implement strict rate limiting (e.g., 5 requests per minute per user), caching for common questions, and request validation _before_ the expensive AI API is ever triggered.

### 3. 🚦 Centralized Authentication

While Firebase handles user authentication seamlessly on the frontend, we need to ensure that only logged-in, authorized users can access the AI features.

- **The Solution:** The Proxy intercepts incoming requests, verifies the user's Firebase ID Token, and checks their permissions. If the token is invalid or expired, the Gateway rejects the request immediately, protecting the backend.

### 4. 🧩 Decoupling & Future-Proofing

Tying your frontend directly to a specific AI provider's SDK makes it hard to change later.

- **The Solution:** The API Gateway abstracts the underlying services. If we decide to switch from OpenAI to Gemini, or add a custom machine learning model later, we only need to update the Gateway logic. The frontend code remains completely untouched because it only knows how to talk to our unified Proxy.

---

### 🔄 The Request Flow

1. **Client (Frontend):** Authenticates via Firebase and sends a request to the Gateway.
2. **API Gateway / Proxy:** Receives the request, verifies the Firebase Auth token, applies rate limiting, and attaches the hidden API keys.
3. **AI API:** Processes the secure request and returns the generated data.
4. **API Gateway:** Formats the AI's response and sends it back to the client.
