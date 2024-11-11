require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const statsRouter = require('./routes/stats');

const app = express();

// CORS Middleware
app.use(cors({
  origin: '*', // Allows all origins - you could specify allowed origins here if needed
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Middleware
app.use(express.json()); // Parses incoming JSON requests

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'zoominclinic_db'
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the ZoomInClinic backend');
});

app.use('/api', statsRouter); // Routes for stats

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
