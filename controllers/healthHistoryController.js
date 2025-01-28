const HealthHistory = require('../models/HealthHistory');

exports.getHealthHistory = async (req, res) => {
  try {
    const history = await HealthHistory.find({ userId: req.user.userId });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addHealthRecord = async (req, res) => {
  const { pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigreeFunction, age, prediction } = req.body;
  try {
    const record = new HealthHistory({
      userId: req.user.userId,
      pregnancies,
      glucose,
      bloodPressure,
      skinThickness,
      insulin,
      bmi,
      diabetesPedigreeFunction,
      age,
      prediction,
    });
    await record.save();
    res.status(201).json({ message: 'Health record added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
