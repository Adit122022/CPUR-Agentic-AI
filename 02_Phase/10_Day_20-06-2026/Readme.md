# Day 10 - Exploratory Data Analysis (EDA) & Data Cleaning

Welcome to **Day 10** of the Agentic AI Internship. Today's focus is on understanding the standard workflow for Exploratory Data Analysis (EDA) and practicing data cleaning techniques on real-world datasets.

---

## 📚 Table of Contents
1. [Standard EDA Workflow](#-standard-eda-workflow)
2. [Practice Datasets & Recommended Order](#-practice-datasets--recommended-order)
3. [Key Data Science Concepts](#-key-data-science-concepts)
4. [Jupyter Notebooks Index](#-jupyter-notebooks-index)
5. [Key Takeaways & Insights](#-key-takeaways--insights)

---

## 📊 Standard EDA Workflow

Exploratory Data Analysis (EDA) is an approach to analyzing data sets to summarize their main characteristics, often with visual methods. A standard industry workflow consists of the following **15 steps**:

1. **Load Dataset**: Read files into a DataFrame (e.g. using `pd.read_csv()`).
2. **Check Shape**: Inspect the dimensions (rows and columns) of the dataset.
3. **View Dataset Information**: Preview records using `.head()`, `.tail()`, and `.sample()`.
4. **Check Data Types**: Identify numerical vs categorical columns using `.dtypes` and `.info()`.
5. **Identify Missing Values**: Assess null count and percentage: `(df.isnull().sum() / len(df)) * 100`.
6. **Handle Missing Values**: Impute (mean, median, mode) or drop columns/rows based on null percentage.
7. **Check Duplicate Records**: Identify repeated rows: `df.duplicated().sum()`.
8. **Remove Duplicates**: Delete redundant entries: `df.drop_duplicates(inplace=True)`.
9. **Generate Statistical Summary**: Generate summary metrics using `.describe()`.
10. **Detect Outliers**: Identify anomalous values using the **IQR (Interquartile Range)** or Z-score method.
11. **Perform Univariate Analysis**: Analyze single variables individually (histograms, countplots, KDEs).
12. **Perform Bivariate Analysis**: Study relationships between two variables (scatter plots, crosstabs, bar charts).
13. **Correlation Analysis**: Quantify relationships using a Pearson Correlation matrix and Seaborn Heatmap.
14. **Feature Engineering**: Create new meaningful columns to improve data representation (e.g., combining columns).
15. **Draw Conclusions and Insights**: Write final conclusions and business recommendations.

---

## 📁 Practice Datasets & Recommended Order

For learning EDA and Data Cleaning, the following datasets are highly recommended:

1. **Titanic Dataset** (Kaggle: [brendan45774/test-file](https://www.kaggle.com/datasets/brendan45774/test-file))
   * *Focus*: Missing value imputation, outlier detection, and survival factor analysis.
2. **Students Performance Dataset** (Kaggle: [aljarah/xAPI-Edu-Data](https://www.kaggle.com/datasets/aljarah/xAPI-Edu-Data))
   * *Focus*: Categorical analysis, student engagement indicators, and multi-variable comparison.
3. **Mall Customers Dataset** (Kaggle: [amisha0528/mall-customers-dataset](https://www.kaggle.com/datasets/amisha0528/mall-customers-dataset))
   * *Focus*: Customer behavior patterns, age-wise spending distributions, and scatter plots.
4. **Netflix Movies & TV Shows Dataset** (Kaggle: [shivamb/netflix-shows](https://www.kaggle.com/datasets/shivamb/netflix-shows))
   * *Focus*: Date-time parsing, text processing, missing country imputation, and genre extraction.
5. **House Prices Dataset** (Kaggle: [harlfoxem/housesalesprediction](https://www.kaggle.com/datasets/harlfoxem/housesalesprediction))
   * *Focus*: High volume of missing data, house price correlations, and feature selection.

---

## 💡 Key Data Science Concepts

### 1. Handling Missing Data (Imputation Strategy)
* **High Missingness (>75%)**: Columns like `Cabin` in the Titanic dataset are dropped entirely because they contain too little information to be useful.
* **Numerical Columns**: Impute with **median** if distributions are skewed (e.g. `Age`, `Fare`) to prevent outlier distortion.
* **Categorical Columns**: Impute with the **mode** (e.g., `Embarked`, `country`) or fill with a placeholder like `"Unknown"`.

### 2. Outlier Detection (Interquartile Range - IQR)
Outliers are detected by calculating the boundaries:
$$IQR = Q3 - Q1$$
$$\text{Lower Boundary} = Q1 - 1.5 \times IQR$$
$$\text{Upper Boundary} = Q3 + 1.5 \times IQR$$
Data points falling outside these boundaries are flagged as outliers and removed to ensure model and visual consistency.

### 3. Univariate vs. Bivariate Analysis
* **Univariate**: Focuses on the distribution, spread, frequency, and central tendency of a *single* variable (e.g., histogram of `Age`, count plot of `Sex`).
* **Bivariate**: Explores the relationship between *two* variables (e.g., how passenger class affect survival using `crosstab` and count plots, or `Age` vs. `Fare` using scatter plots).

### 4. Feature Engineering
Creating synthetic features to expose patterns in the data:
* **FamilySize** = `SibSp` + `Parch` + `1`
* **IsAlone** = `1` if `FamilySize == 1` else `0`
* **EngagementScore** = Sum of student classroom activities (raised hands, discussion, etc.)

---

## 📓 Jupyter Notebooks Index

Click on the links below to explore the detailed, well-documented notebooks:

* 🚢 [**10_Analysis.ipynb**](./Notebook/10_Analysis.ipynb): Full Titanic dataset EDA, missing value handling, IQR outlier removal, and survival bivariate plots.
* 🎓 [**dataset_Student.ipynb**](./Notebook/dataset_Student.ipynb): Student Performance EDA, duplicate cleaning, academic activity comparisons using Seaborn boxplots, and student engagement calculation.
* 🛍️ [**mall_customer_dataset_analysis-ayan.ipynb**](./Notebook/mall_customer_dataset_analysis-ayan.ipynb): Mall Customers segmentation analysis, middle-income target group isolation, and age-group spending bar charts.
* 🏬 [**mall_data.ipynb**](./Notebook/mall_data.ipynb): Mall Customer distribution visualizations, gender pie charts, and multiple scatter plots (Age vs Spending, Income vs Spending).
* 🎬 [**netflix_data.ipynb**](./Notebook/netflix_data.ipynb): Brand new Netflix Shows dataset EDA, date parsing, genre extraction, and content release trend visualizations.

---

## 📌 Key Takeaways & Insights

* **Survival Factors**: On the Titanic, gender and class were critical. Females and upper-class passengers had significantly higher survival rates.
* **Grade Determinants**: Student success strongly relates to engagement activities (such as raising hands or visiting resources) and consistent attendance (fewer than 7 absence days).
* **Customer Segments**: Shopping malls have five distinct clusters of customers based on income and spending habits, offering clear target segments for marketing campaigns.
* **Netflix Trends**: Netflix's catalog consists of 69% Movies and 31% TV Shows, with a dramatic surge in library size beginning in 2010.
