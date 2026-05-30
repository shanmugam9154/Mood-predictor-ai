from flask import Flask, render_template, request, jsonify
import pandas as pd
from sklearn.tree import DecisionTreeClassifier

app = Flask(__name__)

# Load dataset
data = pd.read_csv("typing_data.csv")

X = data[["speed", "backspaces", "pause", "error"]]
y = data["label"]

model = DecisionTreeClassifier()
model.fit(X, y)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    speed = data["speed"]
    backspaces = data["backspaces"]
    pause = data["pause"]
    error = data["error"]

    prediction = model.predict([[speed, backspaces, pause, error]])

    return jsonify({"result": prediction[0]})

if __name__ == "__main__":
    app.run(debug=True)