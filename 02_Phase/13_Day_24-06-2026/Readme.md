# Day 13: Classification in Machine Learning 🎯

Welcome to the Day 13 learning guide! Aaj hum baat karenge **Classification** (Vargikaran) ki. Pichle din humne Regression padha tha jahan hum continuous numbers (jaise salary ya ghar ke daam) predict kar rahe the. Aaj hum predict karenge **Category ya Class Label** (jaise Pass/Fail, Spam/Not Spam). Let's dive deep with a desi touch! 🚀

---

## Table of Contents
1. [Classification Kya Hai?](#1-classification-kya-hai)
2. [Classification ke Types](#2-classification-ke-types)
3. [Logistic Regression (Math & Logic)](#3-logistic-regression-math--logic)
4. [Decision Tree Classifier (Deep Dive with Math)](#4-decision-tree-classifier-deep-dive-with-math)
5. [Multi-Class Classification & Iris Flower Project](#5-multi-class-classification--iris-flower-project)

---

## 1. Classification Kya Hai?

Classification ek **Supervised Machine Learning** technique hai jahan humara target variable ek **category ya class label** hota hai.

```
Input Features (X) ───► [ Machine Learning Model ] ───► Output Class/Category (y)
```

### Real-Life Examples:
| Input Features (Independent Variables) | Output Class (Dependent Variable) | Type |
| :--- | :--- | :--- |
| Email ka Content | Spam / Not Spam | Binary |
| Student ke Marks, Attendance | Pass / Fail | Binary |
| Patient ki Medical Report | Disease / No Disease | Binary |
| Customer ki Bank details | Loan Approved / Rejected | Binary |
| Animal ki Photo (Features) | Cat / Dog / Lion | Multi-Class |

---

## 2. Classification ke Types

Mainly classification do tarah ki hoti hai:

```
                  ┌─────────────────────────────┐
                  │       Classification        │
                  └──────────────┬──────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
     ┌───────────────────────┐       ┌───────────────────────┐
     │ Binary Classification │       │Multi-Class Classific. │
     │  (Sirf 2 options)     │       │  (3 ya zyada options) │
     │  E.g., Pass/Fail      │       │  E.g., Cat/Dog/Lion   │
     └───────────────────────┘       └───────────────────────┘
```

### A. Binary Classification
Jab target variable ke paas sirf **do possible classes** (Yes/No, 0/1, True/False) hon:
* **Email Spam Detection**: Spam ya Not Spam (Ham).
* **Disease Prediction**: Positive ya Negative.

**Popular Models for Binary Classification:**
1. Logistic Regression
2. K-Nearest Neighbors (KNN)
3. Decision Trees
4. Random Forest
5. Support Vector Machines (SVM)
6. Naive Bayes

---

## 3. Logistic Regression (Math & Logic)

Logistic Regression naam mein "Regression" hai, par kaam ye **Classification** ka karta hai! 😲

### Iska Working Flow Samjho:

```
  [ Input Features ]  (Study Hours, Attendance, Marks)
          │
          ▼
  [ Linear Equation ] (z)
  z = b₀ + b₁x₁ + b₂x₂ + ... + bₙxₙ   (Output can be -∞ to +∞)
          │
          ▼
  [ Sigmoid Function ] ───► Formula: P = 1 / (1 + e⁻ᶻ)
          │
          ▼
  [ Probability (0 to 1) ]  (e.g., 0.85 = 85% chance of passing)
          │
          ▼
  [ Decision Threshold (0.5) ]
          ├─► If P ≥ 0.5  ──► Predicted Class 1 (Pass / Approved)
          └─► If P < 0.5  ──► Predicted Class 0 (Fail / Rejected)
```

> [!NOTE]
> **Sigmoid Function** humare linear output $z$ को squash karke `0` aur `1` ke beech mein le aata hai. Iska mathematical representation hai:
> $$P(y=1|X) = \frac{1}{1 + e^{-z}}$$
> Agar $z$ bahut bada positive number hoga, to $P$ close to $1$ ho jayega. Agar $z$ bahut bada negative number hoga, to $P$ close to $0$ ho jayega.

---

### Code Implementation 1: Student Pass/Fail Prediction
Yeh model predict karega ki student input features (`Marks`, `StudyHours`, `Attendance`) ke basis par **Pass** hoga ya **Fail**.

```python
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# 1. Dataset banana
data = {
    "Marks": [35, 45, 55, 65, 75],
    "StudyHours": [1, 2, 3, 4, 5],
    "Attendance": [50, 60, 70, 80, 90],
    "Result": ["Fail", "Fail", "Pass", "Pass", "Pass"]
}
df = pd.DataFrame(data)

# 2. Features (X) aur Target (y) split karna
X = df[["Marks", "StudyHours", "Attendance"]]
y = df["Result"]

# 3. Model train karna
model = LogisticRegression()
model.fit(X, y)

# 4. User se live input lena
marks = float(input("Enter Marks: "))
hours = float(input("Enter Study Hours: "))
attendance = float(input("Enter Attendance: "))

# 5. Prediction aur Probability nikalna
prediction = model.predict([[marks, hours, attendance]])
probability = model.predict_proba([[marks, hours, attendance]])

print(f"\nPredicted Status: {prediction[0]}")
print(f"Fail Probability: {round(probability[0][0] * 100, 2)}%")
print(f"Pass Probability: {round(probability[0][1] * 100, 2)}%")

# 6. Accuracy check karna
y_pred = model.predict(X)
accuracy = accuracy_score(y, y_pred)
print(f"Model Training Accuracy: {accuracy * 100}%")
```

---

### Code Implementation 2: Loan Approval Prediction
Isme hum predict karenge ki loan status **Approved** hoga ya **Rejected**.

```python
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Dataset
data = {
    "Income": [20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000],
    "CreditScore": [500, 550, 580, 600, 620, 650, 680, 700, 720, 750],
    "LoanAmount": [50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000],
    "Status": ["Rejected", "Rejected", "Rejected", "Rejected", "Approved", "Approved", "Approved", "Approved", "Approved", "Approved"]
}
df = pd.DataFrame(data)

X = df[["Income", "CreditScore", "LoanAmount"]]
y = df["Status"]

model = LogisticRegression()
model.fit(X, y)

income = float(input("Enter Income: "))
credit_score = float(input("Enter Credit Score: "))
loan_amount = float(input("Enter Loan Amount: "))

prediction = model.predict([[income, credit_score, loan_amount]])
probability = model.predict_proba([[income, credit_score, loan_amount]])

# classes_ attribute status order verify karne ke liye use hota hai (Approved = index 0, Rejected = index 1)
print(f"\nLoan Status: {prediction[0]}")
print(f"Approved Probability: {round(probability[0][0] * 100, 2)}%")
print(f"Rejected Probability: {round(probability[0][1] * 100, 2)}%")
```

---

## 4. Decision Tree Classifier (Deep Dive with Math)

Decision Tree ek flowchart-like structure hota hai jisme har internal node ek **feature test** ko dikhata hai, branch **test outcome** ko, aur leaf node **final class** ko.

```
                         [ Outlook ]  (Root Node)
                        /     |     \
                 Sunny /   Overcast  \ Rain
                      /       │       \
                [Humidity]  [ YES ]  [ Wind ]
                 /      \             /    \
            High/  Normal\      Strong/      \Weak
               /          \          /        \
            [ NO ]      [ YES ]   [ NO ]     [ YES ]
```

### Mathematical Concepts behind Splitting:
Decision tree splits karne ke liye data ki **impurity** naapta hai. Iske liye hum **Entropy** aur **Information Gain** ka use karte hain.

#### 1. Entropy (Impurity Ka Measure) 📉
Entropy batati hai ki humara data kitna mixed (impure) hai. Agar data fully pure hai (sari values ek hi class ki hain), to Entropy = 0. Agar half values Yes hain aur half No, to Entropy = 1 (max impurity).

$$\text{Entropy}(S) = - \sum_{i=1}^{c} p_i \log_2 p_i$$

Yahan $p_i$ kisi particular class ke hone ki probability hai.

#### 2. Information Gain (IG) 📈
Information Gain batata hai ki kisi feature ke basis par split karne se entropy kitni kam hui. Hum us feature ko select karte hain jiska **Information Gain highest** hota hai.

$$\text{Information Gain}(S, A) = \text{Entropy}(S) - \sum_{v \in \text{Values}(A)} \frac{|S_v|}{|S|} \text{Entropy}(S_v)$$

---

### Step-by-Step Math Solving: Play Tennis Example 🎾

Suppose humare paas ye Play Tennis Dataset hai:
| Row | Outlook | Temperature | Humidity | Wind | PlayTennis |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Sunny | Hot | High | Weak | No |
| 2 | Sunny | Hot | High | Strong | No |
| 3 | Overcast | Hot | High | Weak | Yes |
| 4 | Rain | Mild | High | Weak | Yes |
| 5 | Rain | Cool | Normal | Weak | Yes |
| 6 | Rain | Cool | Normal | Strong | No |
| 7 | Overcast | Cool | Normal | Strong | Yes |
| 8 | Sunny | Mild | High | Weak | No |
| 9 | Sunny | Cool | Normal | Weak | Yes |
| 10| Rain | Mild | Normal | Weak | Yes |

Total Records = $10$.
Play Tennis classes: **Yes = 6**, **No = 4**.

#### Step 1: Entire Dataset ki Base Entropy nikalna
$$P(\text{Yes}) = \frac{6}{10} = 0.6$$
$$P(\text{No}) = \frac{4}{10} = 0.4$$

$$\text{Entropy}(S) = - (0.6 \log_2 0.6 + 0.4 \log_2 0.4)$$
$$\text{Entropy}(S) = - (0.6 \times -0.737 + 0.4 \times -1.322) \approx 0.971$$

---

#### Step 2: Information Gain calculation for Attributes

##### Attribute 1: Outlook
Outlook ke paas 3 values hain: **Sunny (4 rows)**, **Overcast (2 rows)**, **Rain (4 rows)**.

* **Sunny** (Rows: 1, 2, 8, 9) ──► Yes = 1, No = 3
  $$\text{Entropy}(\text{Sunny}) = - \left( \frac{1}{4} \log_2 \frac{1}{4} + \frac{3}{4} \log_2 \frac{3}{4} \right) = - (0.25 \times -2 + 0.75 \times -0.415) \approx 0.811$$

* **Overcast** (Rows: 3, 7) ──► Yes = 2, No = 0 (Totally Pure!)
  $$\text{Entropy}(\text{Overcast}) = - (1 \log_2 1 + 0) = 0$$

* **Rain** (Rows: 4, 5, 6, 10) ──► Yes = 3, No = 1
  $$\text{Entropy}(\text{Rain}) = - \left( \frac{3}{4} \log_2 \frac{3}{4} + \frac{1}{4} \log_2 \frac{1}{4} \right) \approx 0.811$$

**Weighted Entropy of Outlook Split:**
$$\text{Entropy}_{\text{weighted}} = \frac{4}{10}(0.811) + \frac{2}{10}(0) + \frac{4}{10}(0.811) = 0.3244 + 0 + 0.3244 = 0.6488$$

**Information Gain for Outlook:**
$$\text{IG}(\text{Outlook}) = \text{Entropy}(S) - \text{Entropy}_{\text{weighted}} = 0.971 - 0.6488 = 0.3222$$

---

##### Attribute 2: Temperature
Temperature ke paas 3 values hain: **Hot (3 rows)**, **Mild (3 rows)**, **Cool (4 rows)**.

* **Hot** (Rows: 1, 2, 3) ──► Yes = 1, No = 2
  $$\text{Entropy}(\text{Hot}) = - \left( \frac{1}{3} \log_2 \frac{1}{3} + \frac{2}{3} \log_2 \frac{2}{3} \right) \approx 0.918$$

* **Mild** (Rows: 4, 8, 10) ──► Yes = 2, No = 1
  $$\text{Entropy}(\text{Mild}) = - \left( \frac{2}{3} \log_2 \frac{2}{3} + \frac{1}{3} \log_2 \frac{1}{3} \right) \approx 0.918$$

* **Cool** (Rows: 5, 6, 7, 9) ──► Yes = 3, No = 1
  $$\text{Entropy}(\text{Cool}) = - \left( \frac{3}{4} \log_2 \frac{3}{4} + \frac{1}{4} \log_2 \frac{1}{4} \right) \approx 0.811$$

**Weighted Entropy of Temperature Split:**
$$\text{Entropy}_{\text{weighted}} = \frac{3}{10}(0.918) + \frac{3}{10}(0.918) + \frac{4}{10}(0.811) = 0.2754 + 0.2754 + 0.3244 = 0.8752$$

**Information Gain for Temperature:**
$$\text{IG}(\text{Temperature}) = 0.971 - 0.8752 = 0.0958$$

---

##### Attribute 3: Humidity
Humidity ke paas 2 values hain: **High (6 rows)**, **Normal (4 rows)**.

* **High** (Rows: 1, 2, 3, 4, 8) ──► Yes = 2, No = 4
  $$\text{Entropy}(\text{High}) = - \left( \frac{2}{6} \log_2 \frac{2}{6} + \frac{4}{6} \log_2 \frac{4}{6} \right) \approx 0.918$$

* **Normal** (Rows: 5, 6, 7, 9, 10) ──► Yes = 4, No = 0 (Normal humidity par humesha Tennis khela hai, so 100% pure!)
  $$\text{Entropy}(\text{Normal}) = 0$$

**Weighted Entropy of Humidity Split:**
$$\text{Entropy}_{\text{weighted}} = \frac{6}{10}(0.918) + \frac{4}{10}(0) = 0.5508$$

**Information Gain for Humidity:**
$$\text{IG}(\text{Humidity}) = 0.971 - 0.5508 = 0.4202$$

> [!TIP]
> Yahan humne dekha ki **Humidity** ka split sabse highest Information Gain ($0.4202$) de raha hai, iske baad **Outlook** ($0.3222$). Decision tree highest gain wale feature ko pehle split karne ke liye select karega!

---

### Code Implementation 3: COVID-19 Diagnosis
Decision tree patient features (`Fever`, `Cough`, `BreathingProblem`) ke help se predict karega ki patient **COVID Positive** hai ya **COVID Negative**.

```python
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# Dataset creation
data = {
    "Fever": [98, 99, 100, 101, 102, 103, 98, 99, 101, 102],
    "Cough": [0, 0, 1, 1, 1, 1, 0, 1, 1, 1],
    "BreathingProblem": [0, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    "COVID_Status": ["Negative", "Negative", "Negative", "Positive", "Positive", "Positive", "Negative", "Negative", "Positive", "Positive"]
}
df = pd.DataFrame(data)

X = df[["Fever", "Cough", "BreathingProblem"]]
y = df["COVID_Status"]

# Model fitting
model = DecisionTreeClassifier(criterion='entropy') # Entropy criterion specification
model.fit(X, y)

# Prediction
fever = float(input("Enter Temperature (°F): "))
cough = int(input("Cough? (1=Yes, 0=No): "))
breathing = int(input("Breathing Problem? (1=Yes, 0=No): "))

prediction = model.predict([[fever, cough, breathing]])
print(f"\nPredicted COVID Status: {prediction[0]}")

# Accuracy checking
y_pred = model.predict(X)
print(f"Accuracy: {accuracy_score(y, y_pred) * 100}%")
```

---

## 5. Multi-Class Classification & Iris Flower Project

Jab Target variable mein **2 se zyada classes** (E.g., Class A / Class B / Class C) predict karni hon, tab hum use karte hain Multi-Class Classification.

### The Famous Iris Flower Classification:
Iris dataset mein flowers ki teen alag-alag species predict karni hoti hain:
1. **Setosa**
2. **Versicolor**
3. **Virginica**

Features jo use hote hain:
* Sepal Length (cm)
* Sepal Width (cm)
* Petal Length (cm)
* Petal Width (cm)

```
[ sepal_length, sepal_width, petal_length, petal_width ] ──► [ Model ] ──► Setosa / Versicolor / Virginica
```

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# 1. Dataset read karna (CSV file)
df = pd.read_csv("iris.csv")

# 2. Split features and target
X = df.drop("species", axis=1) # Target column drop karke features lena
y = df["species"]

# 3. Train-Test Split (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Model instantiation and training
model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# 5. Predictions calculation
y_pred = model.predict(X_test)

# 6. User measurement inputs
print("\nEnter Flower Measurements:")
sepal_length = float(input("Sepal Length (4.3 - 7.9): "))
sepal_width  = float(input("Sepal Width (2.0 - 4.4): "))
petal_length = float(input("Petal Length (1.0 - 6.9): "))
petal_width  = float(input("Petal Width (0.1 - 2.5): "))

sample = [[sepal_length, sepal_width, petal_length, petal_width]]
prediction = model.predict(sample)

print(f"\nPredicted Flower Species: {prediction[0]}")
print(f"Model Test Accuracy: {round(accuracy_score(y_test, y_pred) * 100, 2)}%")
```

---

*Banaya with 💙, thodi math aur dher saari Hinglish ke sath! 😎 | CPUR Agentic AI Course | Day 13*
