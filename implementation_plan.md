# TaskDumping — Full Rebuild Implementation Plan

Build a complete, production-quality AI-powered task sequencing app from scratch in `d:\Projects\taskdumping\Taskdumping\`. The PROJECT_VISION.md in that directory defines exactly what the app does and how it should look/behave.

---

## AI Model Decision: Build vs Borrow

> [!IMPORTANT]
> **Recommendation: Use open-source models via API — do NOT train a custom model.**

### Why NOT train your own model:
- TaskDumping's core AI task is **structured extraction + dependency analysis** from natural language — this is a standard NLP capability that all modern instruction-tuned LLMs handle extremely well.
- Training a custom model requires massive datasets of "brain dump → structured task JSON" pairs. You'd need to create/annotate thousands of examples — months of work for marginal gain.
- Fine-tuning an existing model (e.g., LoRA on Llama) is possible but still overkill — the prompting approach with a good base model already produces excellent results.
- Maintenance burden: you'd need to host, serve, and update a custom model indefinitely.

### Recommended approach — Dual provider with fallback:

| Provider | Model | Use Case | Cost |
|---|---|---|---|
| **Primary: Groq API** | `llama-3.3-70b-versatile` | Cloud inference, extremely fast (~500 tok/s) | Free tier: 30 RPM, ~1000 RPD |
| **Fallback: Ollama (local)** | `llama3.1:8b` or `phi4` | Works offline, no rate limits, runs on user's GPU | Completely free |

**Why this combo:**
- **Groq** is blazing fast (LPU inference), has a generous free tier, uses an OpenAI-compatible API (easy to integrate), and hosts top-quality open-source models.
- **Ollama** as fallback means the app works even with no internet / no API key. Users with decent GPUs get instant, unlimited inference.
- Both use the same OpenAI-compatible chat completions format — the backend can swap between them with just a URL change.

> [!NOTE]
> The user should sign up for a free Groq API key at https://console.groq.com. Set it as `GROQ_API_KEY` in `.env`. If no key is provided, the app falls back to Ollama (if running locally).

---

## Open Questions

> [!IMPORTANT]
> 1. **Groq vs HuggingFace** — The plan uses Groq as primary because it's significantly faster and more reliable on free tier than HuggingFace Inference API. Are you OK with this, or do you want to stick with HuggingFace?
> 2. **Ollama fallback** — Do you want the Ollama local fallback, or is cloud-only fine? (Ollama requires the user to have it installed separately.)
> 3. **Phase 1 scope** — The plan below implements all 9 core features from PROJECT_VISION.md plus persistence (localStorage). Should we include anything from Phase 2 (collaboration, time estimates, etc.) in this initial build?

---

## Proposed Changes

The entire project is built from scratch. Directory structure:

```
d:\Projects\taskdumping\Taskdumping\
├── PROJECT_VISION.md              (existing — project spec)
├── .env                           [NEW] — API keys
├── .gitignore                     [NEW]
├── package.json                   [NEW] — backend deps
├── server.js                      [NEW] — Express backend
├── client/                        [NEW] — React frontend (Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                — phase router (idle → processing → workflow)
│       ├── App.css                — global Cyber-Glass design system
│       ├── api.js                 — fetch wrapper for /api/* endpoints
│       ├── components/
│       │   ├── BrainDumpOverlay.jsx/.css   — input screen
│       │   ├── ProcessingOverlay.jsx/.css  — loading animation
│       │   ├── WorkflowCanvas.jsx/.css     — React Flow container
│       │   ├── TopBar.jsx/.css             — actions bar
│       │   ├── InspectPanel.jsx/.css       — node detail panel
│       │   ├── Sidebar.jsx/.css            — terminal log
│       │   └── Toast.jsx/.css              — notification system
│       ├── nodes/
│       │   ├── CoreNode.jsx/.css           — root orchestrator node
│       │   └── TaskNode.jsx/.css           — task card node
│       ├── edges/
│       │   └── NeonEdge.jsx/.css           — animated neon edge
│       └── hooks/
│           └── useTerminalLog.js           — terminal log state
```

---

### Backend — Express Server

#### [NEW] `.env`
```env
GROQ_API_KEY=gsk_your_key_here
OLLAMA_URL=http://localhost:11434
PORT=3000
```

#### [NEW] `.gitignore`
Standard Node.js gitignore: `node_modules/`, `.env`, `dist/`, etc.

#### [NEW] `package.json`
Dependencies: `express`, `cors`, `dotenv`
Scripts: `start` → `node server.js`, `dev` → `node --watch server.js`

#### [NEW] `server.js`
The backend Express server with:

**AI Provider abstraction:**
- `callAI(messages, temperature, maxTokens)` function that:
  1. Tries **Groq** first (`https://api.groq.com/openai/v1/chat/completions`) with model `llama-3.3-70b-versatile`
  2. Falls back to **Ollama** (`http://localhost:11434/v1/chat/completions`) with model `llama3.1:8b`
  3. Both use OpenAI-compatible format — same request shape
  4. Retry logic: 3 attempts with backoff for 503/429 errors
  5. JSON extraction: strip markdown fences, regex-match `{...}`, validate

**Endpoints:**
- `POST /api/synthesize` — Takes `{ text }`, sends to AI with the task-extraction system prompt, returns `{ tasks: [...] }`
- `POST /api/subtasks` — Takes `{ taskLabel, taskDesc }`, sends to AI with the sub-task prompt, returns `{ subtasks: [...] }`
- `GET /api/health` — Returns provider status (which AI is available)

**System prompt for synthesis:**
```
You are a project management AI. Analyze the brain-dump and produce a structured execution workflow.
Return ONLY a valid JSON object with shape:
{
  "tasks": [{
    "id": "task-0",
    "label": "Short name (max 6 words)",
    "desc": "One sentence description.",
    "priority": "high|medium|low",
    "deps": ["task-id", ...],
    "reason": "Why this task is positioned here."
  }]
}
Rules: max 12 tasks, sequential IDs, deps[] = blocking task IDs, ordered by execution sequence.
```

---

### Frontend — React + Vite

#### [NEW] `client/package.json`
Dependencies: `react`, `react-dom`, `@xyflow/react`, `html-to-image`
Dev dependencies: `vite`, `@vitejs/plugin-react`

#### [NEW] `client/vite.config.js`
- React plugin
- Dev server on port 5173
- Proxy `/api` → `http://localhost:3000`

#### [NEW] `client/index.html`
- Title: "TaskDumping — AI Task Sequencer"
- Google Fonts: Inter (body) + JetBrains Mono (terminal)
- Meta tags for SEO

#### [NEW] `client/src/main.jsx`
Standard React entry point, renders `<App />`

---

### Design System — Cyber-Glass CSS

#### [NEW] `client/src/App.css`
The complete Cyber-Glass design system:

**CSS Custom Properties:**
```css
:root {
  --bg-deep: #000000;
  --bg-surface: rgba(10, 15, 30, 0.85);
  --glass: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
  --cyan: #00f5ff;
  --purple: #a855f7;
  --green: #00ff9d;
  --red: #ff4444;
  --text-primary: #e0e0e0;
  --text-muted: rgba(255, 255, 255, 0.4);
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --radius: 12px;
  --blur: 16px;
}
```

**Global styles:**
- Dark background with radial gradient (deep blue center)
- Glass card mixin: `backdrop-filter: blur(var(--blur))`, translucent bg, subtle border
- Button variants: `.btn-primary` (gradient cyan→purple), `.btn-ghost` (glass outline)
- Animations: `@keyframes pulse-cyan`, `pulse-purple`, `float`, `fade-in`, `slide-up`
- Typography: Inter for body, JetBrains Mono for code/terminal

---

### Components

#### [NEW] `client/src/App.jsx`
Phase-based state machine:
- **idle** → shows `<BrainDumpOverlay>`
- **processing** → shows `<ProcessingOverlay>`, fires API call
- **workflow** → shows full UI: `<TopBar>`, `<WorkflowCanvas>`, `<Sidebar>`, `<InspectPanel>`

Key logic:
- `buildFlowData(tasks)` → converts AI response to React Flow nodes/edges with grid layout
- `handleSynthesize(text)` → starts API call + transitions to processing
- `handleProcessingComplete()` → receives AI result, builds graph, transitions to workflow
- `handleNodeClick(node)` → opens inspect panel
- `handleMarkComplete(nodeId)` → toggles node state
- `handleDeepDive(parentId, subtasks)` → injects sub-task nodes connected to parent
- `handleExecuteAll()` → sequential animated completion of all tasks
- `handleReset()` → returns to idle phase

#### [NEW] `client/src/api.js`
- `synthesize(text)` → `POST /api/synthesize`
- `getSubtasks(label, desc)` → `POST /api/subtasks`
- Error handling with descriptive messages

#### [NEW] `client/src/components/BrainDumpOverlay.jsx` + `.css`
Full-screen input overlay:
- TaskDumping logo (SVG — eye/neural motif with cyan+purple gradient)
- Headline: "Turn Chaos Into Optimal Sequence" with gradient text
- Large glass-bordered textarea with placeholder, char counter, `Ctrl+Enter` hint
- "Load Demo" button (pre-fills sample brain dump) + "Run Neural Synthesis" primary button
- Subtle floating animation on the logo

#### [NEW] `client/src/components/ProcessingOverlay.jsx` + `.css`
Loading screen shown during AI processing:
- Centered animated neural/circuit pattern
- Progress text: "Analyzing dependencies...", "Building execution graph...", etc.
- Runs for minimum 3 seconds (gives animation time), then transitions when API resolves
- Glowing pulse animation

#### [NEW] `client/src/components/WorkflowCanvas.jsx` + `.css`
React Flow container:
- Custom node types registered: `core` → `CoreNode`, `task` → `TaskNode`
- Custom edge type: `neon` → `NeonEdge`
- Dark background with dot grid pattern
- Full interactivity: pan, zoom, drag nodes
- Fit-to-view on initial render
- Click handler → opens InspectPanel

#### [NEW] `client/src/components/TopBar.jsx` + `.css`
Glass toolbar at the top:
- Left: TaskDumping logo (small)
- Center: status badge ("Neural Core Online" with pulsing dot)
- Right actions: Export PNG, Copy Markdown, Execute All, New Flow, Toggle Terminal
- Export PNG: uses `html-to-image` to capture the React Flow viewport
- Copy Markdown: generates `# TaskDumping — Task Sequence` with checkboxes, priorities, descriptions

#### [NEW] `client/src/components/InspectPanel.jsx` + `.css`
Slide-in panel on node click:
- Displays: label, state (with color dot), priority, reasoning, dependency list
- "Mark Complete" button → toggles state
- "Break Down Task" button → calls `/api/subtasks`, triggers deep dive

#### [NEW] `client/src/components/Sidebar.jsx` + `.css`
Terminal log panel (right side):
- Monospace font, dark glass background
- Auto-scrolls to bottom
- Color-coded entries: system (purple), info (cyan), success (green), warn (yellow), muted (dim)
- Close button

#### [NEW] `client/src/components/Toast.jsx` + `.css`
Floating notification:
- Success (green border) / Error (red border) variants
- Auto-dismiss after 4 seconds with fade-out
- Stacks multiple toasts

#### [NEW] `client/src/nodes/CoreNode.jsx` + `.css`
The root "Neural Core" node:
- Purple-gradient glass card
- Neural/eye icon
- Label: "Neural Core"
- Source handle only (no target — it's the root)

#### [NEW] `client/src/nodes/TaskNode.jsx` + `.css`
Individual task card node:
- Glass card with priority-colored left border (high=red, medium=yellow, low=green)
- Shows: index number, label, description, status badge, priority badge
- State-based styling: pending (cyan glow), complete (green glow, checkmark)
- Both source and target handles for edge connections

#### [NEW] `client/src/edges/NeonEdge.jsx` + `.css`
Animated edge between nodes:
- SVG path with neon glow (`filter: drop-shadow`)
- Animated dashed stroke (`stroke-dasharray` + `stroke-dashoffset` animation)
- Color passed via `data.color` (cyan for deps, purple for core connections)

#### [NEW] `client/src/hooks/useTerminalLog.js`
Custom hook for terminal state:
- `entries[]` — array of `{ id, text, type, timestamp }`
- `addLog(text, type)` — appends entry
- `clearLog()` — resets

---

## Verification Plan

### Automated Tests
1. **Backend health check:**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Should return `{ "provider": "groq" | "ollama", "status": "ok" }`

2. **Synthesize endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/synthesize \
     -H "Content-Type: application/json" \
     -d '{"text": "Design logo, set up database, write tests, deploy"}'
   ```
   Should return `{ "tasks": [...] }` with valid structure

3. **Frontend builds:**
   ```bash
   cd client && npm run build
   ```
   Should succeed with no errors

### Manual / Browser Verification
1. Open `http://localhost:5173` — should see the BrainDumpOverlay with Cyber-Glass styling
2. Load demo text → click "Run Neural Synthesis" → should transition through ProcessingOverlay → WorkflowCanvas with nodes
3. Click a node → InspectPanel should slide in with details
4. "Break Down Task" → should generate and render sub-task nodes
5. "Export PNG" → should download an image
6. "Copy Markdown" → should copy checklist to clipboard
7. "Execute All" → should animate node completions sequentially
8. Terminal sidebar should narrate all actions

---

## How to Run (for reference)

```bash
# Terminal 1 — Backend
cd d:\Projects\taskdumping\Taskdumping
npm install
node server.js

# Terminal 2 — Frontend
cd d:\Projects\taskdumping\Taskdumping\client
npm install
npm run dev

# Open http://localhost:5173
```
