# AI-Powered Campus-Based Virtual Assistant

## Overview
This project is an AI-powered virtual assistant designed for campus management. It supports both text and voice interactions, providing students and staff with quick access to campus-related information such as FAQs, events, navigation, and more. The system is built using the **MEAN stack** (MongoDB, Express.js, Angular, Node.js) and integrates **Hugging Face's NLP API** for intelligent, context-aware responses.

## Features
- Accurate FAQ matching using a MongoDB database.
- Contextual fallback responses powered by Hugging Face NLP models.
- Voice input support via Web Speech API.
- Fast response times for both database queries and AI-generated replies.
- User-friendly web interface built with Angular.

## Technologies Used
- **MongoDB** — Data storage for FAQs and campus information.
- **Express.js & Node.js** — Backend server and API.
- **Angular** — Frontend framework.
- **Hugging Face API** — Natural language processing and response generation.
- **Web Speech API** — Speech-to-text support.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/noor3004/ai_powered_campus_based_virtual_assistant.git
2. Navigate to the project directory and install dependencies for backend and frontend:

  bash
 # cd backend
  npm install
  #cd ../frontend
  npm install

3. Set up environment variables as needed (e.g., Hugging Face API keys).

4. Run the backend and frontend servers:
bash
# In backend folder
npm start
# In frontend folder
ng serve

5. Usage

Access the web interface via http://localhost:4200.
Type or speak your queries to get campus information and assistance.

7. Performance
   FAQ matching accuracy: ~80%
   Speech recognition accuracy: ~85% (clear audio)
   Response times: 1.5–2 seconds (database), 3–5 seconds (AI-generated)

8. Contributing
Feel free to fork this repo and submit pull requests for improvements or bug fixes.


Developed by Mohammad Noor
For any questions or feedback, please contact: noormohd2227@gmail.com
