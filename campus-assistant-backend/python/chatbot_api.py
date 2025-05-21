from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load GPT-2 model
generator = pipeline("text-generation", model="gpt2")

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "No text provided"}), 400
    result = generator(text, max_length=50)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5001)
