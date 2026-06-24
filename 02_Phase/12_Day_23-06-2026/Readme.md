# Day 12: Regression in Machine Learning

Welcome to the Day 12 learning guide! This document covers **Regression Analysis** in Machine Learning, exploring the theory, math, and step-by-step Python implementation using **Scikit-Learn** as well as two comprehensive real-world modeling case studies.

---

## Table of Contents
1. [Introduction to Regression](#1-introduction-to-regression)
   - [What is Regression?](#what-is-regression)
   - [Types of Regression](#types-of-regression)
2. [Implementing Regression with Scikit-Learn](#2-implementing-regression-with-scikit-learn)
   - [Simple Linear Regression](#simple-linear-regression)
   - [Multiple Linear Regression](#multiple-linear-regression)
3. [Regression Case Studies](#3-regression-case-studies)
   - [Case Study 1: King County House Price Prediction](#case-study-1-king-county-house-price-prediction)
   - [Case Study 2: Student Marks Prediction](#case-study-2-student-marks-prediction)

---

## 1. Introduction to Regression

### What is Regression?
Regression is a **Supervised Machine Learning** technique used to predict a **continuous numerical value** (target $y$) based on one or more input variables (features $X$).
- *Examples*: Housing prices, temperature forecasting, salary projections, and stock valuations.

### Types of Regression
1. **Simple Linear Regression**: Uses **one independent variable ($X$)** to predict a dependent variable ($y$) using a straight line.
   
   $$y = mX + c$$
   
   - $m$: Slope / Coefficient (how much $y$ changes per unit of $X$)
   - $c$: Intercept (value of $y$ when $X = 0$)

2. **Multiple Linear Regression**: Uses **two or more independent variables ($X_1, X_2, \dots$)** to predict a dependent variable ($y$).
   
   $$y = b_0 + b_1X_1 + b_2X_2 + b_3X_3 + \dots + b_kX_k$$
   
   - $b_0$: Intercept
   - $b_1, b_2, \dots, b_k$: Coefficients representing the effect of each feature.

3. **Polynomial Regression**: Used when the relationship between $X$ and $y$ is non-linear or curved (e.g. age vs. salary, which peaks and eventually decreases).
   
   $$y = a + bX + cX^2 + dX^3 + \dots$$

4. **Regularized Regression**: 
   - **Ridge Regression (L2 Regularization)**: Adds a squared penalty to prevent coefficients from growing too large.
   - **Lasso Regression (L1 Regularization)**: Adds an absolute penalty that can force irrelevant coefficients to zero (useful for feature selection).
   - **Elastic Net**: Combines L1 and L2 penalties.
5. **Support Vector Regression (SVR)**: Uses support vector machines to find a boundary tube around data.
6. **Decision Tree Regression**: Breaks down data by creating branching decision nodes.
7. **Random Forest Regression**: An ensemble of multiple decision trees, averaging their predictions for higher accuracy and lower overfitting.

---

## 2. Implementing Regression with Scikit-Learn

Scikit-Learn (`sklearn`) is the standard Python library for machine learning.

### Simple Linear Regression

Below is an implementation of predicting `Salary` from `Age` using synthetic data:

```python
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# 1. Create dataset
data = {
    "Age": [23, 28, 35, 42, 49, 55, 61],
    "Salary": [35000, 48000, 62000, 75000, 90000, 110000, 115000]
}
df = pd.DataFrame(data)

# 2. Separate Features (2D Array) and Target (1D Array)
X = df[['Age']]  # Feature must be a DataFrame or 2D array
y = df['Salary'] # Target is a 1D Series

# 3. Instantiate and fit the model
model = LinearRegression()
model.fit(X, y)

# 4. Inspect Model Parameters
slope = model.coef_[0]
intercept = model.intercept_
print(f"Slope (m): {slope:.2f}")
print(f"Intercept (c): {intercept:.2f}")
# Learned Equation: Salary = (slope * Age) + intercept

# 5. Make a prediction
new_age = 30
predicted_val = model.predict([[new_age]])
print(f"Predicted Salary for age {new_age}: ₹{predicted_val[0]:.2f}")

# 6. Visualize results
plt.scatter(X, y, color="blue", label="Actual Data")
plt.plot(X, model.predict(X), color="red", label="Regression Line")
plt.xlabel("Age")
plt.ylabel("Salary")
plt.title("Age vs. Salary Regression Line")
plt.legend()
plt.show()
```

---

### Multiple Linear Regression

Extending regression to multiple input parameters:

```python
# Create dataset with multiple features
data = {
    "Age": [22, 25, 30, 35, 40, 45, 50, 54, 58, 62],
    "Education": [12, 16, 16, 18, 14, 16, 18, 16, 20, 18], # Years of education
    "Experience": [1, 3, 7, 11, 15, 20, 24, 28, 32, 36],
    "Salary": [45000, 52000, 68000, 85000, 92000, 110000, 125000, 134000, 155000, 162000]
}
df = pd.DataFrame(data)

X = df[['Age', 'Education', 'Experience']]
y = df['Salary']

# Train Model
model = LinearRegression()
model.fit(X, y)

print("Coefficients (b1, b2, b3):", model.coef_)
print("Intercept (b0):", model.intercept_)

# Predict for Age=30, Education=16 years, Experience=8 years
prediction = model.predict([[30, 16, 8]])
print(f"Predicted Salary: ₹{prediction[0]:.2f}")
```

---

## 3. Regression Case Studies

### Case Study 1: King County House Price Prediction
Dataset: `kc_house_data.csv` (contains house sales data in King County, USA).

#### 1. Data Subsetting & Cleaning
We focus on a subset of features: `price`, `bedrooms`, `bathrooms`, `sqft_living`, `sqft_lot`, `floors`.
```python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

df = pd.read_csv('../data/kc_house_data.csv')
col_subset = ['price', 'bedrooms', 'bathrooms', 'sqft_living', 'sqft_lot', 'floors']
df_clean = df[col_subset]

# Check and remove duplicate rows
print("Duplicate count:", df_clean.duplicated().sum())
df_clean.drop_duplicates(inplace=True)
```

#### 2. Outlier Removal (IQR Method)
Remove extreme outliers from all feature columns:
```python
col_outliers = ['bedrooms', 'bathrooms', 'sqft_living', 'sqft_lot', 'floors']

for col in col_outliers:
    Q1 = df_clean[col].quantile(0.25)
    Q3 = df_clean[col].quantile(0.75)
    IQR = Q3 - Q1
    
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    df_clean = df_clean[(df_clean[col] >= lower_bound) & (df_clean[col] <= upper_bound)]
```

#### 3. Correlation Heatmap
Plot a heatmap to inspect correlation coefficients between independent features and price:
```python
plt.figure(figsize=(8,6))
sns.heatmap(df_clean.corr(numeric_only=True), annot=True, cmap="coolwarm")
plt.title("Feature Correlation Heatmap")
plt.show()
```

#### 4. Model Training & Validation
```python
X = df_clean[["bedrooms", "bathrooms", "sqft_living", "sqft_lot", "floors"]]
y = df_clean["price"]

model = LinearRegression()
model.fit(X, y)

# Plot actual vs predicted values with a perfect fit reference line
plt.scatter(y, model.predict(X), alpha=0.5, label="Actual Predictions")
plt.plot([y.min(), y.max()], [y.min(), y.max()], color='red', linestyle='--', label='Perfect Fit (y = x)')
plt.xlabel("Actual Price")
plt.ylabel("Predicted Price")
plt.title("Multiple Regression: Actual vs. Predicted Price")
plt.legend()
plt.show()
```

---

### Case Study 2: Student Marks Prediction
Dataset: `Student_Marks.csv` (contains columns for `number_courses`, `time_study`, and `Marks`).

#### 1. Correlation Analysis
Before modeling, check relationships:
- High positive correlation exists between study hours (`time_study`) and `Marks`.
- Lower but positive correlation exists between `number_courses` and `Marks`.

#### 2. Multiple Linear Regression & Value Clipping
Since exam marks are bounded (e.g. $[0, 60]$), predictions are capped using `np.clip` to avoid mathematically impossible values.

```python
df = pd.read_csv('../data/Student_Marks.csv')

X = df[['number_courses', 'time_study']]
y = df['Marks']

# Train Model
model = LinearRegression()
model.fit(X, y)

# Predict Marks
courses = 3
hours = 4.5
pred_mark = model.predict([[courses, hours]])[0]

# Clip the output to realistic boundary [0, 60]
pred_mark_clipped = np.clip(pred_mark, 0, 60)

# Classify Pass/Fail based on threshold of 30 marks
status = "Pass" if pred_mark_clipped >= 30 else "Fail"

print(f"Clipped Predicted Mark: {pred_mark_clipped:.2f} ({status})")
```

#### 3. Actual vs. Predicted Visualizations
Plotting predictions against actual values with a diagonal line:
```python
y_pred_clipped = np.clip(model.predict(X), 0, 60)

plt.scatter(y, y_pred_clipped, color="blue", alpha=0.6, label="Students")
plt.plot([y.min(), y.max()], [y.min(), y.max()], color='red', linestyle='--', label='y = x (Perfect prediction)')
plt.xlabel("Actual Marks")
plt.ylabel("Predicted Marks")
plt.title("Actual vs. Predicted Student Marks")
plt.legend()
plt.show()

# Save cleaned output
df.to_csv('student_marks_cleaned.csv', index=False)
```
