# Project: AI Story Generator (Gemini API)
'''
## Objective
Generate Story using Google's Gemini AI based on user input.

# Features
* Write Story instantly
* Multiple Story categories
* Custom tone selection
* Multiple languages (optional)
* Copy generated Story
* Download as TXT/PDF (optional)





# Project Flow

            User
              │
              ▼
      Enter Story Details
              │
              ▼
      Prompt Builder (Python)
              │
              ▼
      Gemini API
              │
              ▼
      AI Generated Story
              │
      ┌───────┴────────┐
      ▼                ▼
 Copy Story      Download PDF


# Project Structure
AI_Story_Generator/
│
├── app.py
├── prompt.py
├── gemini.py
├── requirements.txt
├── .env
├── templates/
│      index.html
│
├── static/
│      style.css
│
└── README.md

# Technologies
* Python
* FastAPI / Flask
* Gemini API
* HTML
* CSS
* JavaScript

# User Inputs
| Field                  | Example                         |
| ---------------------- | ------------------------------- |
| Recipient Name         | HR Manager                      |
| Story Type             | Job Application                 |
| Subject                | Python Developer Position       |
| Tone                   | Professional                    |
| Purpose                | Applying for Software Developer |
| Additional Information | 2 Years Experience              |


# Prompt Example


