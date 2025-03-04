// knnModel.js

// STEP 1: Define your training data.
// Each sample should have all the features your model uses and a label.
// Replace these samples with your real training data.
const trainingData = [
    {
      pregnancies: 2,
      bloodPressure: 70,
      insulin: 80,
      diabetesPedigree: 0.5,
      glucose: 130,
      skinThickness: 30,
      bmi: 25,
      age: 25,
      label: 'Diabetic'
    },
    {
      pregnancies: 1,
      bloodPressure: 80,
      insulin: 70,
      diabetesPedigree: 0.4,
      glucose: 90,
      skinThickness: 25,
      bmi: 22,
      age: 22,
      label: 'Not Diabetic'
    },
    // Add more training samples as needed...
  ];
  
  // STEP 2: Create a function to calculate the Euclidean distance.
  function euclideanDistance(a, b) {
    let sum = 0;
    // Loop through each feature (skip the label)
    for (let key in a) {
      if (a.hasOwnProperty(key) && key !== 'label') {
        const diff = a[key] - b[key];
        sum += diff * diff;
      }
    }
    return Math.sqrt(sum);
  }
  
  // STEP 3: Create your KNN prediction function.
  // This function compares the input data to each training sample,
  // selects the k nearest neighbors (default k=3), and returns the majority label.
  function predictDiabetes(input, k = 3) {
    // Calculate distance from the input to each training sample
    const distances = trainingData.map(sample => {
      return { distance: euclideanDistance(input, sample), label: sample.label };
    });
  
    // Sort the samples by distance (smallest distance first)
    distances.sort((a, b) => a.distance - b.distance);
  
    // Select the top k neighbors
    const neighbors = distances.slice(0, k);
  
    // Tally the votes for each label
    const votes = {};
    neighbors.forEach(n => {
      votes[n.label] = (votes[n.label] || 0) + 1;
    });
  
    // Find the label with the most votes
    let maxVotes = 0;
    let prediction = null;
    for (let label in votes) {
      if (votes[label] > maxVotes) {
        maxVotes = votes[label];
        prediction = label;
      }
    }
    return prediction;
  }
  
  // Export the prediction function so it can be used in your server code.
  module.exports = { predictDiabetes };
  