import sys
import numpy as np
import joblib
import json

def main():
    try:
        # Load the trained model and scaler
        model = joblib.load('diabetes_model.pkl')
        scaler = joblib.load('scaler.pkl')  # Now this file exists!

        # Correct feature order (must match your training data)
        args = sys.argv[1:]
        input_data = [
            float(args[0]),  # Pregnancies
            float(args[4]),  # Glucose
            float(args[1]),  # BloodPressure
            float(args[5]),  # SkinThickness
            float(args[2]),  # Insulin
            float(args[6]),  # BMI
            float(args[3]),  # DiabetesPedigreeFunction
            float(args[7])   # Age
        ]
        
        # Convert input_data into a NumPy array and reshape for a single sample
        input_array = np.array(input_data).reshape(1, -1)
        
        # Transform the input data using the scaler
        input_array = scaler.transform(input_array)
        
        # Make prediction
        prediction = model.predict(input_array)
        
        # Return the prediction as JSON
        print(json.dumps({"prediction": int(prediction[0])}))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
