from flask import Flask, render_template, request
import pickle
import numpy as np

model = pickle.load(open('diabetes_model.pkl', 'rb')) 

app = Flask(__name__)

@app.route('/del3')
def man():
    return render_template('del3.html')

@app.route('/predict', methods=['POST'])
def home():
    data1 = request.form['pregnancies']
    data2 = request.form['blood-pressure']
    data3 = request.form['insulin-level']
    data4 = request.form['diabetes-pedigree']
    data5 = request.form['glucose-level']
    data6 = request.form['skin-thickness']
    data7 = request.form['bmi']
    data8 = request.form['age']
    arr = np.array([[data1, data2, data3, data4, data5, data6, data7, data8 ]])
    pred = model.predict(arr)
    return render_template('after.html', data=pred)



if __name__ == "__main__":
    app.run(debug=True)
