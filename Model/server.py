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

def get_encoded_location_columns():
    # Access the column transformer from the pipeline
    column_trans = model.named_steps['columntransformer']
    
    # Get the names of the encoded features (locations)
    encoder = column_trans.transformers_[0][1]  # Access the OneHotEncoder in the pipeline
    encoded_columns = encoder.get_feature_names_out(input_features=['location'])
     # Remove the "location_" prefix from the column names
    cleaned_columns = [col.replace('location_', '') for col in encoded_columns]
    
    # Remove "other" if it exists in the list
    cleaned_columns = [col for col in cleaned_columns if col != 'other']
    
    # Return the cleaned list of location features
    return cleaned_columns

@app.route('/api/locations', methods=['GET'])
def locations():
    try:
        locations = get_encoded_location_columns()  # Get the one-hot encoded location columns
        return jsonify(locations)  # Return the locations as a JSON response
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)


# Curl Command - Run the server - Run the command in cmd
# curl -X POST -H "Content-Type: application/json" -d "{\"location\":\"Bani Gala\", \"bedrooms\":6, \"bathrooms\":5, \"size\":2178}" http://127.0.0.1:5000/predict
