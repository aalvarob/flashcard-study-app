import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());

// In-memory storage for flashcards
let flashcards: any[] = [];
let nextId = 1;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all flashcards
app.get('/api/flashcards', (req, res) => {
  console.log(`[API] GET /api/flashcards - returning ${flashcards.length} cards`);
  res.json(flashcards);
});

// Create flashcard
app.post('/api/flashcards', (req, res) => {
  const { question, answer, area } = req.body;
  
  if (!question || !answer || !area) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newCard = {
    id: nextId++,
    question,
    answer,
    area,
    createdAt: new Date().toISOString()
  };
  
  flashcards.push(newCard);
  console.log(`[API] Created flashcard: ${newCard.id}`);
  res.status(201).json(newCard);
});

// Get flashcard by ID
app.get('/api/flashcards/:id', (req, res) => {
  const card = flashcards.find(c => c.id === parseInt(req.params.id));
  if (!card) {
    return res.status(404).json({ error: 'Flashcard not found' });
  }
  res.json(card);
});

// Update flashcard
app.put('/api/flashcards/:id', (req, res) => {
  const card = flashcards.find(c => c.id === parseInt(req.params.id));
  if (!card) {
    return res.status(404).json({ error: 'Flashcard not found' });
  }
  
  const { question, answer, area } = req.body;
  if (question) card.question = question;
  if (answer) card.answer = answer;
  if (area) card.area = area;
  card.updatedAt = new Date().toISOString();
  
  console.log(`[API] Updated flashcard: ${card.id}`);
  res.json(card);
});

// Delete flashcard
app.delete('/api/flashcards/:id', (req, res) => {
  const index = flashcards.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Flashcard not found' });
  }
  
  const deleted = flashcards.splice(index, 1);
  console.log(`[API] Deleted flashcard: ${deleted[0].id}`);
  res.json(deleted[0]);
});

// Get unique areas
app.get('/api/areas', (req, res) => {
  const areas = [...new Set(flashcards.map(c => c.area))].sort();
  console.log(`[API] GET /api/areas - returning ${areas.length} areas`);
  res.json(areas);
});

// Bulk import flashcards
app.post('/api/flashcards/bulk', (req, res) => {
  const { cards } = req.body;
  
  if (!Array.isArray(cards)) {
    return res.status(400).json({ error: 'Cards must be an array' });
  }
  
  const imported = cards.map(card => ({
    id: nextId++,
    question: card.question,
    answer: card.answer,
    area: card.area || 'Sem Categoria',
    createdAt: new Date().toISOString()
  }));
  
  flashcards.push(...imported);
  console.log(`[API] Imported ${imported.length} flashcards`);
  res.status(201).json({ imported: imported.length, cards: imported });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[API] Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`[API] Server listening on port ${PORT}`);
  console.log(`[API] CORS enabled for: ${process.env.CORS_ORIGIN || 'all origins'}`);
  console.log(`[API] Database: In-memory storage`);
  console.log(`[API] Ready to accept requests`);
});
