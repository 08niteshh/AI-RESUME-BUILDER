# AI Resume Builder

https://ai-resume-builder-production-c7a9.up.railway.app  

You may click on this and check my website 

A full-stack AI Resume Builder built with React, Vite, Tailwind CSS, Node.js, Express, and the Claude API.

## Features

- React form for profile details and job description
- Express API endpoint at `POST /api/generate-resume`
- Claude model: `claude-sonnet-4-20250514`
- Clean HTML resume output
- Match score and keyword highlights
- Dark/light mode
- PDF download with browser print

## Project Structure

```txt
client/
  React + Vite + Tailwind frontend
server/
  Express backend
  routes/resume.js
  controllers/resumeController.js
```

## Setup

Install dependencies:

```bash
cd server
npm install

cd ../client
npm install
```

Create the server environment file:

```bash
cd ../server
cp .env.example .env
```

Add your Anthropic API key to `server/.env`:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=5001
CLIENT_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```

Optional client env:

```bash
cd ../client
cp .env.example .env
```

## Run Locally

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Open:

```txt
http://localhost:5173
```

The backend runs at:

```txt
http://localhost:5001
```

## GitHub Notes

Do not commit `.env`, `node_modules`, or `dist`. The included `.gitignore` already excludes them.
