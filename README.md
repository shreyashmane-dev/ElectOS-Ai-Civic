# ElectOS

ElectOS is a production-oriented full-stack civic web application built with Next.js, Firestore, and Google Vertex AI. It provides:

- AI civic guidance
- Misinformation review
- Civic readiness scoring
- Scenario planning
- Structured API responses for frontend card rendering

## Stack

- Next.js App Router with TypeScript
- Next.js route handlers for backend APIs
- Google Vertex AI Gemini integration
- Google Cloud Firestore persistence
- Mock email/password auth for local and deployment-safe onboarding
- Dockerized Cloud Run deployment target

## Environment

Copy `.env.example` to `.env.local` and provide:

```bash
PROJECT_ID=
LOCATION=
GEMINI_MODEL=gemini-1.5-flash
GOOGLE_APPLICATION_CREDENTIALS=
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
```

## API Endpoints

- `POST /api/ai/query`
- `POST /api/user/profile`
- `GET /api/user/profile?id=<id>`
- `POST /api/readiness`
- `POST /api/misinfo`

## Run

```bash
npm install
npm run dev
```

## Cloud Run

```bash
docker build -t electos .
docker run -p 8080:8080 electos
```
