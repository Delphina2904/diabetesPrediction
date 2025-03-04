import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib

# Load your training data from the CSV file (update the path if needed)
data = pd.read_csv('diabetes.csv')

# Display the CSV columns to verify their names (optional)
print("CSV columns:", data.columns.tolist())

# Select the feature columns (excluding the outcome)
features = data[['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
                 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']]

# Convert the features DataFrame to a NumPy array
X_train = features.values

# Fit the scaler on your training data
scaler = StandardScaler()
scaler.fit(X_train)

# Save the scaler to a file called 'scaler.pkl'
joblib.dump(scaler, 'scaler.pkl')

print("Scaler has been trained and saved as 'scaler.pkl'.")
