import dotenv
import os

from app import send_email
dotenv.load_dotenv()

print("Loaded:", {k: os.getenv(k) for k in ['MAIL_SERVER','MAIL_USERNAME','MAIL_PASSWORD','MAIL_PORT']})
print("Result:", send_email("Test","srnwda@gmail.com","Hi","Body"))

   