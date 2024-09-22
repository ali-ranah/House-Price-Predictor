import pickle
import pandas as pd

# Load the model from the file
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

# Define a function to predict the price
def predict_price(location, bedrooms, bathrooms, size):
    input_data = pd.DataFrame({'location': [location], 'bedrooms': [bedrooms], 'baths': [bathrooms], 'Total_Area': [size]})
    predicted_price = model.predict(input_data)
    return predicted_price[0]

# Example usage:
location = 'Bani Gala'
bedrooms = 6
bathrooms = 5
size = 2178
predicted_price = predict_price(location, bedrooms, bathrooms, size)
print(f'Predicted price: {predicted_price*100000}')