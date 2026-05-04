# 🧠 TaskDumping

> **Turn Chaos Into Optimal Sequence.**

An AI-powered task sequencing and workflow visualization tool that transforms unstructured brain-dumps into interactive, dependency-aware execution graphs.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ What Does It Do?

Paste in everything swirling around in your head — TaskDumping uses AI to:

1. **Parse** — Extract distinct, actionable tasks from raw text.
2. **Prioritize** — Assign priority levels (high / medium / low) to each task.
3. **Sequence** — Determine the optimal execution order based on logical dependencies.
4. **Visualize** — Render the result as an interactive, draggable node-graph with animated neon edges.

Think of it as a **smart project planner** — you dump your brain, and it hands back a clear, visual execution roadmap.

---

## 🎨 Cyber-Glass UI

The interface follows a **Cyber-Glass** design language:

- Dark mode base with deep blacks and subtle blue radial gradients
- Glassmorphism panels with backdrop-blur and soft borders
- Neon accent colors — cyan (`#00f5ff`) and purple (`#a855f7`)
- Animated neon edges flowing between dependency nodes
- Retro terminal sidebar narrating the AI's decisions in real-time
- Micro-animations: pulsing dots, gradient text, smooth hover transitions

---

## 🏗️ Tech Stack

| Layer        | Technology                                  |
| ------------ | ------------------------------------------- |
| Frontend     | React 19 + Vite 6                           |
| Graph Engine | @xyflow/react (React Flow)                  |
| Styling      | Vanilla CSS (Cyber-Glass design system)     |
| Image Export | html-to-image                               |
| Backend      | Node.js + Express                           |
| AI Provider  | Groq (LLaMA 3.3 70B) / Ollama (LLaMA 3.1 8B) |
| API Style    | REST (JSON)                                 |

---

## 📐 Architecture

```
┌──────────────────────────────────────────────┐
│  Frontend (Vite @ :5173)                     │
│  React + React Flow                          │
│  ├── BrainDumpOverlay  (input phase)         │
│  ├── ProcessingOverlay (loading phase)       │
│  ├── WorkflowCanvas    (graph phase)         │
│  ├── TopBar            (actions & export)    │
│  ├── InspectPanel      (node details)        │
│  ├── Sidebar           (terminal log)        │
│  └── api.js            (fetch wrapper)       │
│                                              │
│  Proxied via Vite:  /api → localhost:3000    │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│  Backend (Express @ :3000)                   │
│  ├── POST /api/synthesize  (brain dump → AI) │
│  ├── POST /api/subtasks    (deep dive → AI)  │
│  ├── GET  /api/health      (status check)    │
│  └── Groq API / Ollama (local fallback)      │
└──────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **Groq API key** ([get one free](https://console.groq.com)) _or_ a local [Ollama](https://ollama.com) instance

### 1. Clone the repo

```bash
git clone https://github.com/your-username/taskdumping.git
cd taskdumping
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
OLLAMA_URL=http://localhost:11434   # optional — fallback if Groq is unavailable
PORT=3000
```

### 3. Install dependencies

```bash
# Server dependencies
npm install

# Client dependencies
cd client
npm install
cd ..
```

### 4. Run in development mode

Start both the backend and frontend:

```bash
# Terminal 1 — Backend
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

The frontend will be available at **http://localhost:5173** and the backend at **http://localhost:3000**.

---

## 📡 API Endpoints

### `GET /api/health`

Returns the current AI provider status.

**Response:**

```json
{ "provider": "groq", "status": "ok" }
```

---

### `POST /api/synthesize`

Converts a brain-dump into a structured task workflow.

**Request:**

```json
{ "text": "I need to build a landing page, set up CI/CD, write tests..." }
```

**Response:**

```json
{
  "tasks": [
    {
      "id": "task-0",
      "label": "Set up project scaffold",
      "desc": "Initialize the repository with build tooling.",
      "priority": "high",
      "deps": [],
      "reason": "Foundation for all other tasks."
    }
  ],
  "provider": "groq"
}
```

---

### `POST /api/subtasks`

Breaks a task down into 3–4 actionable subtasks (Deep Dive).

**Request:**

```json
{ "taskLabel": "Set up CI/CD", "taskDesc": "Configure automated pipelines." }
```

**Response:**

```json
{
  "subtasks": [
    {
      "id": "subtask-0",
      "label": "Choose CI provider",
      "desc": "Evaluate GitHub Actions vs CircleCI.",
      "priority": "high",
      "reason": "Determines pipeline configuration."
    }
  ],
  "provider": "groq"
}
```

---

## 📂 Project Structure

```
taskdumping/
├── server.js              # Express backend (AI proxy)
├── package.json           # Server dependencies
├── .env                   # API keys (not committed)
├── .gitignore
├── PROJECT_VISION.md      # Full vision & roadmap
│
└── client/                # React frontend
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx       # Entry point
        ├── App.jsx        # Root component & state
        ├── App.css        # Global styles
        ├── api.js         # Backend fetch wrapper
        ├── components/    # UI components (TopBar, Sidebar, Overlays, etc.)
        ├── nodes/         # Custom React Flow node types
        ├── edges/         # Custom React Flow edge types
        └── hooks/         # Custom React hooks
```

---

## ✅ Features

- **Brain Dump Input** — Full-screen overlay with demo data and Ctrl+Enter shortcut
- **AI Task Synthesis** — Structured workflow generation via LLM
- **Interactive Node Graph** — Draggable, zoomable, pannable canvas
- **Priority Color Coding** — Visual distinction for high/medium/low tasks
- **Node Inspection** — Slide-in panel with task details and state management
- **Deep Dive** — AI-generated subtasks injected as connected child nodes
- **Execute All** — Simulated sequential execution with animated transitions
- **Export PNG** — High-res screenshot of the current graph
- **Copy Markdown** — Clipboard-ready checklist with priorities and status
- **Terminal Sidebar** — Real-time narration of AI decisions
- **Toast Notifications** — Contextual feedback for all user actions
- **AI Fallback** — Automatic Groq → Ollama failover with retry logic

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

<p align="center">
  <em>TaskDumping — because your brain works in graphs, not spreadsheets.</em>
</p>
