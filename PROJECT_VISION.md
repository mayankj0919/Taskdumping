# TaskDumping — Project Vision & Features

> **Turn Chaos Into Optimal Sequence.**
> An AI-powered task sequencing and workflow visualization tool that transforms unstructured brain-dumps into interactive, dependency-aware execution graphs.

---

## 🧠 What Is TaskDumping?

TaskDumping is a web application that takes messy, unstructured task lists (a "brain dump") and uses AI to:

1. **Parse** — Extract distinct, actionable tasks from raw text.
2. **Prioritize** — Assign priority levels (high / medium / low) to each task.
3. **Sequence** — Determine the optimal execution order based on logical dependencies.
4. **Visualize** — Render the result as an interactive, draggable node-graph with animated neon edges.

Think of it as a **smart project planner** — you paste in everything swirling around in your head, and it hands back a clear, visual execution roadmap.

---

## 🎨 Design Identity — "Cyber-Glass"

The entire UI follows a **Cyber-Glass** aesthetic:

- **Dark mode** base with deep blacks and subtle blue radial gradients.
- **Glassmorphism** panels — translucent cards with backdrop-blur and soft borders.
- **Neon accent colors** — cyan (`#00f5ff`) and purple (`#a855f7`) throughout.
- **Animated neon edges** — flowing dashed-line connections between nodes with glow effects.
- **Micro-animations** — pulsing dots, gradient text, smooth hover transitions.
- **Monospace terminal** sidebar that narrates the AI's decisions in real-time.

The feel should be: *futuristic command center meets modern project management tool.*

---

## ✅ Current Features (What's Built)

### 1. Brain Dump Input
- Full-screen overlay with a large textarea.
- Placeholder guidance and character counter.
- **Load Demo** button with a pre-written sample brain dump.
- **Ctrl+Enter** keyboard shortcut to submit.

### 2. AI-Powered Task Synthesis
- Backend sends the brain dump to an AI model (currently **Qwen2.5-72B-Instruct** via HuggingFace Inference API).
- AI returns structured JSON: task labels, descriptions, priorities, dependency chains, and reasoning.
- Server-side processing — **no API keys exposed to the frontend**.

### 3. Interactive Node Graph (React Flow)
- Tasks rendered as **draggable, styled nodes** on an infinite canvas.
- **Core node** ("Neural Core") acts as the root orchestrator.
- **Neon animated edges** show dependency connections between tasks.
- Full pan, zoom, and drag support via React Flow.
- Priority-based color coding on each node.

### 4. Node Inspection Panel
- Click any node to open a slide-in detail panel.
- Shows: state, priority, reasoning, and dependency list.
- **Mark Complete** — toggle a task to "complete" state (node visually updates).
- **Deep Dive (Break Down Task)** — AI generates 3 sub-tasks, which are injected as new connected nodes on the graph.

### 5. Data Export
- **Export PNG** — captures the current graph as a high-res PNG image.
- **Copy Markdown** — generates a Markdown checklist of all tasks with priorities and completion state, copied to clipboard.

### 6. Execute All
- Simulates sequential task execution with animated state transitions.
- Each node flips to "complete" one by one with terminal narration.

### 7. Terminal Sidebar
- Retro-styled terminal log panel.
- Narrates the AI's sequencing decisions as they happen.
- Logs task completions, deep dives, and execution progress.

### 8. Toast Notifications
- Contextual success/error toasts for all user actions.
- Auto-dismiss with smooth fade animations.

### 9. Processing Overlay
- Animated transition screen while the AI processes the input.
- Provides visual feedback so the user knows work is happening.

---

## 🏗️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 19 + Vite 8                   |
| Graph       | @xyflow/react (React Flow)          |
| Styling     | Vanilla CSS (Cyber-Glass system)    |
| Image Export| html-to-image                       |
| Backend     | Node.js + Express                   |
| AI Model    | Qwen2.5-72B-Instruct (HuggingFace) |
| API Style   | REST (JSON)                         |

### Architecture

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
│  └── HuggingFace Inference API (Qwen 72B)   │
│      └── OpenAI-compatible chat completions  │
└──────────────────────────────────────────────┘
```

---

## 🚀 Vision & Future Roadmap

### Phase 1 — Core Polish (Near-term)
- [ ] **Persist workflows** — Save/load flows to localStorage or a database.
- [ ] **Undo/Redo** — Step back through graph modifications.
- [ ] **Manual node creation** — Let users add custom nodes without AI.
- [ ] **Edge editing** — Drag to connect/disconnect dependencies manually.
- [ ] **Node color themes** — Let users customize the visual style per node.

### Phase 2 — Collaboration & Intelligence (Mid-term)
- [ ] **Real-time collaboration** — Multiple users editing the same flow (WebSocket-based).
- [ ] **Time estimates** — AI suggests time estimates for each task.
- [ ] **Critical path highlighting** — Visually mark the longest dependency chain.
- [ ] **Progress dashboard** — Summary stats: % complete, blocked tasks, time remaining.
- [ ] **Task assignment** — Assign tasks to team members with avatars on nodes.
- [ ] **Smart re-sequencing** — When a task is marked complete or removed, AI re-optimizes the remaining flow.

### Phase 3 — Integrations & Scale (Long-term)
- [ ] **Import from tools** — Pull tasks from Jira, Trello, Notion, Linear, GitHub Issues.
- [ ] **Export to tools** — Push the generated sequence back into project management platforms.
- [ ] **Gantt chart view** — Alternative timeline visualization alongside the node graph.
- [ ] **Template library** — Pre-built workflow templates (product launch, sprint planning, etc.).
- [ ] **Self-hosted AI** — Option to run a local model instead of relying on cloud APIs.
- [ ] **Authentication & teams** — User accounts, team workspaces, permissions.
- [ ] **Mobile-responsive** — Touch-friendly graph interactions for tablets.

### Phase 4 — Intelligence Layer (Aspirational)
- [ ] **Learning from completions** — AI learns from your patterns to give better suggestions.
- [ ] **Risk detection** — Flag tasks with ambiguous scope or missing dependencies.
- [ ] **Auto-estimation** — Based on task complexity and historical data.
- [ ] **Natural language queries** — "What should I work on next?" answered from the graph state.

---

## 🎯 Core Principles

1. **Zero-friction input** — Paste raw text, get a structured plan. No forms, no templates.
2. **Visual-first** — The graph IS the interface. Every decision is spatial and interactive.
3. **AI as copilot, not autopilot** — AI suggests; the user controls, edits, and decides.
4. **Beautiful by default** — The Cyber-Glass aesthetic isn't decoration — it makes information scannable and the tool enjoyable to use.
5. **Privacy-first architecture** — API keys live on the server. The frontend never touches external APIs directly.

---

*TaskDumping — because your brain works in graphs, not spreadsheets.*
