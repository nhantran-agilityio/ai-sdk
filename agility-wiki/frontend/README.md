# Agility Wiki Assistant

An AI-powered assistant that helps users query information from the **Agility Wiki** using natural language.

The application uses **OpenAI models with a Retrieval-Augmented Generation (RAG)** approach to retrieve relevant data and generate answers.

Users must provide their own **OpenAI API key** to test the application.

---

# Features

* AI chatbot interface
* Query Agility Wiki using natural language
* Retrieval-Augmented Generation (RAG)
* Uses user's own OpenAI API key (no server-side key required)
* Suggestion prompts for quick questions
* Streaming-ready architecture

---

# Tech Stack

Frontend:

* Next.js (App Router)
* TypeScript
* TailwindCSS
* React Context

Backend:

* NestJS
* Prisma
* PostgreSQL
* OpenAI API

AI:

* GPT models
* Vector search fallback
* Query planning + structured search

---

# Project Structure

```
frontend/
  app/
  components/
  providers/
  services/

backend/
  src/
    chat/
    rag/
    prisma/
```

---

# Getting Started

## 1. Clone the repository

```
git clone <repo-url>
cd agility-wiki-assistant
```

---

# Frontend Setup

```
cd frontend
npm install
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

# Backend Setup

```
cd backend
npm install
npm run start:dev
```

The backend will run on:

```
http://localhost:3001
```

---

# Using the App

1. Open the application in your browser.
2. Enter your **OpenAI API Key** when prompted.
3. Ask questions related to the Agility Wiki.

Example prompts:

* Who is the head of engineering?
* Which team handles payroll?
* Who manages the Athena project?
* List employees in the product team.

---

# API Key Requirement

This project **does not include an OpenAI API key**.

Each tester must provide their own key.

You can create one here:

https://platform.openai.com/api-keys

The key is stored locally in the browser (`localStorage`) and is **never stored on the server**.

---

# Environment Variables (Backend)

Create a `.env` file inside the backend folder:

```
DATABASE_URL=postgresql://user:password@localhost:5432/agility
```

---

# Development Notes

The system uses a **RAG pipeline**:

1. AI analyzes the question
2. Generates a structured query plan
3. Queries the database using Prisma
4. Falls back to vector search if needed
5. Generates a final answer with context

---

# Deployment

Frontend can be deployed using:

* Vercel
* Netlify
* Docker

Backend can be deployed using:

* Railway
* Render
* Fly.io
* AWS

---

# Future Improvements

* Streaming responses
* Better vector search ranking
* Admin interface for Wiki ingestion
* Conversation memory
* Key management UI

---

# License

MIT License
