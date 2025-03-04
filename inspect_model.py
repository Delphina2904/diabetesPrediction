import joblib

# Load your saved model
model = joblib.load('diabetes_model.pkl')

# Print the model details
print("Model type:", type(model))
print("Model details:", model)
