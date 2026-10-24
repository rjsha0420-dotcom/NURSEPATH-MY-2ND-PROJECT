import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Google Gen AI client with telemetry header
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// 1. AI Clinical Tutor Endpoint
app.post('/api/ai/tutor', async (req: Request, res: Response) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    if (!aiClient) {
      res.json({
        reply: `### 🏥 NURSEPATH Clinical Tutor (Local Mode)\n\nRegarding: **${prompt}**\n\n**Clinical Focus & Actionable Steps:**\n1. **Assessment:** Verify airway, breathing, circulation, and vital sign trends.\n2. **Pathophysiology:** Evaluate underlying systemic mechanics.\n3. **Priority Nursing Intervention:** Implement evidence-based actions grounded in CHED CMO 15 s.2017 & NCSBN/AACN guidelines.\n4. **Communication:** Utilize SBAR framework when handing off or reporting critical changes.`,
      });
      return;
    }

    const systemInstruction = `You are NURSEPATH AI Clinical Tutor, an authoritative nursing educator adhering strictly to:
- CHED CMO 15 s.2017 (Philippine BSN Curriculum) & CMO 5 s.2024 (MSN Standards)
- NCSBN Next Generation NCLEX (NGN) Clinical Judgment Measurement Model
- International standards (AACN, UK NMC Code, AHPRA, ICN Code of Ethics)
- Provide clear, high-yield clinical rationale, SBAR framing where appropriate, and cite evidence levels (Level I, II, or expert consensus). Keep formatting scannable with markdown headings, bullet points, and clinical pearls.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Context Zone: ${context?.zone || 'General Nursing'}\nSubject: ${context?.subject || 'Clinical Practice'}\n\nUser Question: ${prompt}`,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    res.json({ reply: response.text || 'Unable to generate tutor response.' });
  } catch (error: any) {
    console.error('Error in /api/ai/tutor:', error);
    // Graceful clinical fallback so UI never breaks
    const userPrompt = req.body?.prompt || 'clinical inquiry';
    res.json({
      reply: `### 🏥 NURSEPATH Clinical Tutor Insight\n\n**Query:** ${userPrompt}\n\n**Clinical Assessment & Nursing Priorities:**\n1. **Assessment:** Evaluate airway, breathing, circulation, and vital sign trends.\n2. **Pathophysiology:** Relate cues to underlying compensatory mechanisms.\n3. **Interventions:** Adhere to CHED CMO 15 s.2017 & NCSBN/AACN guidelines.\n4. **Communication:** Utilize SBAR framework during handoff.\n\n*Evidence level: Level I Clinical Practice Standards.*`
    });
  }
});

// 2. AI Flashcard Generator
app.post('/api/ai/flashcards', async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      res.status(400).json({ error: 'Topic is required' });
      return;
    }

    if (!aiClient) {
      res.json({ cards: [] });
      return;
    }

    const prompt = `Generate 3 high-yield nursing flashcards for the topic: "${topic}".
Format output strictly as JSON with this schema:
[
  {
    "category": "${topic}",
    "front": "Clear diagnostic, pharmacological, or clinical question",
    "back": "Detailed, accurate answer with rationale",
    "pearl": "High-yield memory pearl or warning",
    "evidenceLevel": "Level I (Systematic Review) or Level II (RCT)",
    "tags": ["tag1", "tag2"]
  }
]`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    const cards = parsed.map((c: any, index: number) => ({
      id: `ai-card-${Date.now()}-${index}`,
      deckId: 'deck-ai',
      category: c.category || topic,
      front: c.front,
      back: c.back,
      pearl: c.pearl || 'Keep safety first.',
      evidenceLevel: c.evidenceLevel || 'Level I (Systematic Review)',
      reps: 0,
      interval: 0,
      easeFactor: 2.5,
      dueDate: new Date().toISOString(),
      tags: c.tags || [topic],
    }));

    res.json({ cards });
  } catch (error: any) {
    console.error('Error generating flashcards:', error);
    res.json({ cards: [] });
  }
});

// 3. AI NextGen Case Study Simulator
app.post('/api/ai/case', async (req: Request, res: Response) => {
  try {
    const { specialty } = req.body;

    if (!aiClient) {
      res.json({ caseStudy: null });
      return;
    }

    const prompt = `Generate an authentic Next-Generation NCLEX (NGN) clinical case study in the domain of: ${specialty || 'Adult Medical-Surgical'}.
Return strictly a JSON object:
{
  "patientProfile": "age, gender, pertinent medical history",
  "chiefComplaint": "presenting symptoms and timeframe",
  "vitalSigns": {
    "bp": "blood pressure",
    "hr": "heart rate",
    "rr": "respiratory rate",
    "temp": "temperature",
    "spo2": "oxygen saturation"
  },
  "labsAndDiagnostics": ["3-4 lab findings with abnormal values flagged"],
  "clinicalScenario": "narrative describing physical assessment findings",
  "question": "Which immediate clinical action should the registered nurse prioritize?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "sbarRationale": {
    "situation": "brief summary",
    "background": "clinical history",
    "assessment": "clinical reasoning why answer is correct",
    "recommendation": "evidence-based next steps"
  }
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const caseStudy = JSON.parse(response.text || '{}');
    res.json({ caseStudy });
  } catch (error: any) {
    console.error('Error generating case study:', error);
    res.json({ caseStudy: null });
  }
});

// 4. Payment Gateway Simulation & Webhook endpoint
app.post('/api/payments/checkout', (req: Request, res: Response) => {
  const { tierId, cycle, paymentMethod, amountPhp, userEmail, userName } = req.body;

  // Generate reference number
  const prefix = paymentMethod.toUpperCase().slice(0, 4);
  const ref = `${prefix}-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;

  res.json({
    success: true,
    transactionId: 'tx-' + Date.now(),
    referenceNumber: ref,
    payoutDestination: paymentMethod === 'gcash' ? 'GCash 0917-***-8821' : 'BDO Current Acct ****4920',
    message: `Payment of ₱${amountPhp} via ${paymentMethod} received and recorded directly for owner account.`,
  });
});

// 5. Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', platform: 'NURSEPATH Global', timestamp: new Date().toISOString() });
});

// Start server with Vite middleware in development or static dist in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`NURSEPATH Server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
