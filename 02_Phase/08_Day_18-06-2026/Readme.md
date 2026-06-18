# 📊 Day 8 — Pandas Data Loading & Matplotlib Visualizations 📈
### 📅 Date: 18 June 2026 (Thursday) | CPUR Agentic AI Internship

> *"Data ko load karne se lekar, use visually represent karne tak — Aaj humne sikha Pandas File Readers aur Matplotlib Plots ka combination!"* 🐼🎨

---

## 📁 Folder Structure

```
08_Day_18-06-2026/
│
├── 📓 Notebook/
│   ├── 08_pandas.ipynb         ← Pandas Data Loading & Viewing
│   └── 08_matplotlib.ipynb     ← Matplotlib Line Plots & Bar Charts
├── 📂 DataSet/
│   ├── train.csv               ← Titanic Training Dataset
│   ├── test.csv                ← Titanic Testing Dataset
│   ├── gender_submission.csv   ← Titanic Submission Format
│   ├── student.xlsx            ← Excel sheet example
│   └── excel_data/
│       └── Cola.xlsx           ← Excel dataset used in class
│
└── 📄 Readme.md                ← Ye document jo tu abhi padh raha hai 🤓
```

---

## 🎯 Aaj Ka Agenda (What's Cooking Today? 🍳)

```
┌────────────────────────────────────────────────────────────────────────┐
│             DAY 8 — DATA LOADING & VISUALIZATION                       │
│                                                                        │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ Pandas Readers  │  │ Data Viewing │  │  Matplotlib  │  │ Bar &    │  │
│  │ CSV, Excel,     │  │ head, tail,  │  │ Line Plots   │  │ H-Bars   │  │
│  │ JSON, TSV, SQL  │  │ info, shape  │  │ customization│  │ styling  │  │
│  └────────────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

# 🐼 Part 1: Reading Files in Pandas

Pandas can read data from many different formats. In this session, we explored how to load datasets from various formats and configure details like headers, column selections, rows limit, and custom delimiters.

### 📋 Support File Formats Table

| File Type | Extension | Function |
| :--- | :--- | :--- |
| **CSV** | `.csv` | `pd.read_csv(filepath)` |
| **Excel** | `.xlsx`, `.xls` | `pd.read_excel(filepath)` |
| **JSON** | `.json` | `pd.read_json(filepath)` |
| **HTML** | `.html` | `pd.read_html(filepath)` |
| **XML** | `.xml` | `pd.read_xml(filepath)` |
| **Text File** | `.txt`, `.tsv` | `pd.read_table(filepath)` |
| **SQL Database**| `.db`, `.sql` | `pd.read_sql(query, connection)`|

---

## 📂 1.1 CSV Files (`read_csv`)
`read_csv()` is used to read data from Comma-Separated Values files and load them into a DataFrame.

### Core Parameters & Syntax:
```python
import pandas as pd

# 1. Simple Load
df = pd.read_csv("students.csv")

# 2. Read only First N Rows
df = pd.read_csv("students.csv", nrows=2)

# 3. Read Specific Columns
df = pd.read_csv("students.csv", usecols=["Name", "Marks"])

# 4. Custom Column Names
df = pd.read_csv("students.csv", names=["ID", "Student", "Age", "Score", "Location"])

# 5. Skip Header Row
df = pd.read_csv("students.csv", header=None)

# 6. Skip Initial Rows
df = pd.read_csv("students.csv", skiprows=2)

# 7. Force Column Data Type
df = pd.read_csv("students.csv", dtype={"Age": float})

# 8. Specify Separator (Delimiter)
df = pd.read_csv("students.csv", sep=",")
df_semicolon = pd.read_csv("students_semicolon.csv", sep=";")

# 9. Read Tab Separated Values (TSV)
df_tsv = pd.read_csv("students.tsv", sep="\t")
```

---

## 📂 1.2 Excel Files (`read_excel`)
Loads data from Excel files (`.xlsx` or `.xls`) into a DataFrame.

### Core Parameters & Syntax:
```python
# 1. Load Excel File
df = pd.read_excel("students.xlsx")

# 2. Read Specific Sheet (by Name or Index)
df = pd.read_excel("students.xlsx", sheet_name="Sheet1")
df = pd.read_excel("students.xlsx", sheet_name=0)

# 3. Read Multiple Sheets at once (returns a Dictionary of DataFrames)
sheets_dict = pd.read_excel("students.xlsx", sheet_name=["Sheet1", "Sheet2"])
all_sheets = pd.read_excel("students.xlsx", sheet_name=None)

# 4. Read Specific Columns Range (Excel-style A to C)
df = pd.read_excel("students.xlsx", usecols="A:C")

# 5. Handle Custom Missing Value Indicators
df = pd.read_excel("students.xlsx", na_values=["NA", "Missing", "Null"])

# 6. Parse Date Columns
df = pd.read_excel("students.xlsx", parse_dates=["JoiningDate"])

# 7. Set Specific Column as Index
df = pd.read_excel("students.xlsx", index_col="RollNo")

# 8. Specify Engine
df = pd.read_excel("students.xlsx", engine="openpyxl")
```

---

## 📂 1.3 JSON Files (`read_json`)
Reads JavaScript Object Notation (JSON) files containing key-value data.

### Core Parameters & Syntax:
```python
# Load JSON
df = pd.read_json("students.json")

# Load JSON and grab first N rows
df = pd.read_json("students.json").head(2)
```

---

## 📂 1.4 Other Formats

### 1. Plain Text File
```python
# Load simple tab/space separated files
df = pd.read_table("data.txt")
```

### 2. HTML Table
Reads tables directly from webpage strings or files.
```python
tables = pd.read_html("table.html")
df = tables[0]  # Grab first table found
```

### 3. XML File
```python
df = pd.read_xml("students.xml")
```

### 4. SQL Database
```python
import sqlite3
conn = sqlite3.connect("college.db")
df = pd.read_sql("SELECT * FROM students", conn)
```

---

# 🔍 Part 2: Pandas Data Viewing & Metadata Functions

Once the data is loaded, we use the following attributes and functions to inspect and understand the structure of the dataset.

| Function / Attribute | Type | Description |
| :--- | :--- | :--- |
| `head(n)` | Method | First `n` records (default is 5) |
| `tail(n)` | Method | Last `n` records (default is 5) |
| `sample(n)` | Method | Randomly selected `n` records |
| `info()` | Method | Non-null counts, data types, and memory usage summary |
| `describe()` | Method | Statistical summary (mean, std, min, max, percentiles) |
| `shape` | Attribute | Tuple representing dataset dimensions `(rows, columns)` |
| `columns` | Attribute | Index of all column names |
| `index` | Attribute | Index of row labels |
| `dtypes` | Attribute | Data type of each column |
| `size` | Attribute | Total elements `(rows * columns)` |
| `ndim` | Attribute | Number of dimensions (always 2 for DataFrame) |
| `memory_usage()` | Method | Memory consumption of each column in bytes |
| `count()` | Method | Count of non-null values per column |
| `nunique()` | Method | Number of unique values in each column |
| `unique()` | Method | Array of unique values in a Series |

---

# 📊 Part 3: Matplotlib Fundamentals

**Matplotlib** is Python's most popular data visualization library used to build professional static, animated, and interactive graphs.

### Why Matplotlib?
- Easy to use and highly customizable.
- Seamlessly integrates with NumPy and Pandas.
- Supports grid layouts, subplots, legends, and styling.
- Can export plots as PNG, JPG, PDF, etc.

---

## 📈 3.1 Line Plots (`plt.plot`)

Line plots are used to visualize values over a continuous range (like time or index).

### Simple Line Plot:
```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [10, 20, 30, 40, 50]

plt.plot(x, y, color="red", linestyle="--")
plt.title("Simple Line Graph")
plt.xlabel("X-axis")
plt.ylabel("Y-axis")
plt.show()
```

### Advanced Styling & Customization Options:

- **Line Colors:** `color="red"`, `"blue"`, `"green"`, `"black"`, `"orange"`, `"pink"`, etc.
- **Line Styles (`linestyle`):**
  - `'-'` (solid)
  - `'--'` (dashed)
  - `':'` (dotted)
  - `'-.'` (dash-dot)
- **Line Width (`linewidth`):** Pass float values (e.g., `linewidth=5` for thicker lines).
- **Markers:** Adds a symbol at each data point.
  - `'o'` (circle)
  - `'s'` (square)
  - `'^'` (triangle)
  - `'*'` (star)
  - `'+'` (plus)
- **Marker Styling:** `markersize=10`, `markerfacecolor="yellow"`, `markeredgecolor="red"`.
- **Grid:** `plt.grid(True)` to enable background grids.
- **Figure Size:** `plt.figure(figsize=(width, height))` to resize the canvas.
- **Legends (Multiple Lines):**
  ```python
  plt.plot(x, y1, label="Python")
  plt.plot(x, y2, label="Java")
  plt.legend()  # Enables labels display
  ```

---

## 📊 3.2 Bar Charts (`plt.bar` & `plt.barh`)

Bar charts display comparison values across categorical groups.

### Vertical Bar Chart:
```python
students = ["A", "B", "C", "D"]
marks = [80, 90, 70, 85]

plt.bar(students, marks, color=["red", "blue", "green", "orange"], width=0.5)
plt.title("Student Marks")
plt.xlabel("Students")
plt.ylabel("Marks")
plt.show()
```

### Horizontal Bar Chart:
```python
plt.barh(students, marks, color="purple", height=0.4)
plt.show()
```

### Advanced Customizations:
- **Bar Borders:** `edgecolor="red"`, `linewidth=3` (changes border color and size).
- **Transparency:** `alpha=0.5` (ranges from `0` to `1`).
- **Style Sheets:** Apply beautiful pre-designed styles.
  ```python
  plt.style.use("ggplot")  # Try: "dark_background", "classic", "Solarize_Light2"
  ```
- **Saving Figures:** Save your chart directly as an image file.
  ```python
  plt.savefig("barchart.png", dpi=300)
  ```
- **Text on Bars:** Programmatically add height values on top of bars.
  ```python
  bars = plt.bar(students, marks)
  for bar in bars:
      yval = bar.get_height()
      plt.text(bar.get_x() + bar.get_width()/2, yval, yval, ha='center', va='bottom')
  ```

---

## 🧠 Aaj Ka Mind Map

```
                     DATA TO VISUALIZATION
                               │
            ┌──────────────────┴──────────────────┐
            │                                     │
      Pandas Loading                        Matplotlib Plotting
            │                                     │
    ┌───────┼───────┐                     ┌───────┼───────┐
    │       │       │                     │       │       │
  read_csv read_excel read_json         plot()   bar()   barh()
    │       │       │                     │       │       │
  nrows  sheet_name head()              color   width   height
  usecols  na_values tail()             marker  edgecolor alpha
```

---

## 📝 Asif Sir's Classroom Notes

| Resource | Link |
| :--- | :--- |
| 🖊️ **Asif Sir's Colab Notebook — Day 8** | [![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1nSzhlttcrtst9JEA5kkvfiDbAcaF8Klc?usp=sharing) |

---

## 🔗 Resources & Notebooks

- 📓 Pandas Data Loading Notebook: [08_pandas.ipynb](Notebook/08_pandas.ipynb)
- 📓 Matplotlib Plotting Notebook: [08_matplotlib.ipynb](Notebook/08_matplotlib.ipynb)
- 📂 Dataset Directory: [DataSet/](DataSet/)
- 🐼 Pandas read_csv Docs: https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_csv.html
- 📈 Matplotlib Pyplot Docs: https://matplotlib.org/stable/api/pyplot_summary.html

---

*Banaya with 💙, visual styling 🎨 aur ek line plot jo origin se shuru hokar data ki heights ko touch karta raha! | CPUR Agentic AI Internship | Day 8 — 18 June 2026*
