# 📋 Kaggle Dataset & ML Models: Assignment Checklist & Status Report

This directory tracks the completion and Kaggle upload status of the 10 machine learning models required for your teacher's assignment.

---

## 🎯 Teacher's Rules & Guidelines
1. **The correct Kaggle dataset must be used** (no synthetic/in-memory datasets, except where explicitly appropriate).
2. **The model must run without errors**.
3. **Proper preprocessing, training, and evaluation must be included** (e.g., train-test splits, model evaluation metrics, EDA plots).
4. **Submit all 10 completed models on time**.

---

## 📊 Summary Status Dashboard

| # | Model / Assignment Name | Local Dataset Path | Local Notebook Path | Kaggle Uploaded | EDA & Plots | Train/Test Split | ML Model Trained | Status & Remarks |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **1** | **COVID-19** | ❌ None | [Covid19_Model.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/01_COVID-19/Covid19_Model.ipynb) | ❌ No | ❌ No | ❌ No | ⚠️ Partial | **Incomplete:** Uses synthetic 10-row dataset instead of Kaggle dataset. Needs rewrite. |
| **2** | **House Price Prediction** | [kc_house_clean_data.csv](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/02_House_Price_Prediction/kc_house_clean_data.csv) | [02_House_model.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/02_House_Price_Prediction/02_House_model.ipynb) | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | **Partially Complete:** Model trains, but fits on entire dataset (no train-test split). |
| **3** | **IPL Analysis** | [IPL_DataSet_Cleaned.csv](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/03_IPL_Analysis/IPL_DataSet_Cleaned.csv) | [IPL_Capstone_Project.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/03_IPL_Analysis/IPL_Capstone_Project.ipynb) | ✅ Yes | ✅ Yes | ❌ No | ❌ No | **Incomplete:** Rich EDA exists, but no Machine Learning model is trained. |
| **4** | **Student Marks Analysis** | [student_marks_cleaned.csv](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/04_Student_Marks_Analysis/student_marks_cleaned.csv) | [03_Student_Marks.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/04_Student_Marks_Analysis/03_Student_Marks.ipynb) | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | **Partially Complete:** Model trains, but fits on entire dataset (no train-test split). |
| **5** | **Iris Classification** | [Iris.csv](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/05_Iris_Classification/Iris.csv) | [Iris_.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/05_Iris_Classification/Iris_.ipynb) | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes | **Completed Locally:** Model and EDA are perfect. Needs Kaggle dataset/notebook upload. |
| **6** | **FIFA Player Prediction** | [fifa_world_cup_2026_player_performance.csv](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/06_FIFA_Player_Prediction/fifa_world_cup_2026_player_performance.csv) | ❌ None | ❌ No | ❌ No | ❌ No | ❌ No | **Missing:** No player prediction notebook exists (only World Cup history assignments). |
| **7** | **Loan Approval Prediction** | [loan_approval_dataset_cleaned.csv](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/07_Loan_Approval_Prediction/loan_approval_dataset_cleaned.csv) | [Loan_Approval_DataSet.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/07_Loan_Approval_Prediction/Loan_Approval_DataSet.ipynb) | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | **Fully Completed:** Correctly uses scaling, train-test split, and RandomForest. |
| **8** | **Netflix Recommendation/Analysis** | [netflix_data_cleaned.csv](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/08_Netflix_Recommendation_Analysis/netflix_data_cleaned.csv) | [netflix_data.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/08_Netflix_Recommendation_Analysis/netflix_data.ipynb) | ✅ Yes | ✅ Yes | ❌ No | ❌ No | **Incomplete:** Excellent EDA, but no Machine Learning model is trained. |
| **9** | **Mall Customer Segmentation** | [Mall_Customers.csv](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/09_Mall_Customer_Segmentation/Mall_Customers.csv) | [mall_customer_dataset_analysis-ayan.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/09_Mall_Customer_Segmentation/mall_customer_dataset_analysis-ayan.ipynb) | ❌ No | ✅ Yes | ❌ No | ❌ No | **Incomplete:** EDA only. Needs clustering model (e.g. KMeans) and Kaggle upload. |
| **10** | **Titanic Survival Prediction** | [train_cleaned.csv](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/10_Titanic_Survival_Prediction/train_cleaned.csv) | [10_Analysis.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/10_Titanic_Survival_Prediction/10_Analysis.ipynb) | ❌ No | ✅ Yes | ❌ No | ❌ No | **Incomplete:** EDA only. Needs classification model (e.g. Logistic Regression) and Kaggle upload. |

---

## 🔍 Detailed Analysis & Required Fixes

### 1. COVID-19
* **Current State:** The local file [Covid19_Model.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/01_COVID-19/Covid19_Model.ipynb) creates a synthetic Python dictionary of just 10 rows and fits a Decision Tree. It lacks real-world EDA and evaluation.
* **Kaggle Status:** Not uploaded.
* **Required Action:**
  1. Find and download a standard COVID-19 dataset from Kaggle (e.g., Symptoms Tracker).
  2. Implement proper preprocessing (handling missing values, encoding), split the dataset into Train/Test, train a Classifier, and evaluate with an Accuracy Score/Confusion Matrix.
  3. Upload the dataset and notebook to Kaggle.

### 2. House Price Prediction
* **Current State:** [02_House_model.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/02_House_Price_Prediction/02_House_model.ipynb) contains good EDA and trains a `LinearRegression` model using features: `bedrooms`, `bathrooms`, `sqft_living`, `sqft_lot`, `floors`.
* **Kaggle Status:** Clean dataset is uploaded as `kc_house_clean_data.csv`.
* **Required Action:**
  1. Add `train_test_split` to split the clean data into train and test sets.
  2. Train the model on the train set and evaluate it on the test set using standard regression metrics (e.g., $R^2$ Score, MSE, RMSE).

### 3. IPL Analysis
* **Current State:** [IPL_Capstone_Project.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/03_IPL_Analysis/IPL_Capstone_Project.ipynb) contains excellent and rich visualizations of teams, match wins, venues, toss factors, etc. However, it does not build or evaluate any Machine Learning model.
* **Kaggle Status:** Clean dataset is uploaded as `ipl_dataSet_cleaned.csv`.
* **Required Action:**
  1. Build a classification model to predict the match winner (`winner`) using features like `team1`, `team2`, `venue`, `toss_winner`, and `toss_decision`.
  2. Perform categorical encoding (e.g., Label Encoding / One-Hot Encoding), split the dataset, train a classifier (e.g., Decision Tree or Random Forest), and print the accuracy/confusion matrix.

### 4. Student Marks Analysis
* **Current State:** [03_Student_Marks.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/04_Student_Marks_Analysis/03_Student_Marks.ipynb) fits a `LinearRegression` model to predict `Marks` from `number_courses` and `time_study`.
* **Kaggle Status:** Clean dataset is uploaded as `Students Marks Cleaned`.
* **Required Action:**
  1. Implement `train_test_split` (e.g. 80-20 split).
  2. Train the model on training data and print $R^2$ score / Mean Absolute Error on test data to show proper evaluation.

### 5. Iris Classification
* **Current State:** [Iris_.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/05_Iris_Classification/Iris_.ipynb) is complete and properly uses `train_test_split`, trains a `DecisionTreeClassifier`, and evaluates test accuracy.
* **Kaggle Status:** Dataset not uploaded.
* **Required Action:**
  1. Upload the clean Iris dataset and notebook to Kaggle.

### 6. FIFA Player Prediction
* **Current State:** You have the dataset [fifa_world_cup_2026_player_performance.csv](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/06_FIFA_Player_Prediction/fifa_world_cup_2026_player_performance.csv) locally, but there is no notebook or code for this player-level prediction. (Note: `FiFA_MODEL.ipynb` in assignments is for country-level historical tournament predictions, not players).
* **Kaggle Status:** Dataset not uploaded.
* **Required Action:**
  1. Create a new notebook `FIFA_Player_Prediction.ipynb`.
  2. Perform EDA, preprocess features (e.g., age, position, minutes_played), split the data, and build a model to predict player ratings (`player_rating`) or market values.
  3. Upload the dataset and notebook to Kaggle.

### 7. Loan Approval Prediction
* **Current State:** Fully complete! The notebook [Loan_Approval_DataSet.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/07_Loan_Approval_Prediction/Loan_Approval_DataSet.ipynb) contains EDA, data cleaning, stratified train-test splitting, feature scaling (StandardScaler), and a Random Forest Classifier with evaluation metrics.
* **Kaggle Status:** Clean dataset is uploaded as `LOAN APPROVED CLEAN DATASET`.
* **Required Action:** None. This model is ready for final submission.

### 8. Netflix Recommendation/Analysis
* **Current State:** [netflix_data.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/08_Netflix_Recommendation_Analysis/netflix_data.ipynb) performs solid EDA on TV shows vs. Movies, release years, ratings, etc. It does not train any model.
* **Kaggle Status:** Clean dataset is uploaded as `netflix_data_cleaned.csv`.
* **Required Action:**
  1. Add a Machine Learning component. An excellent addition is a **Content-Based Recommendation System** using text processing (TF-IDF Vectorizer) on titles, descriptions, and genres to compute Cosine Similarity scores.
  2. Alternatively, build a classification model to classify content as Movie vs. TV Show.

### 9. Mall Customer Segmentation
* **Current State:** [mall_customer_dataset_analysis-ayan.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/09_Mall_Customer_Segmentation/mall_customer_dataset_analysis-ayan.ipynb) contains distribution and box plots but has no machine learning.
* **Kaggle Status:** Dataset not uploaded.
* **Required Action:**
  1. Preprocess features like `Annual Income (k$)` and `Spending Score (1-100)`.
  2. Train an unsupervised **K-Means Clustering** model.
  3. Include the **Elbow Method** (inertia plot) and **Silhouette Score** to choose the optimal number of clusters (e.g., k=5), and plot the final segmented clusters.
  4. Upload the dataset and notebook to Kaggle.

### 10. Titanic Survival Prediction
* **Current State:** [10_Analysis.ipynb](file:///c:/Users/Aditya/Desktop/CPUR-Agentic-AI/kaggle-Dataset-Uploaded/10_Titanic_Survival_Prediction/10_Analysis.ipynb) performs data exploration and cleaning on Titanic passengers but does not build any ML classifier.
* **Kaggle Status:** Dataset not uploaded.
* **Required Action:**
  1. Implement preprocessing (handle missing values for Age and Embarked, encode gender/embarked).
  2. Split the data using `train_test_split`.
  3. Train a classification model (e.g., Logistic Regression, Decision Tree, or Random Forest) to predict `Survived`.
  4. Evaluate the model with an accuracy score and classification report on the test set.
  5. Upload the dataset and notebook to Kaggle.

---

## 🚀 Recommended Action Plan
To successfully complete the checklist and meet the teacher's guidelines:
1. **Fix partial models** (House Price, Student Marks) by adding `train_test_split` and proper evaluation metrics.
2. **Implement missing models** for EDA-only notebooks (IPL, Netflix, Mall Customers, Titanic, COVID-19, and FIFA Player).
3. **Upload remaining datasets** (COVID-19, Iris, FIFA Player, Mall Customers, Titanic) to Kaggle and verify they are all listed under your Kaggle account.
