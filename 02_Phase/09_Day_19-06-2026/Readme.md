# Day 9: Data Visualization with Matplotlib & Data Cleaning / EDA

Welcome to the Day 9 learning guide! This document compiles all the key concepts, equations, functions, and code examples covered in the classroom and practice sessions regarding **Data Visualization using Matplotlib** and **Data Cleaning / Exploratory Data Analysis (EDA)**.

---

## Table of Contents
1. [Data Visualization with Matplotlib](#1-data-visualization-with-matplotlib)
   - [Pie Charts & Donut Charts](#pie-charts--donut-charts)
   - [Histograms](#histograms)
   - [Scatter Plots](#scatter-plots)
   - [Subplots & Tight Layout](#subplots--tight-layout)
   - [Axis Limits & Controls](#axis-limits--controls)
   - [Saving Plots & Style Sheets](#saving-plots--style-sheets)
2. [Data Cleaning & Exploratory Data Analysis (EDA)](#2-data-cleaning--exploratory-data-analysis-eda)
   - [Dataset Overview Methods](#dataset-overview-methods)
   - [Missing Value Analysis & Imputation](#missing-value-analysis--imputation)
   - [Duplicate Records Handling](#duplicate-records-handling)
   - [Outlier Detection & Removal (IQR Method)](#outlier-detection--removal-iqr-method)
   - [Data Aggregation, Filtering & Sorting](#data-aggregation-filtering--sorting)

---

## 1. Data Visualization with Matplotlib

Matplotlib is a powerful plotting library for Python. It provides a MATLAB-like interface for creating static, animated, and interactive visualizations.

### Pie Charts & Donut Charts
Pie charts are used to show the relative proportions of a whole.

```python
import matplotlib.pyplot as plt

data = [40, 30, 20, 10]
labels = ["Python", "Java", "C++", "JavaScript"]
colors = ["#ff9999", "#66b3ff", "#99ff99", "#ffcc99"]
explode = [0.1, 0, 0, 0]  # "Explode" the 1st slice (Python)

plt.figure(figsize=(8, 8))
plt.pie(
    data,
    labels=labels,
    colors=colors,
    explode=explode,
    autopct="%1.1f%%",       # Format percentage values
    shadow=True,              # Enable shadow effect
    startangle=90,            # Start rotation angle (90 deg = top)
    counterclock=False,       # Draw clockwise
    labeldistance=1.1,        # Distance of text labels from center
    pctdistance=0.6,          # Distance of percentage text from center
    wedgeprops={
        'edgecolor': 'black', # Border color of wedges
        'linewidth': 1.5      # Border thickness
    }
)
plt.title("Programming Language Popularity")
plt.show()
```

#### Creating a Donut Chart
To create a donut chart, customize the `width` property inside `wedgeprops`:

```python
plt.pie(data, labels=labels, wedgeprops={'width': 0.4})  # Inner circle is empty (donut)
plt.title("Donut Chart Example")
plt.show()
```

---

### Histograms
Histograms represent the distribution of a continuous numerical variable by binning the data into intervals.

```python
# Generating normal distribution data using NumPy
import numpy as np
data = np.random.randn(1000)

plt.figure(figsize=(8, 5))
plt.hist(
    data,
    bins=30,                  # Number of bars/intervals
    color="skyblue",          # Fill color of bars
    edgecolor="black",        # Border color of bars
    linewidth=1.2,            # Thickness of borders
    alpha=0.75,               # Transparency (0 = invisible, 1 = solid)
    density=False,            # If True, normalizes to form a probability density
    cumulative=False,         # If True, computes cumulative distribution
    histtype='bar',           # Options: 'bar', 'barstacked', 'step', 'stepfilled'
    orientation='vertical'    # Options: 'vertical', 'horizontal'
)
plt.title("Normal Data Distribution")
plt.xlabel("Value Range")
plt.ylabel("Frequency")
plt.grid(True, linestyle="--", alpha=0.5)
plt.show()
```

---

### Scatter Plots
Scatter plots are used to visualize the relationship between two continuous variables using individual dots.

```python
np.random.seed(42)
x = np.random.randn(50)
y = np.random.randn(50)
sizes = np.random.uniform(50, 500, len(x))   # Varying marker sizes
colors = np.random.uniform(0, 100, len(x))   # Varying marker colors

plt.figure(figsize=(8, 6))
scatter = plt.scatter(
    x,
    y,
    s=sizes,                  # Size of markers
    c=colors,                 # Color sequence or single color
    marker="o",               # Options: 'o' (circle), 's' (square), '^' (triangle), '*' (star), etc.
    cmap="viridis",           # Colormap style (e.g., 'viridis', 'plasma', 'coolwarm')
    edgecolors="black",       # Marker border color
    alpha=0.8
)
plt.colorbar(scatter, label="Intensity Scale") # Shows color scale bar
plt.title("Variable X vs Variable Y Scatter Plot")
plt.xlabel("X Axis")
plt.ylabel("Y Axis")
plt.show()
```

---

### Subplots & Tight Layout
Subplots allow you to arrange multiple plots in a grid within a single figure.
- **Syntax**: `plt.subplot(rows, columns, active_index)`

```python
plt.figure(figsize=(12, 5))

# Plot 1: Left Subplot
plt.subplot(1, 2, 1)  # 1 row, 2 columns, index 1
plt.pie([30, 70], labels=["A", "B"], colors=["red", "blue"])
plt.title("Subplot 1: Pie")

# Plot 2: Right Subplot
plt.subplot(1, 2, 2)  # 1 row, 2 columns, index 2
plt.bar(["X", "Y", "Z"], [10, 20, 15], color="green")
plt.title("Subplot 2: Bar")

plt.tight_layout()    # Automatically adjusts padding/spacing to prevent overlap
plt.show()
```

---

### Axis Limits & Controls
Controlling coordinate limits and appearance:

- **Specific Limits**:
  ```python
  plt.xlim(1, 5)        # Visible x-axis range [1, 5]
  plt.ylim(10, 50)      # Visible y-axis range [10, 50]
  ```
- **Single Function Limits**:
  ```python
  plt.axis([xmin, xmax, ymin, ymax])
  plt.axis([1, 5, 10, 50])
  ```
- **Hide Axes**:
  ```python
  plt.axis("off")       # Hides x and y axis lines, labels, and ticks
  ```
- **Equal Aspect Ratio**:
  ```python
  plt.axis("equal")     # Forces equal scaling on both axes (perfect circles/squares)
  ```
- **Reverse Axes**:
  ```python
  plt.xlim(5, 1)        # X-axis runs backwards from 5 down to 1
  ```

---

### Saving Plots & Style Sheets
- **Saving**: Always save plots before calling `plt.show()`, as `show()` clears the figure.
  ```python
  plt.savefig("my_chart.png", dpi=300, bbox_inches='tight')  # Saves high-res image
  ```
- **Style Sheets**: Pre-packaged templates to instantly restyle charts:
  ```python
  plt.style.use("ggplot")  # ggplot background style
  # Other popular styles: "dark_background", "classic", "Solarize_Light2"
  ```

---

## 2. Data Cleaning & Exploratory Data Analysis (EDA)

Data cleaning prepares raw, noisy datasets for accurate analytical evaluation.

### Dataset Overview Methods
Before cleaning, understand the dataset shape and type:
```python
import pandas as pd

df = pd.read_csv("employees.csv")

df.head()        # View first 5 rows
df.tail()        # View last 5 rows
df.shape         # (rows, columns)
df.columns       # Index list of column headers
df.info()        # Displays data types, non-null counts, memory usage
df.describe()    # General statistics (mean, std, min, max, quartiles)
df.sample(5)     # Returns a random sample of 5 rows
df.dtypes        # Data types of all columns
```

---

### Missing Value Analysis & Imputation
Missing values are represented as `NaN` (Not a Number).

```python
# Check count of missing values per column
print(df.isnull().sum())

# Total missing values in the entire DataFrame
print(df.isnull().sum().sum())

# Display rows containing at least one missing value
df_with_nan = df[df.isnull().any(axis=1)]
```

#### Imputation Techniques
1. **Median Imputation** (best for numerical variables with outliers, like `Age`):
   ```python
   age_median = df["Age"].median()
   df["Age"] = df["Age"].fillna(age_median)
   ```
2. **Mean Imputation** (best for symmetrical numerical data without extreme outliers, like `Salary`):
   ```python
   salary_mean = df["Salary"].mean()
   df["Salary"] = df["Salary"].fillna(round(salary_mean))
   ```
3. **Mode Imputation** (best for categorical variables, like `City`):
   ```python
   city_mode = df["City"].mode()[0]  # Mode returns a Series, select the first element
   df["City"] = df["City"].fillna(city_mode)
   ```

---

### Duplicate Records Handling
Duplicate rows distort statistics and skew ML modeling results.

```python
# Check boolean array of duplicates (True indicates a duplicate row)
df.duplicated()

# Count total duplicate records
total_dups = df.duplicated().sum()

# Display only the duplicate rows
df[df.duplicated()]

# View original AND duplicate records side-by-side for comparison
df[df.duplicated(keep=False)]

# Remove duplicate records permanently
df = df.drop_duplicates()
```

---

### Outlier Detection & Removal (IQR Method)
An outlier is an observation that lies an abnormal distance from other values in the dataset.

#### The Interquartile Range (IQR) Math
The data is divided into quartiles:
- **$Q_1$ (25th Percentile)**: Cuts off the lowest 25% of the data.
- **$Q_3$ (75th Percentile)**: Cuts off the lowest 75% of the data.
- **$IQR$**: Range of the middle 50% of the data.

$$\text{IQR} = Q_3 - Q_1$$

The bounds are calculated as follows:

$$\text{Lower Limit} = Q_1 - (1.5 \times \text{IQR})$$
$$\text{Upper Limit} = Q_3 + (1.5 \times \text{IQR})$$

- **Outliers** are any data points where:
$$\text{Value} < \text{Lower Limit} \quad \text{or} \quad \text{Value} > \text{Upper Limit}$$

```python
# Calculate Q1 and Q3
Q1 = df["Age"].quantile(0.25)
Q3 = df["Age"].quantile(0.75)

# Calculate IQR
IQR = Q3 - Q1

# Calculate Limits
lower_limit = Q1 - 1.5 * IQR
upper_limit = Q3 + 1.5 * IQR

# Identify Outliers
outliers = df[(df["Age"] < lower_limit) | (df["Age"] > upper_limit)]
print("Detected Outliers:")
print(outliers)

# Remove Outliers (keep only values within limits)
df_clean = df[(df["Age"] >= lower_limit) & (df["Age"] <= upper_limit)]
```

#### Visualizing Outliers using Boxplots
A **Boxplot** represents the distribution using five summaries: minimum, $Q_1$, median, $Q_3$, and maximum. Outliers are plotted as individual points beyond the whiskers.

```python
# Matplotlib Boxplot
plt.boxplot(df["Age"])
plt.title("Age Outlier Visual Analysis")
plt.show()

# Seaborn Boxplot (horizontal)
import seaborn as sns
sns.boxplot(x=df["Age"])
plt.title("Age Boxplot")
plt.show()
```

---

### Data Aggregation, Filtering & Sorting

#### GroupBy Analysis
Group data by category and calculate summary statistics:
```python
# Average salary by gender
df.groupby("Gender")["Salary"].mean()

# Average salary by city
df.groupby("City")["Salary"].mean()

# Count of employees in each city
df.groupby("City")["ID"].count()
```

#### Value Counts
Count frequencies of unique elements in a categorical column:
```python
df["Gender"].value_counts()
df["City"].value_counts()
```

#### Filtering
Select subset of data based on logical conditions:
```python
# Filter employees earning more than 50,000
high_earners = df[df["Salary"] > 50000]

# Filter female employees
female_staff = df[df["Gender"] == "Female"]

# Filter employees based in Jaipur
jaipur_staff = df[df["City"] == "Jaipur"]
```

#### Sorting
Sort the DataFrame based on values in columns:
```python
# Sort by Salary ascending
df_sorted = df.sort_values(by="Salary")

# Sort by Salary descending
df_sorted_desc = df.sort_values(by="Salary", ascending=False)

# Sort by multiple columns (e.g. City ascending, Salary descending)
df_multi_sort = df.sort_values(by=["City", "Salary"], ascending=[True, False])
```
