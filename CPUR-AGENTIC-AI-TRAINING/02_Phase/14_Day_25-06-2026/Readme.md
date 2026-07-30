# Day 14: Model Evaluation & Classification Metrics 📊

Welcome to the Day 14 learning guide! Aaj hum seekhenge **Model Evaluation** ke baare mein. Model bana to liya, par woh kitna achha ya bura hai, yeh kaise pata chalega? Iske liye hum seekhenge train-test split ka concept aur classification metrics jaise **Accuracy**, **Precision**, **Recall**, **F1-Score**, aur **Confusion Matrix** ko ekdum simple Hinglish mein! 🚀

---

## Table of Contents
1. [Model Evaluation Kya Hai?](#1-model-evaluation-kya-hai)
2. [Train-Test Split Kyon aur Kaise Karte Hain?](#2-train-test-split-kyon-aur-kaise-karte-hain)
3. [Accuracy Score aur Iski Limitation](#3-accuracy-score-aur-iski-limitation)
4. [Confusion Matrix (The Ultimate Grid)](#4-confusion-matrix-the-ultimate-grid)
5. [Derived Metrics (Precision, Recall, F1-Score)](#5-derived-metrics-precision-recall-f1-score)
6. [Python Code: Manual vs. Sklearn Metrics](#6-python-code-manual-vs-sklearn-metrics)

---

## 1. Model Evaluation Kya Hai?

Model Evaluation ka matlab hai check karna ki humara model **naye aur unseen (jis par train nahi kiya) data** par kaisa perform kar raha hai.

### Ek Desi Example Se Samjho: 📚
Maan lo aapke exam aane wale hain aur do scenarios hain:
* **Scenario 1 (Ratta Maar/Overfitting)**: Aapne notebook ke saare questions rat liye. Teacher ne wahi same questions pooche to aapne 100/100 score kar liya. Par final exam mein jab naye questions aaye, to aapka score **60/100** ho gaya. Iska matlab aapne concepts nahi samjhe, sirf notebook ko **memorize** (ratta) kiya tha.
* **Scenario 2 (Conceptual Learning)**: Aapne pattern samjha. Jab naye questions aaye, tab bhi aapne achha score kiya.

Machine Learning mein bhi aisa hi hota hai. Model agar training data par 100% sahi ho jaye par naye test data par fail ho jaye, to use **Overfitting** bolte hain. Isliye evaluation bahut zaroori hai!

---

## 2. Train-Test Split Kyon aur Kaise Karte Hain?

Hum pure dataset ko do bhaag mein divide karte hain:
1. **Training Data (Aksar 80%)**: Isse model patterns ko seekhta hai.
2. **Testing Data (Aksar 20%)**: Is par model ko test kiya jata hai ki use kitna samajh aaya.

```
┌─────────────────────────────────────────────────────────────┐
│                       Total Dataset                         │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
  ┌───────────────────────────┐   ┌───────────────────────────┐
  │    Training Data (80%)    │   │     Testing Data (20%)    │
  │    (Model seekhta hai)    │   │    (Test kiya jata hai)   │
  └───────────────────────────┘   └───────────────────────────┘
```

### Common Split Ratios:
* **80% Train | 20% Test** ✅ (Sabse zyada use hota hai)
* **70% Train | 30% Test**
* **90% Train | 10% Test** (Bade datasets ke liye)

### Scikit-Learn Code:
```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```

* `test_size=0.2` ka matlab hai 20% test data aur 80% training data.
* `random_state=42` ensures ki jab bhi aap code run karein, data ka split bilkul **same** ho.

### Split Output Variables:
| Variable | Description |
| :--- | :--- |
| `X_train` | Training inputs (features) jo model ko seekhne ke liye diye jate hain. |
| `X_test` | Testing inputs jinka use prediction nikalne ke liye kiya jata hai. |
| `y_train` | Training outputs (actual targets) jo model ko verify karne ke liye milte hain. |
| `y_test` | Testing outputs (actual targets) jisse final performance compare ki jati hai. |

---

## 3. Accuracy Score aur Iski Limitation

**Accuracy** ka matlab hai ki total predictions mein se model ne kitne predictions **sahi** kiye.

$$\text{Accuracy} = \frac{\text{Number of Correct Predictions}}{\text{Total Predictions}} \times 100$$

### Example (SMS Spam Detection):
Suppose aapke paas 4 messages hain:
| Actual Status | Model Prediction | Correct? |
| :--- | :--- | :---: |
| Spam | Spam | ✅ |
| Ham (Not Spam) | Ham | ✅ |
| Spam | Spam | ✅ |
| Ham | Spam | ❌ |

Total = 4, Correct = 3.
$$\text{Accuracy} = \frac{3}{4} = 75\%$$

---

### ⚠️ Limitation of Accuracy (Imbalanced Dataset Problem)
Maan lo aapke paas 100 messages hain, jisme se:
* **95** Normal Messages (Ham) hain.
* **5** Fraud Messages (Spam) hain.

Agar ek bekar model banaya jaye jo **kuch nahi seekhta** aur har message ko "Ham" bol deta hai, to:
* 95 Ham messages ko sahi batayega (Correct = 95).
* 5 Spam messages ko bhi Ham batayega (Incorrect = 5).

$$\text{Accuracy} = \frac{95}{100} = 95\%$$

Model kuch seekha nahi, fir bhi **95% accuracy** aa gayi! Lekin yeh model real life mein saare spam messages aane dega. Is problem se bachne ke liye hum baaki metrics use karte hain!

---

## 4. Confusion Matrix (The Ultimate Grid)

Confusion Matrix ek aisi table hai jo actual values aur predicted values ko compare karke model ka dimaag kitna confused hai, yeh batati hai. 😵💫

```
                    Predicted Class
                  ┌─────────────────┐
                  │  Spam  │   Ham  │
         ┌────────┼────────┼────────┤
         │  Spam  │   TP   │   FN   │  ◄── False Negative (FN)
  Actual │ (Pos)  │        │        │
  Class  ├────────┼────────┼────────┤
         │  Ham   │   FP   │   TN   │  ◄── False Positive (FP)
         │ (Neg)  │        │        │
         └────────┴────────┴────────┘
                      ▲
                      └── False Positive (FP)
```

Let's breakdown these terms:

1. **TP (True Positive)**:
   * **Hinglish**: Model ne "Positive" kaha, aur actual mein bhi "Positive" tha.
   * *Example*: Spam prediction `Spam` tha, aur email actual mein bhi `Spam` tha. ✅
2. **TN (True Negative)**:
   * **Hinglish**: Model ne "Negative" kaha, aur actual mein bhi "Negative" tha.
   * *Example*: Email ko `Ham` (Not Spam) bola, aur actual mein bhi `Ham` tha. ✅
3. **FP (False Positive) - Type I Error**:
   * **Hinglish**: Model ne "Positive" keh diya, par actual mein woh "Negative" tha. (Galti se haan kar di! 🤦‍♂️)
   * *Example*: Normal email ko model ne `Spam` folder mein bhej diya. ❌
4. **FN (False Negative) - Type II Error**:
   * **Hinglish**: Model ne "Negative" keh diya, par actual mein woh "Positive" tha. (Dhoka ho gaya! 🕵️‍♂️)
   * *Example*: Important spam email ko normal inbox (`Ham`) mein aane diya. ❌

---

## 5. Derived Metrics (Precision, Recall, F1-Score)

Confusion matrix ke use se hum baaki important metrics nikalte hain:

### 1. Precision (Sahiyata / Accuracy of Positives) 🎯
> **"Out of all samples predicted as Positive, how many were actually Positive?"**
Hum ise tab target karte hain jab **False Positive (FP) rokna** sabse critical ho. (Jaise normal email spam mein na chala jaye).

$$\text{Precision} = \frac{TP}{TP + FP}$$

### 2. Recall (Sensitivity / Packad-Dhar capability) 🔍
> **"Out of all actual Positive samples, how many did the model correctly catch?"**
Hum ise tab target karte hain jab **False Negative (FN) rokna** sabse critical ho. (Jaise kisi cancer patient ko model 'healthy' na keh de).

$$\text{Recall} = \frac{TP}{TP + FN}$$

### 3. F1-Score (The Balance) ⚖️
Precision aur Recall ke beech ka **Harmonic Mean** hota hai. Jab dataset imbalanced ho aur hum dono False Positive aur False Negative ko control karna chahein.

$$\text{F1-Score} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$

---

### Example Calculation:
Maan lo humare paas cancer diagnostic test ka data hai:
* **TP** = 40 (Sahi cancer detect kiya)
* **TN** = 50 (Sahi healthy detect kiya)
* **FP** = 5 (Healthy ko cancer bola)
* **FN** = 5 (Cancer patient ko healthy bola)

* **Accuracy** = $\frac{TP + TN}{TP + TN + FP + FN} = \frac{40 + 50}{100} = 90\%$
* **Precision** = $\frac{TP}{TP + FP} = \frac{40}{40 + 5} = 88.89\%$
* **Recall** = $\frac{TP}{TP + FN} = \frac{40}{40 + 5} = 88.89\%$
* **F1-Score** = $2 \times \frac{0.8889 \times 0.8889}{0.8889 + 0.8889} = 88.89\%$

---

## 6. Python Code: Manual vs. Sklearn Metrics

Hum simple data check karenge aur verify karenge ki humari manual calculation aur scikit-learn ki calculation matching hain ya nahi.

```python
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score

# 1. Actual status (1 = Spam, 0 = Ham)
y_true = [1, 0, 1, 1, 0, 1, 0, 1]

# 2. Model's predicted values
y_pred = [1, 0, 1, 0, 0, 1, 1, 1]

# 3. Get Confusion Matrix
cm = confusion_matrix(y_true, y_pred)
print("Confusion Matrix:")
print(cm)

# Extract values from 2x2 grid
TN, FP, FN, TP = cm.ravel()
print(f"\nTN (True Negative)  = {TN}")
print(f"FP (False Positive) = {FP}")
print(f"FN (False Negative) = {FN}")
print(f"TP (True Positive)  = {TP}")

# 4. Manual Calculations
accuracy = (TP + TN) / (TP + TN + FP + FN)
precision = TP / (TP + FP)
recall = TP / (TP + FN)
f1 = 2 * (precision * recall) / (precision + recall)

print("\n--- Manual Calculation Results ---")
print(f"Accuracy  : {round(accuracy * 100, 2)}%")
print(f"Precision : {round(precision * 100, 2)}%")
print(f"Recall    : {round(recall * 100, 2)}%")
print(f"F1-Score  : {round(f1 * 100, 2)}%")

# 5. Sklearn API Calculations
print("\n--- Sklearn Library Results ---")
print(f"Accuracy  : {round(accuracy_score(y_true, y_pred) * 100, 2)}%")
print(f"Precision : {round(precision_score(y_true, y_pred) * 100, 2)}%")
print(f"Recall    : {round(recall_score(y_true, y_pred) * 100, 2)}%")
print(f"F1-Score  : {round(f1_score(y_true, y_pred) * 100, 2)}%")
```

---

*Banaya with 💙, conceptual learning aur Hinglish ke sath! 😎 | CPUR Agentic AI Course | Day 14*
