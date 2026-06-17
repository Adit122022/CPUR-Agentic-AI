# 🐼 Day 7 — Pandas: Panel Data Ka Bhaap!
### 📅 Date: 17 June 2026 (Wednesday) | CPUR Agentic AI Internship

> *"Pandas ne Data Science ko aasaan bana diya — ab cleaning, filtering, aur analysis sab ek jagah!"* 🐼

---

## 📁 Folder Structure

```
07_Day_17-06-2026/
│
├── 📓 07_Numpy.ipynb         ← NumPy Indexing & Aggregate Revision
├── 📓 07_pandas.ipynb        ← Pandas Series & DataFrame
├── 📂 DataSet/
│   └── wed17.csv             ← Real-world CSV dataset used in class
│
└── 📄 Readme.md              ← Ye document jo tu abhi padh raha hai 🤓
```

---

## 🎯 Aaj Ka Agenda (What's Cooking Today? 🍳)

```
┌────────────────────────────────────────────────────────────────────────┐
│                 DAY 7 — PANDAS LIBRARY  🐼                             │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Pandas      │  │   Series     │  │DataFrame │  │  Real-World   │  │
│  │  Intro       │  │  1D labeled  │  │  2D Table│  │  CSV Reading  │  │
│  │  🐼 Why?     │  │  📊 indexed  │  │  📋 rows │  │  📂 wed17.csv │  │
│  └──────────────┘  └──────────────┘  └──────────┘  └───────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

# 🐼 Part 1: Introduction to Pandas

> **Pandas** is an open-source Python library used for **data manipulation, data analysis, and data cleaning**.

The name **Pandas** comes from **"Panel Data"** — a term used in statistics and economics.

```python
import pandas as pd
import numpy as np
```

**Why was Pandas created?**

Before Pandas, handling large datasets in Python was difficult. Pandas simplifies:

| Task | Without Pandas | With Pandas |
|------|---------------|-------------|
| Reading data | Complex file I/O | `pd.read_csv()` ✅ |
| Cleaning data | Manual loops | `dropna()`, `fillna()` ✅ |
| Filtering data | List comprehensions | Boolean indexing ✅ |
| Analysis | Custom code | `describe()`, `groupby()` ✅ |

---

## 📐 Main Data Structures in Pandas

### 1. Series — 1D Labeled Array

```
Index | Value
  0   |  10
  1   |  20
  2   |  30
```

### 2. DataFrame — 2D Table

```
Name  | Age | City
Ali   |  20 | Jaipur
Sara  |  22 | Delhi
John  |  25 | Mumbai
```

---

## 🌟 Why Pandas is Used in Data Science?

Data Scientists spend most of their time working with data. Before building ML models, data must be:

```
1. Collected   → pd.read_csv(), pd.read_excel()
2. Cleaned     → dropna(), fillna(), drop_duplicates()
3. Organized   → sort_values(), groupby()
4. Analyzed    → describe(), mean(), corr()
5. Prepared    → loc[], iloc[], merge(), concat()
```

---

## ⚡ Features of Pandas

### 1. Easy Data Import
```python
pd.read_csv("file.csv")       # CSV files
pd.read_excel("file.xlsx")    # Excel files
pd.read_json("file.json")     # JSON files
pd.read_sql(query, conn)      # SQL databases
```

### 2. Data Cleaning
```python
df.dropna()           # Remove missing values
df.fillna(0)          # Fill missing with 0
df.drop_duplicates()  # Remove duplicates
```

### 3. Data Filtering
```python
df[df["marks"] > 80]         # Students with marks > 80
df[df["salary"] > 50000]     # High earners
```

### 4. Data Aggregation
```python
df["salary"].sum()
df["marks"].mean()
df.groupby("department")["salary"].mean()
```

---

# 📊 Part 2: Pandas Series

## What is a Series?

> A **Series** is a **one-dimensional labeled array** capable of holding any data type.

```
┌───────────────────────────────────┐
│         SERIES ANATOMY            │
│                                   │
│   Index  │  Values                │
│   ──────   ──────                 │
│     a    │   10    ← Label-based  │
│     b    │   20                   │
│     c    │   30                   │
│     d    │   40                   │
│     e    │   50                   │
│                                   │
│  dtype: int64                     │
└───────────────────────────────────┘
```

---

## Creating a Series

### From a List
```python
import pandas as pd

l = [90, 80, 70, 60, 50]
s2 = pd.Series(l)
print(s2)
# 0    90
# 1    80
# 2    70
# ...
```

### From a Tuple
```python
t = (90, 80, 70, 60, 50)
s3 = pd.Series(t)
```

### From a Dictionary
```python
d = {
    "name": "Aditya",
    "Status": "Duniya ka papa",
    "age": "ant se anant tak"
}
s1 = pd.Series(d)
print(s1)
# name              Aditya
# Status    Duniya ka papa
# age     ant se anant tak
# dtype: object
```

### From a NumPy Array (with Custom Index)
```python
import numpy as np

n1 = np.array([10, 20, 30, 40, 50])

# Default index
s4 = pd.Series(n1)

# Custom string index
s4 = pd.Series(n1, index=["a", "b", "c", "d", "e"])

# Access by label
print(s4["c"])            # 30
print(s4[["a", "c", "e"]])  # 10, 30, 50
```

### From arange with Custom Index
```python
lable = ["A", "B", "C", "D", "E"]
s1 = pd.Series(np.arange(10, 51, 10), index=lable, name="DAtA_OF DAtA")
print(s1)
# A    10
# B    20
# C    30
# D    40
# E    50
# Name: DAtA_OF DAtA, dtype: int64
```

---

## 🔪 Accessing Data in a Series

```python
s1 = pd.Series(np.arange(2, 20, 2))
print(s1)

# By position (integer index)
print(s1[0])      # First element
print(s1[-1])     # Last element (negative indexing)
print(s1[1:5])    # Slice — elements 1 to 4
print(s1[::-1])   # Reverse the series
print(s1[0::2])   # Every alternate element
```

---

## 📋 Series Attributes

```python
s1 = pd.Series([10, 20, 30, 40, 50],
               index=["a", "b", "c", "d", "e"],
               name="Series")

print(s1.index)    # Index(['a','b','c','d','e'], dtype='object')
print(s1.values)   # [10 20 30 40 50]
print(s1.dtype)    # int64
print(s1.shape)    # (5,)
print(s1.size)     # 5
print(s1.ndim)     # 1
print(s1.name)     # Series
```

| Attribute | Returns | Description |
|-----------|---------|-------------|
| `.index` | Index object | All labels |
| `.values` | NumPy array | Raw data |
| `.dtype` | dtype | Data type |
| `.shape` | tuple | Dimensions |
| `.size` | int | Total elements |
| `.ndim` | int | Number of dimensions |
| `.name` | str | Series name |

---

## ➕ Aggregation Functions on Series

```python
lable = ["A", "B", "C", "D", "E"]
s1 = pd.Series(np.arange(10, 51, 10), index=lable, name="DAtA_OF DAtA")

print("Sum          :", sum(s1))            # 150
print("Mean         :", s1.mean())          # 30.0
print("Median       :", s1.median())        # 30.0
print("MAX          :", s1.max())           # 50
print("MIN          :", s1.min())           # 10
print("Count        :", s1.count())         # 5
print("Std Dev      :", round(s1.std(), 2)) # 15.81
print("Variance     :", s1.var())           # 250.0
```

**All Aggregation Methods:**

| Method | Description |
|--------|-------------|
| `sum()` | Total sum |
| `mean()` | Average |
| `median()` | Middle value |
| `mode()` | Most frequent |
| `min()` | Minimum |
| `max()` | Maximum |
| `count()` | Non-null count |
| `std()` | Standard deviation |
| `var()` | Variance |

---

## 🔃 Sorting Series

```python
s1.sort_values()                   # Sort by values ascending
s1.sort_values(ascending=False)    # Sort by values descending
s1.sort_index()                    # Sort by index
s1.sort_index(ascending=False)     # Sort by index descending
```

---

## Series vs List — Quick Comparison

| Feature | Python List | Pandas Series |
|---------|-------------|---------------|
| Index | Positional only | Custom labels |
| Data Type | Mixed | Consistent |
| Math Ops | Loops needed | Vectorized |
| Missing Values | No built-in | `NaN` support |
| Speed | Slower | Faster (NumPy-backed) |

---

# 📋 Part 3: Pandas DataFrame

## What is a DataFrame?

> A **DataFrame** is a **two-dimensional, size-mutable, labeled data structure** — like a spreadsheet or SQL table.

```
┌────────────────────────────────────────────┐
│           DATAFRAME ANATOMY                │
│                                            │
│        name   city    age                  │
│   0    asif   agra     27   ← Row (index)  │
│   1    amit   jaipur   23                  │
│   2    mohit  kota     45                  │
│   3  himanshu delhi    34                  │
│         ↑                                  │
│      Column                                │
└────────────────────────────────────────────┘
```

---

## Creating a DataFrame

### From a Dictionary (Most Common)
```python
import pandas as pd

d = {
    "name": ["asif", "amit", "mohit", "himanshu"],
    "city": ["agra", "jaipur", "kota", "delhi"],
    "age":  [27, 23, 45, 34]
}
df = pd.DataFrame(d)
print(df)
#       name    city  age
# 0     asif    agra   27
# 1     amit  jaipur   23
# 2    mohit    kota   45
# 3  himanshu  delhi   34
```

### From a CSV File
```python
file = pd.read_csv("wed17.csv")
print(file)
```

### From a NumPy Array
```python
arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
df = pd.DataFrame(arr, columns=["A", "B", "C"])
```

---

## 📋 DataFrame Attributes

```python
df = pd.read_csv("wed17.csv")

print(df.index)    # RangeIndex
print(df.columns)  # Column names
print(df.dtypes)   # Data types of each column
print(df.shape)    # (rows, columns)
print(df.size)     # Total elements
print(df.ndim)     # 2
print(df.values)   # NumPy array of all values
print(df.axes)     # [row labels, column labels]
```

| Attribute | Description |
|-----------|-------------|
| `.index` | Row labels |
| `.columns` | Column names |
| `.dtypes` | Data types per column |
| `.shape` | `(rows, cols)` tuple |
| `.size` | Total number of elements |
| `.ndim` | Number of dimensions (always 2) |
| `.values` | NumPy array representation |
| `.axes` | List of axes |

---

## 👀 Viewing Data

```python
df.head()       # First 5 rows (default)
df.head(10)     # First 10 rows
df.tail()       # Last 5 rows
df.tail(3)      # Last 3 rows
df.sample()     # 1 random row
df.sample(5)    # 5 random rows
df.info()       # Column types, null counts, memory
df.describe()   # Statistical summary (numeric columns)
```

---

## 🎯 Column & Row Selection

### Column Selection
```python
df["name"]               # Single column → Series
df[["name", "city"]]     # Multiple columns → DataFrame
df.columns               # List of all column names
```

### Row Selection (iloc — Integer-based)
```python
df.iloc[0]        # First row
df.iloc[-1]       # Last row
df.iloc[0:3]      # First 3 rows
df.iloc[[0, 2]]   # Row 0 and row 2
```

### Row Selection (loc — Label-based)
```python
df.loc[0]                       # Row with index label 0
df.loc[0:2]                     # Rows 0 to 2 (inclusive!)
df.loc[0, "name"]               # Specific cell
df.loc[0:2, ["name", "city"]]   # Rows 0–2, selected columns
```

---

## 🔍 Filtering Data

```python
# Single condition
df[df["age"] > 30]

# Multiple conditions — AND
df[(df["age"] > 25) & (df["city"] == "agra")]

# Multiple conditions — OR
df[(df["age"] < 25) | (df["city"] == "delhi")]

# Membership filter
df[df["city"].isin(["agra", "delhi"])]
```

---

## 🔃 Sorting Data

```python
df.sort_values("age")                      # Ascending by age
df.sort_values("age", ascending=False)     # Descending by age
df.sort_values(["city", "age"])            # Multi-column sort
df.sort_index()                            # Sort by index
```

---

## 🛠️ Data Transformation

```python
# Add a new column
df["salary"] = [50000, 60000, 45000, 70000]

# Rename columns
df.rename(columns={"name": "Name", "age": "Age"}, inplace=True)

# Drop a column
df.drop("salary", axis=1, inplace=True)

# Drop a row
df.drop(0, axis=0, inplace=True)
```

---

## 🧹 Handling Missing Values

```python
df.isnull()           # Boolean mask of nulls
df.isnull().sum()     # Count of nulls per column
df.dropna()           # Remove rows with any null
df.fillna(0)          # Fill nulls with 0
df.fillna(df.mean())  # Fill with column mean
```

---

## 📊 Aggregation on DataFrame

```python
df["age"].sum()
df["age"].mean()
df["age"].median()
df["age"].min()
df["age"].max()
df["age"].count()
df["age"].std()
df["age"].var()
df.describe()          # Summary stats for all numeric columns
```

---

## 📂 Exporting Data

```python
df.to_csv("output.csv", index=False)       # Export to CSV
df.to_excel("output.xlsx", index=False)    # Export to Excel
df.to_json("output.json")                  # Export to JSON
```

---

## 🌍 Real-World Applications

| Domain | Example Use Case |
|--------|-----------------|
| 🎓 Education | Student Marks Analysis |
| 💼 HR | Employee Management System |
| 🛒 E-Commerce | Sales Analysis, Customer Segmentation |
| 🏦 Banking | Fraud Detection, Loan Risk Analysis |
| 🏥 Healthcare | Patient Data Analysis |
| 🌐 Social Media | Sentiment Analysis |

---

## 🧠 Aaj Ka Mind Map

```
                        PANDAS
                          │
           ┌──────────────┴──────────────┐
           │                             │
        Series                      DataFrame
     (1-Dimensional)             (2-Dimensional)
           │                             │
    ┌──────┴──────┐              ┌───────┴───────┐
    │             │              │               │
  Creating    Accessing       Creating       Operations
    │             │              │               │
  List        Position        dict          loc / iloc
  Tuple       Label           CSV           filter
  Dict        Slice           Excel         sort
  NumPy       Fancy           NumPy         groupby
```

---

## 📝 Asif Sir's Classroom Notes

> *In-class notes and live demonstrations shared by our instructor during the session.*

| Resource | Link |
|----------|------|
| 🖊️ **Asif Sir's Colab Notebook — Day 7** | [![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1PGMhHbqM5V9pZ9LVRGAzSZ13sptPWUkW?usp=sharing) |

---

## 🔗 Resources & Notebooks

- 📓 NumPy Revision Notebook: [07_Numpy.ipynb](07_Numpy.ipynb)
- 📓 Pandas Notebook: [07_pandas.ipynb](07_pandas.ipynb)
- 📂 Dataset: [DataSet/](DataSet/)
- 🐼 Pandas Official Docs: https://pandas.pydata.org/docs/
- 🐍 10 Minutes to Pandas: https://pandas.pydata.org/docs/user_guide/10min.html

---

*Banaya with 💙, thoda groupby 🔄 aur ek DataFrame jo apne aap ko automatically index karta raha! | CPUR Agentic AI Internship | Day 7 — 17 June 2026*
