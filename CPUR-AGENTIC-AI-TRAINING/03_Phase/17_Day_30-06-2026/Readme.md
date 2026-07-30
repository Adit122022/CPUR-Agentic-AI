# Day 17: Deep Learning & Artificial Neural Networks (ANNs) 🧠⚡

Welcome to Day 17 of the Agentic AI Internship! Aaj hum seekhenge **Deep Learning (DL)** aur **Artificial Neural Networks (ANN)** ke baare me bilkul basic se lekar practical model build karne tak. Developer perspective se kya important hai, code me kaunsi details dhyan rakhni hai, sab kuch ekdum funny Hinglish me samjhenge! 🚀

---

## 📅 Table of Contents
1. [Deep Learning Kya Hai? (No Feature Engineering!)](#1-deep-learning-kya-hai-no-feature-engineering)
2. [AI vs ML vs DL: Clear Difference](#2-ai-vs-ml-vs-dl-clear-difference)
3. [Neural Network Ka Structure (Layer by Layer)](#3-neural-network-ka-structure-layer-by-layer)
4. [Artificial Neuron (Perceptron) & The Core Math](#4-artificial-neuron-perceptron--the-core-math)
5. [Developer Perspective: Activation Functions](#5-developer-perspective-activation-functions)
6. [Step-by-Step Code implementation (Keras Sequential API)](#6-step-by-step-code-implementation-keras-sequential-api)
7. [Notebook & Colab Links](#7-notebook--colab-links)

---

## 1. Deep Learning Kya Hai? (No Feature Engineering!)

Traditional Machine Learning me sabse bada sir-dard hota tha **Feature Engineering**—yani programmer ko khud decide karna padta tha ki model ko train karne ke liye kaun-kaun se patterns/features extract karne hain (e.g. image me corners, edges, circles check karna).

**Deep Learning (DL)** me yeh sir-dard khatam ho gaya! DL algorithm features ko **automatically** data se learn kar leta hai.

```
[Traditional ML]: Raw Data ──► Manual Feature Extraction ──► ML Algorithm ──► Output
[Deep Learning] : Raw Data ────────────────────────────────► Deep ANN      ──► Output
```

### 🧐 Why "Deep"?
Agar neural network me sirf 1 Hidden Layer ho, toh use hum **Shallow Neural Network** bolte hain. Par agar bohot saare Hidden Layers aapas me stacked hon, toh use hum **Deep Neural Network (Deep Learning)** kehte hain.

---

## 2. AI vs ML vs DL: Clear Difference

In teen terms me confuse hone ki zaroorat nahi hai:

* **Artificial Intelligence (AI)**: Wo bada umbrella jo computer ko smart banata hai (Rule-based programs + ML + DL).
* **Machine Learning (ML)**: AI ka subset jahan machine patterns data se seekhti hai, bina manually rule likhe (e.g., Linear Regression, Random Forest).
* **Deep Learning (DL)**: ML ka subset jo **Multi-layered Artificial Neural Networks** use karta hai unstructured data (like images, text, speech) par solid accuracy lane ke liye.

---

## 3. Neural Network Ka Structure (Layer by Layer)

Ek Neural Network teen main components se banta hai:

```
[ Input Layer ] ──► [ Hidden Layer(s) ] ──► [ Output Layer ]
```

1. **Input Layer (Entry Gate)**: Is layer me koi calculation nahi hoti. Iska kaam sirf inputs receive karna aur aage pass karna hai. 
   > **Developer Tip:** Input layer me neurons ki count humare features ke barabar hoti hai. Agar image 28x28 pixels ki hai, toh total input neurons = 784 honge!
2. **Hidden Layer (Dimaag/Engine)**: Yeh layers user ko directly nahi dikhti (isliye name "hidden" hai). Iska kaam patterns aur relationships identify karna hai.
   - **Layer 1** basic lines/edges seekhta hai.
   - **Layer 2** curves aur simple shapes (eyes, nose) seekhta hai.
   - **Layer 3** complex objects (face structure) seekhta hai.
3. **Output Layer (Final Prediction)**: Final result produce karti hai.
   - Regression task ke liye: 1 neuron (no activation function).
   - Binary Classification ke liye: 1 neuron (Sigmoid activation).
   - Multi-class Classification ke liye: $N$ neurons (Softmax activation).

---

## 4. Artificial Neuron (Perceptron) & The Core Math

Ek singular Neuron (Perceptron) ki mathematical working samjho. Yahi sabse important fundamental concept hai:

```
Inputs (x) ────► (Multiply by Weights 'w') ──► [ Summation (Σ) + Bias (b) ] ──► [ Activation Function ] ──► Output
```

### 🧮 Pure Mathematical Components:

1. **Inputs ($x_1, x_2, ...$):** Humara incoming data (e.g., student hours, attendance).
2. **Weights ($w_1, w_2, ...$):** **Importance/Influence parameter.** Weight batata hai ki kaun sa input label ko predict karne me kitna zaroori hai. (Higher weight = High importance).
3. **Weighted Sum ($z$):** Inputs ko unke respective weights se multiply karke add kiya jata hai:
   $$z = w_1 x_1 + w_2 x_2 + ... + w_n x_n$$
4. **Bias ($b$):** **Offset/Shift parameter.** Agar inputs zero bhi ho jayein, toh bias model ko control deta hai output shift karne ka. Agar bias na ho, toh prediction hamesha origin $(0, 0)$ se pass hogi jo model ki learning capabilites ko restrict karegi.
5. **Activation Function ($f$):** **The Gatekeeper.** Weighted sum aur bias add karne ke baad final score ko is function se pass kiya jata hai. Iska main kaam network me **Non-Linearity** add karna hai, taaki network complex, curved boundaries seekh sake.

---

## 5. Developer Perspective: Activation Functions

Bina Activation Function ke, pure neural network chahe 100 layers ka ho, math solve karne par end me ek simple linear equation ($y = mx + c$) hi bachega. So, Non-Linearity add karna zaroori hai!

| Activation Function | Output Range | Best Used In | Working Intuition |
| :--- | :--- | :--- | :--- |
| **ReLU (Rectified Linear Unit)** | $[0, \infty)$ | Hidden Layers (Default) | `max(0, x)`. Agar negative value hai toh seedhe $0$, positive hai toh same value aage pass. Bohat fast hai aur gradient vanishing problem avoid karta hai. |
| **Sigmoid** | $[0, 1]$ | Binary Classification Output | Output ko probability (0 to 1) me convert karta hai. (E.g., Student Pass or Fail). |
| **Softmax** | $[0, 1]$ (Sum of all outputs = 1) | Multi-class Classification Output | Sare class probabilities ka sum 1 banata hai. (E.g., Image of Cat vs Dog vs Cow). |
| **Tanh** | $[-1, 1]$ | Hidden Layers | Zero-centered output deta hai, but slow compute hota hai. |

---

## 6. Step-by-Step Code Implementation (Keras Sequential API)

Chalo TensorFlow/Keras use karke ek student prediction model banate hain jo padhai ke hours aur attendance dekhkar predict karega ki student pass hoga ya fail.

### 🛠️ Developer Checklist for DL Model:
1. **Scaling is Mandatory!** Neural network build karne se pehle features ko standard scale (`StandardScaler`) me convert karna mat bhoolna. Agar data dynamic scales me hoga (jaise hours 1-10 range me aur marks 0-100 me), toh loss converge hone me bohot time lagega.
2. **Input Shape:** Pehli hidden layer ko `input_shape` batana zaroori hai, jisse model ko pata chale ki input layer me kitne neurons banenge.
3. **Compile Configuration:**
   - **Adam Optimizer:** Standard adaptive learning rate gradient descent algorithm.
   - **Binary Crossentropy:** Classification loss jab sirf 2 classes hon.

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# 1. Dataset
data = {
    "Study_Hours": [6, 5, 4, 3, 2, 1, 7, 5, 4, 2],
    "Attendance": [95, 90, 85, 60, 55, 40, 98, 88, 75, 45],
    "Previous_Marks": [90, 85, 80, 50, 45, 30, 95, 82, 70, 35],
    "Pass": [1, 1, 1, 0, 0, 0, 1, 1, 1, 0]
}
df = pd.DataFrame(data)

# 2. X and y split
X = df[["Study_Hours", "Attendance", "Previous_Marks"]]
y = df["Pass"]

# 3. Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Feature Scaling (Bohot zaroori step!)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# 5. Define Model Architecture
model = Sequential([
    # Hidden Layer 1: 8 Neurons, input features 3
    Dense(8, activation="relu", input_shape=(3,)),
    # Hidden Layer 2: 4 Neurons
    Dense(4, activation="relu"),
    # Output Layer: 1 Neuron, Sigmoid (since binary output - Pass/Fail)
    Dense(1, activation="sigmoid")
])

# 6. Compile Model
model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

# 7. Train Model
# Epochs: Kitni baar pura data model me traverse hoga
# Batch Size: Ek baar me kitne data records process honge backpropagation se pehle
model.fit(X_train, y_train, epochs=100, batch_size=2, verbose=1)

# 8. Evaluation
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {accuracy * 100:.2f}%")

# 9. Prediction for new student [Study_Hours=5, Attendance=90, Previous_Marks=82]
new_student = scaler.transform([[5, 90, 82]])
prediction = model.predict(new_student)
print("Pass probability:", prediction[0][0])
```

---

## 7. Notebook & Colab Links

* 📓 **Jupyter Notebook File:** [📂 View Day 17 Notebook](./Notebook/17_Notebook.ipynb)
* ⚡ **Live Google Colab Notebook:** [![Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1kTD0xPAXOnMhnYWakYbD67NFcy1PZ2K0?usp=sharing#scrollTo=ncD2OSPcsNj8)
