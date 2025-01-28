import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report

# Load the dataset
file_path = "Large_Diabetes_Prediction_Parameters.xlsx"  # Update this to your file's location
data = pd.read_excel(file_path)

# Add a target column (simulated for this dataset)
# This is for demonstration purposes; replace this with real labeled data when available.
data['Diabetes Prediction'] = data.apply(
    lambda row: 'Yes' if (
        row['BMI (kg/m²)'] > 30 or 
        row['Waist Circumference (cm)'] > 100 or 
        row['Family History of Diabetes'] == 'Yes'
    ) else 'No',
    axis=1
)

# Prepare the dataset for training
X = data.drop(columns=['Diabetes Prediction'])
X = pd.get_dummies(X, drop_first=True)  # One-hot encode categorical variables
y = data['Diabetes Prediction'].apply(lambda x: 1 if x == 'Yes' else 0)

# Standardize the data (important for KNN)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train the K-Nearest Neighbors Classifier
k = 5  # You can tune this hyperparameter
model = KNeighborsClassifier(n_neighbors=k)
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Predict for new samples
def predict_diabetes(new_data):
    # Convert the input dictionary to a DataFrame
    new_data_processed = pd.get_dummies(pd.DataFrame([new_data]), columns=X.columns[:-1], drop_first=True)
    # Align the new data with the training set columns and fill missing columns with 0
    new_data_processed = new_data_processed.reindex(columns=X.columns, fill_value=0)
    # Standardize the input data
    new_data_scaled = scaler.transform(new_data_processed)
    # Make a prediction
    prediction = model.predict(new_data_scaled)
    return "Yes" if prediction[0] == 1 else "No"

# Example usage for prediction
new_sample = {
    "Age (years)": 45,
    "Gender": "Female",
    "BMI (kg/m²)": 32.5,
    "Waist Circumference (cm)": 105,
    "Physical Activity Level": "Low",
    "Family History of Diabetes": "Yes",
    "Dietary Habits": "High Sugar",
    "Smoking Status": "No",
    "Alcohol Consumption": "No",
    "Sleep Duration (hours)": 6,
    "Stress Levels": "High"
}

print(f"Diabetes Prediction for new sample: {predict_diabetes(new_sample)}")