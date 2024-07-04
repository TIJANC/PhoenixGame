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

connectDB(); // Connect to MongoDB

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Route to handle POST request
app.post('https://phoenix-game.vercel.app/saveResults', async (req, res) => {
    const newCombined = new Combined({
        userInfo: req.body.userInfo,
        scores: req.body.scores,
    });

    try {
        await newCombined.save();
        res.status(200).send('Result saved successfully');
    } catch (err) {
        res.status(500).send('Error saving result to database');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
