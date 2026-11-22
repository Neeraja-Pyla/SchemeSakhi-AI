
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

from scheme_data import SCHEME_KNOWLEDGE
from eligibility import check_pm_kisan_eligibility

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]
frontend_url = os.getenv("FRONTEND_URL", "").strip().rstrip("/")

if frontend_url:
    allowed_origins.append(frontend_url)

print("TOTAL SCHEMES LOADED:", len(SCHEME_KNOWLEDGE))

for scheme in SCHEME_KNOWLEDGE:
    print("SCHEME:", scheme["name"])
    print("KEYWORDS:", scheme["keywords"])


app = FastAPI(
    title="SchemeSakhi AI",
    description="Multilingual Government Scheme Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    nri: str = "unsure"


@app.get("/")
def home():
    return {
        "message": "Welcome to SchemeSakhi AI Backend!",
        "status": "Running successfully"
    }


@app.post("/chat")
def chat(request: ChatRequest):

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key is missing. Check your environment settings."
        )

    try:
        user_question = request.message.lower()

        matched_schemes = [
            scheme
            for scheme in SCHEME_KNOWLEDGE
            if any(
                keyword.lower() in user_question
                for keyword in scheme["keywords"]
            )
        ]

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

Rules:
1. Reply in the same language used by the user.
2. Support English and Telugu.
3. Use the verified information provided below.
4. Never invent eligibility rules, benefits, deadlines,
   documents or official links.
5. If information is insufficient, clearly say so.
6. Never claim to officially approve eligibility.
7. Include official sources when relevant.
8. For general greetings, respond naturally.

VERIFIED SCHEME INFORMATION:

{knowledge_context if knowledge_context else "No matching verified scheme information is currently available."}

USER QUESTION:

{request.message}
"""

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt
        )

        return {"reply": response.text}

    except Exception as error:
        print("GEMINI ERROR:", repr(error), flush=True)

        raise HTTPException(
            status_code=502,
            detail="Unable to generate a response right now. Please try again."
        )


@app.post("/check-eligibility")
def check_eligibility(request: EligibilityRequest):
    result = check_pm_kisan_eligibility(request.model_dump())
    return result
