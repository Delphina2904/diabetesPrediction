const { PythonShell } = require('python-shell');

exports.predictDiabetes = async (req, res) => {
    const { pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigreeFunction, age } = req.body;

    try {
        const options = {
            args: [pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigreeFunction, age],
        };

        PythonShell.run('predict_diabetes.py', options, (err, results) => {
            if (err) throw err;
            res.json({ prediction: results[0] === '1' });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};