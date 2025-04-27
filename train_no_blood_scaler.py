# train_no_blood_scaler.py

import pickle
from sklearn.preprocessing import StandardScaler
import pandas as pd

# 1) Recreate the exact training data your friend used:
training_data = {
    'gender':        [0, 1, 1, 0, 1, 0, 1, 0],
    'age':           [45,50,60,40,35,55,65,30],
    'heart_disease': [0, 1, 1, 0, 0, 1, 1, 0],
    'smoking_habit': [1, 1, 0, 0, 2, 1, 0, 2],
    'hba1c_level':   [5.8,6.5,7.0,5.5,5.2,6.2,6.8,5.0],
    'glucose_level': [90,130,160,85,80,140,150,75],
    'bmi':           [22.5,30.0,28.5,24.5,22.0,32.0,31.5,23.0],
    'heart_rate':    [72,85,90,78,70,88,92,68]
}

# 2) Build a DataFrame and fit a StandardScaler
df = pd.DataFrame(training_data)
scaler = StandardScaler()
scaler.fit(df)

# 3) Save it to disk
with open('no_blood_scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

print("no_blood_scaler.pkl has been created!")
