# Agility Wiki Chatbot

Agility Wiki Chatbot is an internal AI assistant designed to help employees quickly retrieve company information using natural language.

The system uses a **Retrieval-Augmented Generation (RAG)** architecture to combine internal company data with **OpenAI models** to generate accurate responses.

---

# Architecture Overview

The system follows a **RAG (Retrieval-Augmented Generation)** pipeline.

```
User Question
      ↓
Embedding (OpenAI)
      ↓
Vector Search (Pinecone)
      ↓
Retrieve Context
      ↓
Prompt + Context
      ↓
LLM (GPT-4o)
      ↓
Final Answer
```

---

# Technical Stack

### Frontend

* Next.js (App Router)
* TypeScript
* React
* TailwindCSS

### Backend

* Node.js
* NestJS
* Prisma ORM

### AI / LLM

* OpenAI API (GPT-4o)
* OpenAI Embeddings

### Vector Database

* Pinecone

### Database

* PostgreSQL

### Deployment

* Frontend: Vercel
* Backend: Railway / Render

---

# Core Features

### Authentication

* Email & password login
* Password hashing (bcrypt)
* JWT authentication
* Protected chat API

### Chat System

* AI-powered chatbot
* Natural language questions
* Context-based responses
* Streaming responses
* Typing indicator

### Smart Question Suggestions

Example prompts:

* Who is responsible for IT support?
* Who is in the HR team?
* My laptop is broken, who should I contact?
* Who is [Employee Name]?

### RAG System

The chatbot retrieves relevant internal data before generating answers.

Capabilities include:

* Semantic similarity search
* Context injection
* Grounded response generation
* Hallucination prevention rules

### Human In The Loop (HITL)

If the system cannot find a reliable answer:

* The chatbot suggests contacting a human
* Queries are logged for manual review
* Optional escalation to HR / IT contact

### Cancel Action

Users can cancel response generation while the model is generating a reply.

---

# Running the Application

## 1. Clone the Repository

```
git clone git@gitlab.asoft-python.com:nhan.tran/ai-sdk-training.git
cd agility-wiki
```

---

# Backend Setup

Navigate to backend folder:

```
cd backend
```

Install dependencies:

```
pnpm install
```

Create `.env` file:

```
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
JWT_SECRET=your_secret
```

Run database migration:

```
npx prisma migrate dev
```

---

# Data Ingestion

Before using the chatbot, employee data must be imported and embedded into the vector database.

### Import Employee Data

```
npx ts-node scripts/ingest-employees.ts
```

### Generate Embeddings

```
npx ts-node scripts/embed-employees.ts
```

These scripts:

* Load employee data into PostgreSQL
* Generate embeddings using OpenAI
* Store vectors in Pinecone

---

# Start Backend

```
npm run start:dev
```

Backend will run at:

```
http://localhost:3000
```

---

# Frontend Setup

Navigate to frontend folder:

```
cd frontend
```

Install dependencies:

```
pnpm install
```

Start development server:

```
 npm run dev -- -p 4000
```

Open the application:

```
http://localhost:4000
```

---

# Database Management (Optional)

You can inspect the database using **Prisma Studio**.

```
npx prisma studio
```

Prisma Studio will open at:

```
http://localhost:5555
```

This allows you to:

* View employee records
* Inspect user accounts
* Debug database entries
* Verify ingested data

---

# Example Questions

Users can ask questions such as:

* Who is John Smith?
* Who is responsible for IT support?
* Who works in the HR department?
* My laptop is broken, who should I contact?

---

# Future Improvements

Possible improvements for the system:

* Conversation memory
* Admin dashboard for knowledge management
* Dynamic document ingestion
* Improved vector search ranking
* Analytics dashboard
