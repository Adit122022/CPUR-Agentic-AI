# 📂 Phase 04 - Day 22: Gemini SDK, Embeddings, Vector Databases & Document Processing

Welcome to **Day 22** of the Internship! Aaj hum seekhenge ki **Latest Gemini SDK** kaise use karte hain, **Embeddings** aur **Vector Databases** kya hain, **Semantic Search** kaise kaam karta hai, aur LangChain use karke **Document Processing** (loading, splitting, chunking) kaise perform karte hain.

---

## 🚀 1. Latest Gemini SDK Integration

Google ne naya `google-genai` package introduce kiya hai jo content generation, embeddings, aur function calling ko simplify karta hai.

```python
from google import genai

# Client initialize karein (Latest SDK flow)
client = genai.Client(api_key="YOUR_GEMINI_API_KEY")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Explain AI in 2 lines."
)
print(response.text)
```

---

## 🧠 2. Embeddings Kya Hain? (What are Embeddings?)

**Embeddings** text, images, or audio ka **numerical representation (dense vectors)** hota hai jo unka **semantic meaning (conceptual meaning)** capture karta hai.

> **Definition:**
> `An embedding is a dense vector representation of data that captures its semantic meaning, allowing computers to compare the similarity between different pieces of information.`

### ❌ Keyword Search vs ✅ Semantic Search:
* **Traditional Keyword Search:**
  * Document: *"Python is a programming language."*
  * Query: *"Tell me about coding."*
  * Result: **Not Found** (kyunki "coding" word document mein present nahi hai).
* **Embedding Search (Semantic Search):**
  * Document: *"Python is a programming language."*
  * Query: *"Tell me about coding."*
  * Result: **Found!** (kyunki model samajhta hai ki coding aur programming ki vectors meaning similar hai).

### 📊 Cosine Similarity Score Matrix:
Cosine Similarity do vectors ke beech ka angle measure karti hai.

| Score | Meaning |
| :--- | :--- |
| **1.0** | Exactly same direction (Highly Similar / Synonyms) |
| **0.9** | Very Similar |
| **0.7** | Similar |
| **0.0** | Unrelated (No semantic relationship) |
| **-1.0** | Opposite Direction |

---

## 🗄️ 3. Vector Databases (Vector DBs)

**Vector Database** vectors (embeddings) ko store karne aur unpar **fast similarity search** perform karne ke liye optimized database hota hai.

| Feature | SQL Database 🗄️ | Vector Database 🧠 |
| :--- | :--- | :--- |
| **Data Format** | Rows and Columns (Tables). | Embeddings Vectors. |
| **Query Type** | Exact matching (e.g. `WHERE name='Ali'`). | Semantic Similarity (e.g. Nearest Neighbors). |
| **Language** | SQL. | Vector Similarity Search (Cosine, Dot product). |
| **Use Case** | Structured data. | Unstructured data (Text chunks, PDF elements). |
| **Examples** | MySQL, PostgreSQL, SQLite. | ChromaDB, FAISS, Pinecone. |

### 🔄 RAG (Retrieval-Augmented Generation) Pipeline:
```
Documents ──► Load ──► Split/Chunk ──► Embeddings Model ──► Vectors ──► Vector DB
                                                                           │
User Question ──► Query Embedding ────────────────────────► Similarity Search ◄┘
                                                                 │
Answer ◄── LLM (Generate) ◄── Prompt Context ◄── Top Match Chunks ┘
```

---

## 📄 4. Document Processing & Loaders (LangChain)

Bade documents (jaise 500-page PDF book) ko directly LLMs ko nahi bhej sakte kyunki ye **slow, expensive** hota hai aur **context window exceed** kar sakta hai. Isliye hum text chunks banate hain.

### 📥 Document Loaders:
LangChain different file formats ko read karne ke liye classes provide karta hai:
1. **PDF Loader:** `PyPDFLoader("sample.pdf")`
2. **CSV Loader:** `CSVLoader("data.csv")`
3. **Web Loader:** `WebBaseLoader("https://example.com")`

### ✂️ Text Splitter (`RecursiveCharacterTextSplitter`):
Text ko predefined boundary bounds (jaise paragraphs, sentences, words) par split karta hai taaki meaning break na ho:
* **`chunk_size`**: Har chunk mein max character limit (e.g. 500).
* **`chunk_overlap`**: Chunks ke beech common character memory buffer (e.g. 100) taaki context loose na ho.

---

## 📓 Practical Notebook
Is folder ke [day22_notebook.ipynb](./day22_notebook.ipynb) notebook ko refer karein jismein niche diye gaye topics ka live Python execution present hai:
* Gemini 2.5 API calls via new SDK
* Gemini Embeddings generation using `gemini-embedding-001`
* Document loading and chunking simulation using `RecursiveCharacterTextSplitter`
* Text Semantic Similarity Search using `sentence-transformers` & `sklearn`

* 🖊️ **Asif Sir's Class Colab Notebook:** [Google Colab Link](https://colab.research.google.com/drive/1mu-jeF5cr8ddKrx6uGwiYzqZHxoxa7R6?usp=sharing#scrollTo=HkKj3aE2eYVP)

