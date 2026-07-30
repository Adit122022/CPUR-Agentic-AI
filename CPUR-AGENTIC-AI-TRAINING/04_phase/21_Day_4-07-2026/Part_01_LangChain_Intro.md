# Part 1: LangChain - Ye Kya Bawaal Hai? 🤯

Dosto, aaj hum padhne wale hain **LangChain** ke baare mein. Agar tum AI apps banana chahte ho, toh LangChain tumhara sabse best friend hone wala hai. 

## LangChain Aakhir Hai Kya? 🤔
Bhai dekho, LangChain ek open-source Python framework hai. Iska main kaam kya hai? Jo apne **Large Language Models (LLMs)** hote hain (jaise ChatGPT, Gemini), unko external data, APIs, aur tools se connect karna. 
Matlab agar LLM ek dimaag hai, toh LangChain uski body hai jo usse duniya se connect karti hai.

**Simple Bhasha Mein:** LangChain ek jugaad (framework) hai jo developers ko smart AI apps banane mein help karta hai! 🧠🚀

### Kahan Kahan Use Hota Hai Ye?
- AI Chatbots banane mein (jaise ChatGPT)
- PDF padhke question answer karne wale tools
- AI Assistants 
- Customer Support Bots
- RAG Applications (jab apna custom data use karna ho)

---

## Direct API vs LangChain: Kiski Kitni Aukaat? 🥊

Dekho, tum direct API (jaise Google GenAI ya OpenAI) use karke bhi AI se baat kar sakte ho, lekin jab complex apps banane ho tab LangChain ka jaadu dikhta hai. Direct API simple tasks me theek hai, par scale karne par LangChain hi baap hai.

### Direct API Example (Bina LangChain ke):
```python
from google import genai

data = input("Bhai kuch bhi pooch le: \n")
client = genai.Client(api_key="YOUR_API_KEY_HERE")
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=data
)
print(response.text)
```

### LangChain Example:
LangChain ke saath coding thodi structured ho jati hai.
```python
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

# Pehle Gemini model ko ready karo
llm = ChatGoogleGenerativeAI(
    api_key="YOUR_API_KEY_HERE",
    model="gemini-2.5-flash",
    temperature=0.7
)

# Apna Prompt ready karo
prompt = PromptTemplate.from_template(
    "Mujhe {topic} ke baare mein samjhao"
)

# Chain banao (Prompt ko LLM ke saath jod do)
chain = prompt | llm

# Chain ko run karo
response = chain.invoke({
    "topic": "Artificial Intelligence"
})
print(response.content)
```

**LangChain ke Faaide:** Prompt templates, Chains, Memory (purani baatein yaad rakhna), RAG, Agents wagaira sab milta hai. Bade projects mein Direct API haath khade kar deti hai, wahin LangChain sher ki tarah khada rehta hai! 🦁

---

## LangChain Ke Asli Hathiyar ⚔️

### 1. Prompt Templates 📝
Baar baar same prompt likhne se acha hai, ek template bana lo aur variables pass karte raho. Code clean rehta hai.
```python
from langchain_core.prompts import PromptTemplate

prompt = PromptTemplate(
    input_variables=["topic"],
    template="Explain {topic} in simple words."
)
```

### 2. Chains 🔗
Chain ka kaam hai multiple components ko ek saath jodna. Jaise ek pipeline hoti hai - `Prompt → LLM → Output Parser`. Pehle prompt lo, LLM me daalo, output nikalo!

### 3. Memory 🧠
LLMs ki yaadash bahut kamzor hoti hai (Ghajini type). Memory use karke hum unhe purani conversations yaad dila sakte hain.
```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory()
memory.save_context(
    {"input": "Mera naam Asif hai"},
    {"output": "Nice to meet you."}
)
print(memory.load_memory_variables({}))
```

### 4. RAG (Retrieval-Augmented Generation) 📚
RAG matlab LLM ko kisi PDF, text file ya database se answer dhundhne ki shakti dena. Basically open book exam dena LLM ko.
**Flow:** Document -> Loader -> Text Chunks -> Embeddings -> Vector Database -> Retriever -> LLM -> Answer.

### 5. Agents 🕵️‍♂️
Agent ek smart system hai jo khud decide karta hai ki **kaunsa tool use karna hai** uske paas available tools me se.
```python
from langchain.tools import tool

@tool
def add(a: int, b: int):
    """Adds two integers together."""
    return a + b
```

### 6. Tool Integration 🛠️
Internet search karna hai ya calculator use karna hai? DuckDuckGo search jese tools mast kaam aate hain. 
```python
from langchain_community.tools import DuckDuckGoSearchRun
search = DuckDuckGoSearchRun()
result = search.invoke("Latest news in tech")
print(result)
```
