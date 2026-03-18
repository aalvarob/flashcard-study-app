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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mock flashcards data
const mockFlashcards = [
  {
    id: 1,
    question: 'O que é um flashcard?',
    answer: 'Um flashcard é um cartão de estudo com uma pergunta de um lado e a resposta do outro.',
    area: 'Escrituras Sagradas'
  }
];

// Get all flashcards
app.get('/api/flashcards', (req, res) => {
  res.json(mockFlashcards);
});

// Create flashcard
app.post('/api/flashcards', (req, res) => {
  const { question, answer, area } = req.body;
  
  if (!question || !answer || !area) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newCard = {
    id: mockFlashcards.length + 1,
    question,
    answer,
    area
  };
  
  mockFlashcards.push(newCard);
  res.status(201).json(newCard);
});

// Get flashcard by ID
app.get('/api/flashcards/:id', (req, res) => {
  const card = mockFlashcards.find(c => c.id === parseInt(req.params.id));
  if (!card) {
    return res.status(404).json({ error: 'Flashcard not found' });
  }
  res.json(card);
});

// Update flashcard
app.put('/api/flashcards/:id', (req, res) => {
  const card = mockFlashcards.find(c => c.id === parseInt(req.params.id));
  if (!card) {
    return res.status(404).json({ error: 'Flashcard not found' });
  }
  
  const { question, answer, area } = req.body;
  if (question) card.question = question;
  if (answer) card.answer = answer;
  if (area) card.area = area;
  
  res.json(card);
});

// Delete flashcard
app.delete('/api/flashcards/:id', (req, res) => {
  const index = mockFlashcards.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Flashcard not found' });
  }
  
  const deleted = mockFlashcards.splice(index, 1);
  res.json(deleted[0]);
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`[API] Server listening on port ${PORT}`);
  console.log(`[API] CORS enabled for: ${process.env.CORS_ORIGIN || 'all origins'}`);
});
