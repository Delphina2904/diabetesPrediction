const express = require('express');
const app = express();
const connectDB = require("./db/connect");
const port = 3000;
const bodyParser = require('body-parser');
const { spawn } = require('child_process');  // Changed from exec to spawn


// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files (your HTML)
app.use(express.static('public'));  // Assuming your HTML is in a 'public' folder

// Allow CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log('${PORT} Yes I am connected');
        });
    } catch (error) {
        console.log(error);
    }
};
// Handle the prediction endpoint
app.post('/predict_diabetes', (req, res) => {  // Changed route to match frontend
    const inputData = req.body;
    
    const pythonProcess = spawn('python', ['predict_diabetes.py']);
    
    let pythonData = "";
    let pythonError = "";

    // Send data to Python script
    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();

    // Collect data from Python script
    pythonProcess.stdout.on('data', (data) => {
        pythonData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        pythonError += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error('Python script error:', pythonError);
            return res.status(500).json({ error: 'Error in prediction' });
        }
        try {
            const prediction = JSON.parse(pythonData);
            res.json(prediction);
        } catch (error) {
            console.error('Error parsing Python output:', error);
            res.status(500).json({ error: 'Error processing prediction' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});