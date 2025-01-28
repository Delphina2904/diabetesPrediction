const mongoose = require('mongoose');

const HealthHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  pregnancies: Number,
  glucose: Number,
  bloodPressure: Number,
  skinThickness: Number,
  insulin: Number,
  bmi: Number,
  diabetesPedigreeFunction: Number,
  age: Number,
  prediction: Boolean, // True if diabetes is predicted
});

module.exports = mongoose.model('HealthHistory', HealthHistorySchema);
