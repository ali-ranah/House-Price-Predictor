from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# Load the model from the file
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

# Define a function to predict the price
def predict_price(location, bedrooms, bathrooms, size):
    input_data = pd.DataFrame({'location': [location], 'bedrooms': [bedrooms], 'baths': [bathrooms], 'Total_Area': [size]})
    predicted_price = model.predict(input_data)
    return predicted_price[0]

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    location = data['location']
    bedrooms = data['bedrooms']
    bathrooms = data['bathrooms']
    size = data['size']
    
    predicted_price = predict_price(location, bedrooms, bathrooms, size)
    return jsonify({'predicted_price': predicted_price * 100000})

if __name__ == '__main__':
    app.run(debug=True)


# Curl Command - Run the server - Run the command in cmd
# curl -X POST -H "Content-Type: application/json" -d "{\"location\":\"Bani Gala\", \"bedrooms\":6, \"bathrooms\":5, \"size\":2178}" http://127.0.0.1:5000/predict
