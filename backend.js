const express = require('express');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./database'); 
const Combined = require('./combinedModel'); 
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config(); 

const app = express();
const server = http.createServer(app);

connectDB();

// CORS configuration
const corsOptions = {
  origin: 'https://phoenix-game.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'GAME.html')); 
});

// API endpoint to save user info and scores together
app.post('https://phoenix-game.vercel.app/api/save-results', async (req, res) => {
  const { userInfo, scores } = req.body;

  if (!userInfo || !scores) {
    return res.status(400).json({ message: 'User info and scores are required' });
  }

  try {
    const combinedEntry = new Combined({ userInfo, scores });
    await combinedEntry.save();
    res.status(201).json({ message: 'Results saved successfully' });
  } catch (err) {
    console.error('Error saving results:', err); 
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
