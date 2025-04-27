# predict_no_blood.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# ————————————————————————————————
# 1) Load *only* the no-blood model and scaler
#    (these go in the same folder)
# ————————————————————————————————
with open('no_blood_scaler.pkl', 'rb') as f:
    no_blood_scaler = pickle.load(f)

with open('knn_model.pkl', 'rb') as f:
    knn_model = pickle.load(f)


# ————————————————————————————————
# 2) Create a separate endpoint for no-blood prediction
# ————————————————————————————————
@app.route('/predict_no_blood', methods=['POST'])
def predict_no_blood():
    data = request.get_json(force=True)

    # 3) Pull out exactly these 8 fields from JSON:
    arr = [
        data['gender'],
        data['age'],
        data['heart_disease'],
        data['smoking_habit'],
        data['hba1c_level'],
        data['glucose_level'],
        data['bmi'],
        data['heart_rate']
    ]

    # 4) Scale & reshape for your model
    X = np.array(arr).reshape(1, -1)
    X_scaled = no_blood_scaler.transform(X)

    # 5) Predict and return JSON
    pred = knn_model.predict(X_scaled)[0]
    label = 'High risk (1)' if pred == 1 else 'Low risk (0)'
    return jsonify({'prediction': int(pred), 'label': label})


# ————————————————————————————————
# 6) Run on port 5001 so it won’t clash
# ————————————————————————————————
if __name__ == '__main__':
    app.run(port=5001, debug=True)
