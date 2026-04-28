import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

async function callAI(messages, temperature = 0.3, maxTokens = 2000) {
  const groqPayload = {
    model: 'llama-3.3-70b-versatile',
    messages,
    temperature,
    max_tokens: maxTokens
  };

  const ollamaPayload = {
    model: 'llama3.1:8b',
    messages,
    temperature,
    max_tokens: maxTokens
  };

  const attemptRequest = async (url, payload, headers, provider) => {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });

        if (response.status === 503 || response.status === 429) {
          const delay = attempt * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return { content: data.choices[0].message.content, provider };
      } catch (err) {
        if (attempt === 3) throw err;
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    }
  };

  if (GROQ_API_KEY) {
    try {
      return await attemptRequest(
        'https://api.groq.com/openai/v1/chat/completions',
        groqPayload,
        {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        'groq'
      );
    } catch (err) {
      console.error('Groq failed, falling back to Ollama:', err.message);
    }
  }

  return await attemptRequest(
    `${OLLAMA_URL}/v1/chat/completions`,
    ollamaPayload,
    { 'Content-Type': 'application/json' },
    'ollama'
  );
}

function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {}
  }
  return null;
}

app.get('/api/health', async (req, res) => {
  let provider = 'none';

  if (GROQ_API_KEY) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
      });
      if (response.ok) {
        provider = 'groq';
        return res.json({ provider, status: 'ok' });
      }
    } catch {}
  }

  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    if (response.ok) {
      provider = 'ollama';
      return res.json({ provider, status: 'ok' });
    }
  } catch {}

  res.json({ provider, status: 'degraded' });
});

app.post('/api/synthesize', async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim().length < 5) {
    return res.status(400).json({ error: 'Text too short' });
  }

  const systemPrompt = `You are a project management AI. Analyze the brain-dump and produce a structured execution workflow.
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
Rules: max 12 tasks, sequential IDs, deps[] = blocking task IDs, ordered by execution sequence.`;

  try {
    const result = await callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text }
    ]);

    const json = extractJSON(result.content);
    if (!json || !json.tasks) {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    res.json({ tasks: json.tasks, provider: result.provider });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subtasks', async (req, res) => {
  const { taskLabel, taskDesc } = req.body;
  if (!taskLabel) {
    return res.status(400).json({ error: 'taskLabel required' });
  }

  const systemPrompt = `You are a project management AI. Break down a task into 3-4 subtasks.
Return ONLY a valid JSON object with shape:
{
  "subtasks": [{
    "id": "subtask-0",
    "label": "Short name (max 6 words)",
    "desc": "One sentence description.",
    "priority": "high|medium|low",
    "reason": "Why this subtask matters."
  }]
}`;

  try {
    const result = await callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Task: ${taskLabel}\nDescription: ${taskDesc || 'No description'}` }
    ]);

    const json = extractJSON(result.content);
    if (!json || !json.subtasks) {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    res.json({ subtasks: json.subtasks, provider: result.provider });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});