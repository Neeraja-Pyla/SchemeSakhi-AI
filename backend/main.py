
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from scheme_data import SCHEME_KNOWLEDGE
from eligibility import check_pm_kisan_eligibility

print("TOTAL SCHEMES LOADED:", len(SCHEME_KNOWLEDGE))

for scheme in SCHEME_KNOWLEDGE:
    print("SCHEME:", scheme["name"])
    print("KEYWORDS:", scheme["keywords"])

# Load secret API key from .env
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

# Create FastAPI application
app = FastAPI(
    title="SchemeSakhi AI",
    description="Multilingual Government Scheme Assistant",
    version="1.0.0"
)

# Allow React frontend to communicate with Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the format of incoming chat messages
class ChatRequest(BaseModel):
    message: str


class EligibilityRequest(BaseModel):
    state: str
    land: str
    institutional: str
    publicOffice: str
    governmentEmployee: str
    incomeTax: str
    pension: str
    professional: str



@app.get("/")
def home():
    return {
        "message": "Welcome to SchemeSakhi AI Backend!",
        "status": "Running successfully"
    }


# Gemini AI chat endpoint
@app.post("/chat")
def chat(request: ChatRequest):

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key is missing. Check your .env file."
        )

    try:
        # Find scheme information related to the user's question
        user_question = request.message.lower()

        matched_schemes = [
            scheme
            for scheme in SCHEME_KNOWLEDGE
            if any(
                keyword.lower() in user_question
                for keyword in scheme["keywords"]
            )
        ]
        print("USER QUESTION:", request.message)
        print("MATCHED SCHEMES:", [scheme["name"] for scheme in matched_schemes])
        # Prepare verified information for Gemini
        knowledge_context = ""

        for scheme in matched_schemes:
            knowledge_context += f"\nScheme: {scheme['name']}\n"

            for fact in scheme["facts"]:
                knowledge_context += f"- {fact}\n"

            knowledge_context += (
                f"Official source: {scheme['official_source']}\n"
                f"Source name: {scheme['source_name']}\n"
                f"Last verified: {scheme['last_verified']}\n"
            )
        client = genai.Client(api_key=api_key)

        
        prompt = f"""
You are SchemeSakhi AI, a helpful Indian government scheme guide.

Your job is to explain government schemes in simple language.

IMPORTANT RULES:

1. Reply in the same language used by the user.
2. Support English and Telugu.
3. Use the verified scheme information provided below.
4. Never invent eligibility rules, benefits, deadlines,
   documents or official links.
5. If verified information is insufficient, clearly say so.
6. For scheme-specific questions without matching verified
   information, explain that the information is not yet
   available in your knowledge base.
7. Never claim to officially approve someone's eligibility.
8. Include the official source when relevant.
9. For greetings or general questions, respond naturally.

VERIFIED SCHEME INFORMATION:

{knowledge_context if knowledge_context else "No matching verified scheme information is currently available."}

USER QUESTION:

{request.message}
"""

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt
        )

        return {
            "reply": response.text
        }

    except Exception as error:
        print("GEMINI ERROR:", repr(error), flush=True)

        raise HTTPException(
        status_code=502,
        detail=str(error)
    )

@app.post("/check-eligibility")
def check_eligibility(request: EligibilityRequest):

    result = check_pm_kisan_eligibility(
        request.model_dump()
    )

    return result   