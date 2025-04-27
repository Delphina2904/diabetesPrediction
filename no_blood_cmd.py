# no_blood_cmd.py

import sys
import json
import pickle
import numpy as np

# 1) Load the scaler and model (make sure these .pkl files are here)
with open('no_blood_scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

with open('knn_model.pkl', 'rb') as f:
    model = pickle.load(f)

# 2) Read the 8 values from command-line arguments
#    They come in order: gender, age, heart_disease, smoking_habit,
#    hba1c_level, glucose_level, bmi, heart_rate
args = sys.argv[1:]
# Convert each to float
features = [float(x) for x in args]

# 3) Turn into array, scale, predict
X = np.array(features).reshape(1, -1)
X_scaled = scaler.transform(X)
y_pred = int(model.predict(X_scaled)[0])

# 4) Print JSON to stdout
print(json.dumps({ 'prediction': y_pred }))
