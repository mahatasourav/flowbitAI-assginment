from vanna.remote import VannaDefault
import os
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Initialize Vanna
vanna = VannaDefault(
    model="groq/gemma2-9b-it",
    api_key=os.getenv("GROQ_API_KEY")
)

# Fully explicit prompt including table and columns
prompt = (
    "You have a PostgreSQL table named invoices with columns: "
    "id (int), amount (numeric), created_at (timestamp). "
    "Write a SQL query to get total spend in the last 30 days."
)

# Generate SQL
sql = vanna.generate_sql(prompt)

if sql:
    print("Generated SQL:\n", sql)
else:
    print("No SQL returned. Check API key, model, or prompt.")
