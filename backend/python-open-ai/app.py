# app.py
from flask import Flask, request, jsonify
from openai import OpenAI

app = Flask(__name__)

# sk-proj-RrwpZh2QiI8Autv15jniT3BlbkFJEPmyyalRf1ADqYEamTZL
api_key = ''

@app.route('/api/ai', methods=['POST'])
def ai_response():


    data = request.get_json()
    print(data)
    user_message = data['message']


    client = OpenAI(
        # This is the default and can be omitted
        api_key=api_key,
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": user_message,
            }
        ],
        model="gpt-3.5-turbo",
    )


    print(chat_completion)


    return jsonify({"response": "nckjsnckj"})

if __name__ == '__main__':
    app.run(port=8080)
