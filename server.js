const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();

app.use(cors());
app.use(express.json());

// Dummy login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        res.status(200).json({ token: 'dummy-token' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.get('/', (req, res) => {
    res.send('Server is working!');
});

app.post('/api/predict', (req, res) => {
    const data = req.body;
    console.log("Received data:", data);

    // Validate input data
    if (!validateInput(data)) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    let hasResponded = false; // Flag to track response status
    const pythonProcess = spawn('python', [
        'predict_diabetes.py',
        data.pregnancies,
        data.bloodPressure,
        data.insulinLevel,
        data.diabetesPedigree,
        data.glucoseLevel,
        data.skinThickness,
        data.bmi,
        data.age
    ]);

    let predictionData = '';
    let errorData = '';

    const sendResponse = (status, data) => {
        if (!hasResponded) {
            hasResponded = true;
            res.status(status).json(data);
        }
    };

    pythonProcess.stdout.on('data', (chunk) => {
        predictionData += chunk.toString();
    });

    pythonProcess.stderr.on('data', (chunk) => {
        errorData += chunk.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}: ${errorData}`);
            return sendResponse(500, { error: "Prediction failed", details: errorData });
        }

        try {
            const result = JSON.parse(predictionData);
            console.log(`Prediction: ${result.prediction}`);
            sendResponse(200, { prediction: Number(result.prediction) });
        } catch (error) {
            console.error("Error parsing prediction data:", error);
            sendResponse(500, { 
                error: "Invalid prediction response", 
                details: predictionData 
            });
        }
    });

    pythonProcess.on('error', (error) => {
        console.error(`Failed to start Python script: ${error}`);
        sendResponse(500, { error: "Server error", details: error.message });
    });
});

function validateInput(data) {
    const requiredFields = [
        'pregnancies', 'bloodPressure', 'insulinLevel',
        'diabetesPedigree', 'glucoseLevel', 'skinThickness',
        'bmi', 'age'
    ];
    
    return requiredFields.every(field => 
        data[field] !== undefined && 
        !isNaN(parseFloat(data[field]))
    );
}

app.listen(5000, () => console.log('Server running on port 5000'));