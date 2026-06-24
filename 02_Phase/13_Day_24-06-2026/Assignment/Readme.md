# 📊 Assignment Submission: Credit Score Prediction Model

This repository contains the completed assignment for the **Credit Score Prediction Model (Good / Average / Poor)** using a Logistic Regression model as taught in class.

## 🚀 Submission Overview
- **Notebook File:** [Credit_Score_Prediction_Model.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/02_Phase/13_Day_24-06-2026/Assignment/Credit_Score_Prediction_Model.ipynb)
- **Train Dataset:** [CreditScore_train.csv](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/02_Phase/DataSet/credit_score/CreditScore_train.csv)
- **Test Dataset:** [CreditScore_test.csv](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/02_Phase/DataSet/credit_score/CreditScore_test.csv)
- **Final Model:** Logistic Regression (`max_iter=1000`)

---

## 📈 Model Performance & Accuracy
- **Training Accuracy:** `76.52%`
- **Test Accuracy:** `76.83%`

The model achieves a very solid ~76.8% accuracy on the test set, demonstrating good generalization without overfitting.

---

## 🖼️ Output Screenshots / Plots
Here are the plots generated during the execution of the notebook:

### Credit Score Class Distribution
This plot shows the distribution of mapped credit score categories (`Poor`, `Average`, `Good`) in the training dataset:

![Distribution of Credit Score Categories](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/02_Phase/13_Day_24-06-2026/Assignment/credit_score_distribution.png)

---

## 🛠️ Step-by-Step Model Workflow

1. **Target Variable Categorization**:
   The continuous credit score `y` was mapped to three categories based on FICO ranges:
   - **Poor**: Score < 580
   - **Average**: 580 <= Score < 670
   - **Good**: Score >= 670

2. **Data Cleaning**:
   - Missing values in features were handled by replacing them with the **Median** values of the training dataset (using `fillna`).

3. **Model Training**:
   - We trained a **Logistic Regression** model using `sklearn.linear_model.LogisticRegression` as taught in class.

4. **Model Evaluation**:
   - Calculated the training and test accuracy using `accuracy_score` from `sklearn.metrics`.
   - Performed sample predictions on test set users showing individual category probabilities (`predict_proba`).

---

Best of Luck! 🚀
