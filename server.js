const express = require('express');
const cors = require('cors');
const statsRouter = require('./routes/statsRoutes');
const authRouter = require('./routes/authRoutes');
const connectDB = require('./config/db');

const app = express();
connectDB();

// CORS Middleware
app.use(cors({
  origin: '*', // Allows all origins - you could specify allowed origins here if needed
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Middleware
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the ZoomInClinic backend');
});

app.use('/api/stats', statsRouter); // Routes for stats
app.use('/api/auth', authRouter); // Routes for stats

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
