import os
from fastapi import FastAPI
from pydantic import BaseModel
import psycopg2
from dotenv import load_dotenv
from vanna.remote import VannaDefault

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()

app = FastAPI(title="Invoice AI Backend")

# -----------------------------
# PostgreSQL connection
# -----------------------------
conn = psycopg2.connect(os.getenv("DATABASE_URL"))
conn.autocommit = True

# -----------------------------
# Initialize Vanna (Groq)
# -----------------------------
vanna_model = VannaDefault(
    model="groq/gemma2-9b-it",
    api_key=os.getenv("GROQ_API_KEY")
)

# -----------------------------
# Database schema context
# -----------------------------
SCHEMA_CONTEXT = """
Tables:
"Invoice" (id, invoiceDate, invoiceTotal, totalTax, customerId, vendorId, createdAt, updatedAt)
"Customer" (id, customerName, customerAddress)
"Vendor" (id, vendorName, vendorTaxId)
"Payment" (id, dueDate, paymentTerms, discountedTotal)
"LineItem" (id, description, quantity, unitPrice, totalPrice, invoiceId)
"Document" (id, name, filePath, invoiceId)
"""

# -----------------------------
# Request / Response Models
# -----------------------------
class Question(BaseModel):
    question: str

class AnswerResponse(BaseModel):
    question: str
    sql: str
    results: list[dict] = []
    error: str | None = None

# -----------------------------
# Root endpoint
# -----------------------------
@app.get("/")
def root():
    return {"message": "Invoice AI backend running!"}

# -----------------------------
# /chat-with-data endpoint
# -----------------------------
@app.post("/chat-with-data", response_model=AnswerResponse)
def chat_with_data(q: Question):
    question = q.question

    # Build explicit prompt for AI
    prompt = f"""
You are an AI that writes PostgreSQL queries ONLY.
Use these tables and columns:

{SCHEMA_CONTEXT}

Question: {question}

Write the SQL query ONLY. Do not add any explanations or text.
"""

    # -----------------------------
    # Generate SQL dynamically
    # -----------------------------
    try:
        response = vanna_model.ask(prompt)

        # Case 1: Vanna returns object with .questions
        if hasattr(response, "questions") and len(response.questions) > 0:
            sql = response.questions[0].sql

        # Case 2: Vanna returns a string directly
        elif isinstance(response, str) and response.strip():
            sql = response.strip()

        # Case 3: Invalid response
        else:
            return AnswerResponse(
                question=question,
                sql="",
                results=[],
                error=f"Vanna returned invalid SQL: {response}"
            )

    except Exception as e:
        return AnswerResponse(
            question=question,
            sql="",
            results=[],
            error=f"SQL generation failed: {e}"
        )

    # -----------------------------
    # Execute SQL safely
    # -----------------------------
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
            cols = [desc[0] for desc in cur.description] if cur.description else []
            rows = cur.fetchall() if cur.description else []

        results = [dict(zip(cols, row)) for row in rows]

        return AnswerResponse(
            question=question,
            sql=sql,
            results=results,
            error=None
        )

    except Exception as e:
        return AnswerResponse(
            question=question,
            sql=sql,
            results=[],
            error=f"PostgreSQL execution error: {e}"
        )
