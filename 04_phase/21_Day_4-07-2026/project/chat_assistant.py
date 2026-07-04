"""
🚀 Mini Project: AI Chat Assistant
Is script ko run karo aur apne khud ke banaye hue AI assistant se baatein karo!
"""

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
import os

# Apna API key yaha dalna zaroori hai!
# Agar tumhare paas environment variable me key nahi hai, 
# to yaha direct daal do (e.g. API_KEY = "Teri_API_Key")
API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_API_KEY_HERE")

def main():
    print("🤖 AI Chat Assistant initialize ho raha hai...\n")
    
    # LLM initialize karo
    try:
        llm = ChatGoogleGenerativeAI(
            api_key=API_KEY,
            model="gemini-2.5-flash"
        )
    except Exception as e:
        print("❌ Bhai API key wagaira theek se set nai hai. Ek bar check kar le!")
        return

    # Message history banane k liye empty list
    messages = []
    
    print("========================================")
    print("🤖 AI Chat Assistant mein tumhara swagat hai!")
    print("💡 (Chat se bahar aane ke liye 'exit', 'quit' type karo)")
    print("========================================\n")

    while True:
        user = input("Tu 🙋‍♂️ : ")
        
        # User ne agar exit type kiya to ruk jao
        if user.lower() in ["exit", "quit", "bye", "chalta hu"]:
            print("🤖 AI : Chal theek hai bhai, milte hain baad mein! 👋")
            break
            
        # User message list mein add karo
        messages.append(HumanMessage(content=user))
        
        try:
            # LLM se response maango
            response = llm.invoke(messages)
            print(f"🤖 AI : {response.content}\n")
            
            # AI ka response bhi list mein add karo taki memory bani rahe
            # Agle message ke liye usko pichli baat yaad rahegi!
            messages.append(response)
        except Exception as e:
            print(f"❌ Oops, kuch gadbad ho gayi AI se baat karne mein: {e}")

if __name__ == "__main__":
    main()
