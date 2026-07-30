# 🔬 Day 6 — Data Science Lifecycle & NumPy: From Raw Data to Intelligence!
### 📅 Date: 16 June 2026 (Tuesday) | CPUR Agentic AI Internship

> *"Data Science is the process of converting raw data into meaningful information and actionable insights."* 📊

---

## 📁 Folder Structure

```
06_Day_16-06-2026/
│
├── 📓 NoteBook/
│   ├── 06_DataScience.ipynb     ← Data Science Lifecycle Theory
│   └── 06_NumPY.ipynb           ← NumPy Arrays, Indexing & Operations
│
└── 📄 Readme.md                 ← Ye document jo tu abhi padh raha hai 🤓
```

---

## 🎯 Aaj Ka Agenda (What's Cooking Today? 🍳)

```
┌─────────────────────────────────────────────────────────────────────────┐
│              DAY 6 — DATA SCIENCE + NUMPY  🔢                           │
│                                                                         │
│  ┌──────────────┐  ┌───────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │  Data Science│  │  NumPy    │  │  Array   │  │   Mathematical     │ │
│  │  Lifecycle   │  │  Intro    │  │  Types   │  │   Operations       │ │
│  │  🔄 9 Steps  │  │  📦 Fast  │  │ 1D,2D,3D │  │   ➕➖✖️➗           │ │
│  └──────────────┘  └───────────┘  └──────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 🔄 Part 1: Lifecycle of Data Science

> A Data Science project follows a step-by-step process called **the Data Science Lifecycle**. Each step builds on the previous one.

```
┌─────────────────────────────────────────────────────────────────┐
│               DATA SCIENCE LIFECYCLE  🔄                        │
│                                                                 │
│  1. Problem Understanding  →  2. Data Collection               │
│           ↓                                                     │
│  9. Monitoring & Improvement  ←  8. Deployment                 │
│           ↓                            ↓                       │
│  3. Data Cleaning  →  4. EDA  →  5. Visualization              │
│                                        ↓                       │
│                        6. Model Building  →  7. Evaluation     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Step 1: Problem Understanding

> **Before collecting data, we must understand the problem.**

**Questions to Ask:**
- What is the **business problem**?
- What is the **objective**?
- What is the **expected outcome**?
- How will **success be measured**?

**Real-World Example:**
```
Business Problem : Sales are decreasing.
Question         : Why are customers leaving?
Goal             : Identify customers likely to leave and take action.
```

> ⚠️ **Without understanding the problem, even the best data and models are useless.**

---

## 📦 Step 2: Data Collection

> Once the problem is clear, the next step is collecting **relevant data**.

**Data Sources:**

| # | Source | Example |
|---|--------|---------|
| 1 | Databases | MySQL, PostgreSQL |
| 2 | Company ERP Systems | SAP, Oracle |
| 3 | Websites | Web Scraping |
| 4 | APIs | REST APIs, JSON feeds |
| 5 | Sensors & IoT Devices | Smart devices |
| 6 | Social Media | Twitter, Instagram |
| 7 | Excel / CSV Files | Local datasets |

**Example — Customer Churn Prediction:**
```
Collect:
• Customer Name
• Age
• Purchase History
• Last Purchase Date
• Total Spending
• Customer Feedback
```

**Data Engineer Role:**
```
Tasks:
✔ Build Data Pipelines
✔ Create Data Warehouses
✔ Manage Databases
✔ Handle Big Data

Tools: Python, SQL, Spark, Kafka, AWS
```

---

## 🧹 Step 3: Data Cleaning

> Real-world data is messy. Cleaning is **the most time-consuming step** in Data Science.

**Common Problems:**

| Problem | Example |
|---------|---------|
| ❌ Missing Values | Age column empty |
| ❌ Duplicate Records | Same row twice |
| ❌ Wrong Entries | Age = -5 |
| ❌ Outliers | Salary = ₹99,99,99,999 |
| ❌ Inconsistent Formats | "01-Jan" vs "2026-01-01" |

**Example:**
```
Name     Age
Aman     20
Riya            ← Missing age!
Aman     20     ← Duplicate!

Cleaning Activities:
✔ Remove duplicates
✔ Fill missing values
✔ Correct data types
✔ Standardize formats
✔ Handle outliers
```

> 📌 **Rule: Data Scientists spend nearly 70–80% of their time cleaning data.**

---

## 🔍 Step 4: Data Analysis (EDA)

> **EDA = Exploratory Data Analysis**
> Goal: Understand the data **before** building models.

**Key Questions:**
- What **patterns** exist?
- What **trends** are visible?
- Which **variables** are important?
- Are there **relationships** between features?

**Analysis Techniques:**

| Technique | Purpose |
|-----------|---------|
| Mean / Median / Mode | Central tendency |
| Correlation | Relationship between variables |
| Distribution Analysis | How data is spread |
| Trend Analysis | Changes over time |

**Example:**
```python
# Find:
# • Average customer spending
# • Most popular product
# • Best-performing city
```

> 👥 **Role: Data Analyst + Data Scientist**

---

## 📊 Step 5: Data Visualization

> *"Humans understand pictures better than tables."*

**Common Charts:**

| Chart | Use Case |
|-------|----------|
| 📊 Bar Chart | Compare categories |
| 📈 Line Chart | Show trends over time |
| 🥧 Pie Chart | Show proportions |
| 📉 Histogram | Show distribution |
| 🔵 Scatter Plot | Show relationships |
| 🌡️ Heatmap | Show correlation matrix |

**Example:**
```
Sales Data:
Jan  ₹10,000
Feb  ₹15,000
Mar  ₹22,000

A line graph instantly shows growth! 📈
```

**Tools:**

```
Visualization Tools:
┌──────────────┬──────────────────────────────────┐
│ Matplotlib   │ Basic Python charts              │
│ Seaborn      │ Statistical visualizations       │
│ Plotly       │ Interactive charts               │
│ Tableau      │ Business Intelligence dashboards │
│ Power BI     │ Microsoft BI tool                │
└──────────────┴──────────────────────────────────┘
```

---

## 🤖 Step 6: Model Building (Introduction)

> This is where **Machine Learning begins**!
> Goal: Use historical data to make **predictions**.

**Real-World Examples:**
```
Netflix  → Predicts movies you may like
Amazon   → Predicts products you may buy
Bank     → Predicts loan default risk
```

**Types of ML Models:**

| Type | Task | Example |
|------|------|---------|
| 🔢 Regression | Predict numbers | House price prediction |
| 🏷️ Classification | Predict categories | Spam or Not Spam |
| 🔵 Clustering | Group similar data | Customer Segmentation |

---

## ✅ Step 7: Model Evaluation

> Modern Data Science doesn't stop after building a model — we must **test performance**.

**Evaluation Metrics:**

| Metric | Use Case |
|--------|----------|
| Accuracy | Overall correctness |
| Precision | Of predicted positives, how many are correct |
| Recall | Of actual positives, how many were found |
| F1 Score | Balance of Precision & Recall |
| RMSE | Error in regression models |

**Example:**
```
If a model predicts customer churn with 92% accuracy → Effective! ✅
```

---

## 🚀 Step 8: Deployment (Modern Industry Step)

> After testing, the model is **deployed for real users**.

```
Role  : Machine Learning Engineer
Tools : Flask, FastAPI, Docker, AWS, Azure
Output: Live AI System 🚀
```

---

## 🔁 Step 9: Monitoring & Improvement

> Models become **outdated over time**. Customer behavior changes. New data arrives daily.

```
Therefore:
✔ Monitor performance
✔ Retrain model
✔ Improve accuracy
✔ Update data

Example: Google Maps continuously updates traffic predictions.
```

---

# 📦 Part 2: NumPy — Numerical Python

> **NumPy** = **Numerical Python** — a powerful library for fast scientific computing.

NumPy is written in **C, C++, and Fortran** — making it much faster than pure Python.

**Used for:**
- 🔬 Scientific Computing
- 📊 Data Analysis
- 🤖 Machine Learning & AI
- 🔢 Mathematical Operations

---

## ⚡ Why NumPy? — Python Lists vs NumPy Arrays

| Feature | Python List | NumPy Array |
|---------|-------------|-------------|
| ⚡ Speed | Slow | **Fast** |
| 💾 Memory Usage | More | **Less** |
| ➕ Mathematical Operations | Difficult | **Easy** |
| 🏷️ Data Type | Mixed Allowed | Same Type Preferred |
| 📐 Multi-Dimensional | Limited | **Excellent** |
| 🔬 Scientific Computing | Not Suitable | **Designed For It** |

**Side-by-Side Comparison:**

```python
# ❌ Python List — Manual loop needed
a = [1, 2, 3]
b = [4, 5, 6]
result = []
for i in range(len(a)):
    result.append(a[i] + b[i])
print(result)   # [5, 7, 9]

# ✅ NumPy — One-liner!
import numpy as np
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(a + b)    # [5 7 9]
```

```python
# ❌ Python List — Multiply each element
numbers = [1, 2, 3, 4, 5]
result = [num * 2 for num in numbers]
print(result)   # [2, 4, 6, 8, 10]

# ✅ NumPy — Vectorized!
numbers = np.array([1, 2, 3, 4, 5])
print(numbers * 2)   # [ 2  4  6  8 10]
```

---

## 💾 Installing & Importing NumPy

```bash
# Step 1: Check Python version
python --version

# Step 2: Install NumPy
pip install numpy

# Step 3: Upgrade NumPy (optional)
pip install --upgrade numpy

# Step 4: Check installed version
pip show numpy
```

```python
# Import NumPy
import numpy as np

# Check version
print(np.__version__)   # e.g., 2.3.0
```

---

## 🧮 Creating Arrays

### 1D Array
```python
d1 = np.array([10, 20, 30, 40, 50])
print(d1.ndim)      # 1
print(d1.shape)     # (5,)
print(d1.size)      # 5
print(d1.dtype)     # int64
print(d1.itemsize)  # 8 (bytes per element)
```

### 2D Array
```python
d2 = np.array([
    [1, 2, 3],
    [8, 9, 0],
    [3, 4, 5]
])
print(d2.shape)   # (3, 3)
print(d2.ndim)    # 2
print(d2.size)    # 9
```

### 3D Array
```python
d3 = np.array([
    [[1, 2, 3], [8, 9, 0], [3, 4, 5]],
    [[1, 2, 3], [8, 9, 0], [3, 4, 5]],
    [[1, 2, 3], [8, 9, 0], [3, 4, 5]],
])
print(d3.ndim)    # 3
print(d3.shape)   # (3, 3, 3)
```

---

## ➕ Mathematical Operations

```python
d1 = np.array([10, 20, 30])
d2 = np.array([11, 12, 13])

print(d1 + d2)   # [21 32 43]  ← Element-wise addition
print(d1 + 5)    # [15 25 35]  ← Scalar addition (Broadcasting)
print(d2 - 5)    # [ 6  7  8]  ← Scalar subtraction
```

**Supported Operations:**
```
➕ Addition          d1 + d2
➖ Subtraction       d1 - d2
✖️  Multiplication   d1 * d2
➗ Division         d1 / d2
🔢 Floor Division   d1 // d2
🔣 Modulus          d1 % d2
🔝 Power            d1 ** 2
```

---

## 🏗️ Array Creation Functions

```python
import numpy as np

# zeros() — Array of zeros
z1 = np.zeros(5, dtype=str)          # ['', '', '', '', '']
z2 = np.zeros((3, 4))                # 3x4 matrix of 0.0
z3 = np.zeros((3, 4, 2), dtype=bool) # 3D bool array of False

# ones() — Array of ones
o1 = np.ones((3, 3))

# arange() — Like Python range()
a1 = np.arange(3, 10, 2)    # [3 5 7 9]

# linspace() — Evenly spaced numbers
l1 = np.linspace(0, 1, 5)   # [0. 0.25 0.5 0.75 1.]

# empty() — Uninitialized array (garbage values)
e1 = np.empty((2, 3))

# full() — Fill with a specific value
f1 = np.full((3, 3), 7)     # 3x3 matrix of 7s

# eye() / identity() — Identity matrix
i1 = np.eye(3)              # 3x3 identity matrix

# random.rand() — Random floats [0, 1)
r1 = np.random.rand(3, 3)

# random.randint() — Random integers
r2 = np.random.randint(0, 100, (3, 3))

# reshape — Change array shape
a = np.arange(12).reshape(3, 4)  # 1D → 3x4 2D
```

---

## 🔪 Array Slicing Cheat Sheet

### 1D Array Slicing

| Operation | Syntax | Description |
|-----------|--------|-------------|
| Entire Array | `arr[:]` | All elements |
| First Element | `arr[0]` | Index 0 |
| Last Element | `arr[-1]` | Last index |
| First 3 | `arr[:3]` | Indices 0–2 |
| Last 3 | `arr[-3:]` | Last 3 |
| Index 2 to 5 | `arr[2:6]` | Slice |
| Every 2nd | `arr[::2]` | Step of 2 |
| Reverse | `arr[::-1]` | Reversed |
| Negative Slice | `arr[-5:-1]` | Negative indexing |

### 2D Array — Row Operations

| Operation | Syntax |
|-----------|--------|
| First Row | `arr[0]` |
| Last Row | `arr[-1]` |
| First Two Rows | `arr[0:2]` |
| Select Row 1 | `arr[1,:]` |
| All Rows | `arr[:,:]` |

### 2D Array — Column Operations

| Operation | Syntax |
|-----------|--------|
| First Column | `arr[:,0]` |
| Last Column | `arr[:,-1]` |
| First Two Columns | `arr[:,0:2]` |
| Alternate Columns | `arr[:,::2]` |

### Row + Column Selection

| Operation | Syntax |
|-----------|--------|
| Row 0, Col 0 | `arr[0,0]` |
| Row 1, Col 2 | `arr[1,2]` |
| First 2 rows, First 2 cols | `arr[0:2,0:2]` |
| Sub-matrix | `arr[1:3,2:4]` |
| All rows, cols 1–2 | `arr[:,1:3]` |

### 3D Array Selection

| Operation | Syntax |
|-----------|--------|
| First Block | `arr[0]` |
| First Row of First Block | `arr[0,0]` |
| Specific Element | `arr[0,1,2]` |
| Entire First Block | `arr[0,:,:]` |
| First Column of First Block | `arr[0,:,0]` |

**Code Examples:**
```python
d3 = (np.random.rand(3, 4) * 100).astype(int)

# Access element at row 2, column -3 (third from last)
print(d3[2, -3])

# Access entire column -3 (third from last)
print(d3[:, -3])
```

---

## 📊 Aggregation Functions

```python
d1 = np.array([10, 11, 13, 12, 10])

print(sum(d1))          # Python built-in sum
print(np.sum(d1))       # NumPy sum — faster for large arrays
print(np.median(d1))    # Median value

# Using dot notation
a = np.array([10, 20, 30, 40, 50, 60, 80])
print("Mean         :", a.mean())    # 41.43
print("Std Dev      :", a.std())     # 22.31
print("Variance     :", a.var())     # 497.96
print("Min          :", a.min())     # 10
print("Max          :", a.max())     # 80
```

**All Aggregation Functions:**

| Function | Description |
|----------|-------------|
| `np.sum()` | Sum of all elements |
| `np.mean()` | Arithmetic mean |
| `np.median()` | Median value |
| `np.min()` | Minimum value |
| `np.max()` | Maximum value |
| `np.std()` | Standard deviation |
| `np.var()` | Variance |

---

## 💡 Practical Programs List

1. 📐 Create a NumPy Array — 1D, 2D, 3D
2. 🔍 Find Shape and Dimensions
3. 🎯 Array Indexing Example
4. ✂️ Array Slicing Example
5. ➕ Sum of Array Elements
6. 📊 Average Marks Calculator
7. 🔝 Find Maximum and Minimum Value
8. 🎓 Student Marks Analysis
9. 🔢 Even Numbers Array
10. ✖️ Multiplication Table using NumPy

---

## 🧠 Aaj Ka Mind Map

```
                         NUMPY
                           │
        ┌──────────────────┼─────────────────┐
        │                  │                 │
  Array Types       Operations         Functions
        │                  │                 │
  ┌─────┴─────┐     ┌──────┴──────┐   ┌──────┴──────┐
  │  1D Array │     │ +  -  *  /  │   │  zeros()    │
  │  2D Array │     │ //  %  **   │   │  ones()     │
  │  3D Array │     │ Broadcasting│   │  arange()   │
  └───────────┘     └─────────────┘   │  linspace() │
                                      │  reshape()  │
                                      └─────────────┘
```

---

## 📝 Asif Sir's Classroom Notes

> *In-class notes and live demonstrations shared by our instructor during the session.*

| Resource | Link |
|----------|------|
| 🖊️ **Asif Sir's Colab Notebook — Day 6** | [![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/12NsDMHqx4-EueHisRD-u82WA_rdddmT5?usp=sharing) |

---

## 🔗 Resources & Notebooks

- 📓 Data Science Lifecycle Notebook: [06_DataScience.ipynb](NoteBook/06_DataScience.ipynb)
- 📓 NumPy Notebook: [06_NumPY.ipynb](NoteBook/06_NumPY.ipynb)
- 🐍 NumPy Official Docs: https://numpy.org/doc/
- 🐍 NumPy User Guide: https://numpy.org/doc/stable/user/

---

*Banaya with 💙, thoda broadcasting 📡 aur ek array jo khud ko automatically vectorize karta raha! | CPUR Agentic AI Internship | Day 6 — 16 June 2026*
