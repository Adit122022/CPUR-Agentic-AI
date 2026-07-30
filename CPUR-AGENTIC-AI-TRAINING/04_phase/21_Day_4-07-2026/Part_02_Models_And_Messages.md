# Part 2: Models and Messages - Andar Ki Baat 🕵️‍♂️

Ab hum samjhenge LangChain ke andar models aur messages kaise kaam karte hain. Dhyan se padhna, agle project me bohot kaam aayega! 😉

## Models Kya Hote Hain? 🤖
Model basically ek AI engine hai jo tumhara input leta hai aur output phekta hai.
**Example:**
* Tumne bola: *"Python kya hai?"*
* Model bola: *"Bhai Python ek mast programming language hai."*

### Models Ke Types:

#### 1. Chat Models 💬
Ye models baatcheet (conversation) ke liye bane hote hain. Ye single prompt nahi, balki messages ki puri list lete hain. Isme "context" bohot tagda hota hai.
- **Kaha Use Hota Hai:** Chatbots, AI Assistants, Customer Support.
- **Examples:** GPT-4, Claude, Gemini.

#### 2. LLM (Large Language Models) 📝
Ye purane wale models hain jo bas text generate karte hain single prompt se. Ek sawaal, ek jawaab.
- **Kaha Use Hota Hai:** Text Completion, Code Generation.

#### Chat Model vs LLM:
| Feature | Chat Model | LLM Model |
| --- | --- | --- |
| **Input** | Messages ki list | Text Prompt |
| **Output** | AI Message | Text |
| **Fayda** | Chatting ke liye best | Text generation ke liye |

#### 3. Embedding Models 🔢
Ye models hamare text ko numbers (vectors) mein convert karte hain. Kyunki computers text nahi, numbers samajhte hain. Semantic search aur Vector Databases mein inki zaroorat padti hai (Jaise jab hum RAG use karte hain).

---

## Messages Ke Types 📨
LangChain Chat Models plain text nahi lete, unhe **Messages** chahiye hote hain. Ye messages hi decide karte hain kon kya bol raha hai.

### 1. HumanMessage (Apna Message) 🙋‍♂️
Jo message hum bhejte hain yani end-user.
```python
from langchain_core.messages import HumanMessage
msg = HumanMessage(content="Aur bhai, kya chal raha hai?")
```

### 2. AIMessage (AI Ka Jawab) 🤖
Jo AI humein reply deta hai.
```python
from langchain_core.messages import AIMessage
msg = AIMessage(content="Sab badhiya bhai, tum batao!")
```

### 3. SystemMessage (AI Ka Role / Prompting) 👮‍♂️
Ye message AI ko batata hai ki use kiski tarah behave karna hai. AI ka "character" define karta hai.
```python
from langchain_core.messages import SystemMessage
msg = SystemMessage(content="Tum ek strict Python teacher ho. Har baat pe daant ke samjhate ho.")
```

### 4. ToolMessage (Tool Ka Output) 🛠️
Jab koi tool (jaise calculator ya web search) answer deta hai to wo ToolMessage ke form mein AI ke paas jata hai, taki AI us data ko samajh ke final answer de.

---

## Chat Model Methods - AI Se Kaam Kaise Karwayen? 🕹️

### 1. invoke()
Ek request bhejo, aur ek single mukammal response lo. Ek hi baar mein pura reply de deta hai.
```python
response = llm.invoke("What is Python?")
print(response.content)
```

### 2. stream()
Agar tumhe response ek saath nahi chahiye, balki typing jaisa effect chahiye (token-by-token), to stream use karo. (Jaise ChatGPT type karta hai)
```python
for chunk in llm.stream("Explain AI"):
    print(chunk.content, end="")
```

### 3. batch()
Bohot saare questions ek saath bhej do aur AI se sabke jawab mangwa lo. Ek sath parallel processing!
```python
responses = llm.batch([
    "Python kya hai?",
    "AI kya hai?",
    "ML kya hai?"
])
```

Dimaag mein baith gaya na? LangChain ke inhi core concepts se tagde apps bante hain boss! 🚀 Aage project wali file check karo!
