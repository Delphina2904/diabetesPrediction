const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Initialize Express app
const app = express();

// Load environment variables
dotenv.config();

// Middleware to parse JSON
app.use(express.json());

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // Allow cookies or authentication headers
}));

// Import health history routes
const healthHistoryRoutes = require('./routes/healthHistory');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/health-history', healthHistoryRoutes);
app.use('/api/predict', require('./routes/prediction'));

// Allow preflight requests for all routes
app.options('*', cors());

// Example of a login route
app.post('/login', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Login logic here
    res.status(200).json({ message: 'Login successful' });
});

// Serve static files (if any)
app.use(express.static('public'));

// Start server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});