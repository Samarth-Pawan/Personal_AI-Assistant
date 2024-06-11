# app.py
from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

openai.api_key = 'sk-proj-x3H48R4Qpqw3PY3wNVPnT3BlbkFJ5aTN97hIaPIlZhs2oPRA'

@app.route('/api/ai', methods=['POST'])
def ai_response():
    data = request.get_json()
    user_message = data['message']
    response = openai.Completion.create(
        engine="davinci-codex",
        prompt=user_message,
        max_tokens=150
    )
    return jsonify({"response": response.choices[0].text.strip()})

if __name__ == '__main__':
    app.run(port=8000)
