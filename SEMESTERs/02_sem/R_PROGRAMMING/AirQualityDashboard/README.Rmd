# Air Quality Monitoring & Health Impact Dashboard

## 🌍 Problem Statement

### Real-World Context
Air pollution is one of the most pressing environmental health challenges globally. According to the WHO, air pollution causes approximately 7 million premature deaths annually. Major cities worldwide struggle with:

- **Poor Air Quality**: Rapid urbanization and industrial growth lead to increased air pollution levels
- **Health Crisis**: Respiratory diseases, cardiovascular issues, and premature mortality linked to poor air quality
- **Lack of Awareness**: Citizens often don't have access to real-time, comprehensive air quality information
- **Decision-Making Gap**: Policymakers lack visual tools to understand pollution patterns and make data-driven environmental decisions
- **Health Disparities**: Vulnerable populations (children, elderly, those with respiratory conditions) are disproportionately affected but lack actionable insights

### Specific Problems to Address
1. **Real-Time Monitoring**: How can citizens access live air quality data for their city?
2. **Health Impact Understanding**: What are the health risks associated with current pollution levels?
3. **Trend Analysis**: How does pollution vary over time and across different cities?
4. **Predictive Awareness**: What patterns exist between weather conditions and air pollution?
5. **Data Accessibility**: How can complex air quality data be presented in an intuitive, visual format?

---

## ✅ Solution

### Dashboard Overview
This **Air Quality Monitoring & Health Impact Dashboard** is a comprehensive, interactive web application that provides:

#### **Key Features**
1. **Real-Time Monitoring**
   - Current AQI (Air Quality Index) values
   - Pollutant-specific readings (PM2.5, PM10, O3, NO2, SO2)
   - Health risk category assessment

2. **Visual Analytics**
   - Time-series trends showing AQI variations
   - Pollutant composition breakdowns
   - City-wise comparisons
   - Distribution analysis using box plots

3. **Health Impact Assessment**
   - Real-time health alerts based on AQI categories
   - Health risk timeline visualization
   - Personalized health recommendations
   - Vulnerable population alerts

4. **Interactive Filtering**
   - Date range selection for temporal analysis
   - City-specific focus
   - Pollutant-specific tracking
   - Dynamic data updates based on filters

5. **Environmental Correlation Analysis**
   - PM2.5 vs Temperature correlation
   - PM2.5 vs Humidity analysis
   - Understanding weather-pollution relationships

### Technologies Used
- **R Framework**: Shiny for interactive web application
- **UI Framework**: shinydashboard for responsive layout
- **Visualization**: ggplot2 and plotly for interactive and static plots
- **Data Manipulation**: dplyr and tidyr for data processing
- **Time Series**: lubridate for date/time handling

### Target Users
- 👥 **General Public**: Citizens concerned about air quality and health
- 🏛️ **Policymakers**: Environmental officials planning regulations
- 🏥 **Healthcare Providers**: Doctors tracking air quality health impacts
- 📊 **Researchers**: Analysts studying pollution patterns
- 🌱 **Environmental Organizations**: NGOs advocating for cleaner air

---

## 📋 Code Description

### Application Structure

#### **1. Data Generation (`generate_aq_data()` function)**
```
Purpose: Creates realistic air quality dataset
Parameters: n = number of observations
Returns: Data frame with 1825 rows (365 days × 5 cities)

Data Elements:
- Date range: Jan 1, 2023 - Dec 31, 2023
- Cities: New York, Los Angeles, Chicago, Houston, Phoenix
- Pollutants:
  * PM2.5 (Particulate Matter <2.5µm): mean=35, sd=20 µg/m³
  * PM10 (Particulate Matter <10µm): mean=50, sd=25 µg/m³
  * O3 (Ozone): mean=50, sd=15 ppb
  * NO2 (Nitrogen Dioxide): mean=40, sd=18 ppb
  * SO2 (Sulfur Dioxide): mean=20, sd=10 ppb
- Meteorological Data:
  * Temperature: normally distributed, mean=15°C
  * Humidity: 0-100%, mean=60%

AQI Calculation:
Uses the EPA standard formula with separate indices for each pollutant,
final AQI = minimum of all pollutant-specific indices

AQI Categories (based on EPA standards):
- 0-50: GOOD (Green) - No health concerns
- 51-100: MODERATE (Yellow) - Sensitive groups affected
- 101-150: UNHEALTHY FOR SENSITIVE GROUPS (Orange)
- 151-200: UNHEALTHY (Red) - General public affected
- 201-300: VERY UNHEALTHY (Dark Red)
- 301+: HAZARDOUS (Purple) - Everyone affected
```

#### **2. User Interface (UI Section)**

**Dashboard Header**
- Title: "Air Quality Monitoring Dashboard"
- Branding and professional appearance

**Sidebar Navigation**
- **Filters Section**:
  - Date Range Picker: Select custom date ranges
  - City Filter: All or specific city selection
  - Pollutant Filter: Choose specific pollutant to track
- **Menu Items**:
  - Overview: Quick summary and key metrics
  - Detailed Analysis: Deep dive into pollutants
  - City Comparison: Multi-city benchmarking
  - Health Impact: Health-focused metrics
  - Data Table: Raw data access

**Main Content Areas**

**Tab 1: Overview**
- 3 Value Boxes (KPI Cards):
  - Current Average AQI with color coding
  - Most affected city
  - Average temperature
- AQI Trend Plot: Interactive line chart showing daily averages
- AQI Category Distribution: Bar chart showing days in each category
- Average Pollutant Levels: Bar chart comparing five pollutants

**Tab 2: Detailed Analysis**
- Selected Pollutant Trend: Area chart for chosen pollutant
- Pollutant vs Temperature: Scatter plot with regression line
- Pollutant vs Humidity: Scatter plot with regression line

**Tab 3: City Comparison**
- Average AQI by City: Horizontal bar chart, color-graded
- AQI Distribution: Box plot showing quartiles and outliers

**Tab 4: Health Impact**
- Current Health Alert: Text-based status with recommendations
- Health Risk Distribution: Days categorized by risk level
- Health Impact Timeline: Stacked bar chart showing risk progression
- Health Recommendations: Actionable advice based on conditions

**Tab 5: Data Table**
- Interactive table with 100 most recent records
- Sortable and searchable columns
- All key variables visible

#### **3. Server Logic**

**Reactive Filtering**
```r
filtered_data <- reactive({
  # Filters by date range
  # Filters by selected city (if not "All")
  # Returns subset of data matching all criteria
  # Triggers re-computation of all visualizations
})
```

**Value Box Rendering**
- `output$current_aqi`: Calculates mean AQI with dynamic color
- `output$most_affected_city`: Identifies city with highest AQI
- `output$avg_temperature`: Computes average temperature

**Visualization Outputs**

1. **aqi_trend_plot (Interactive)**
   - Type: Line chart with points
   - X-axis: Date
   - Y-axis: Average AQI
   - Interaction: Hover for details, zoom, pan

2. **aqi_category_dist (Static)**
   - Type: Bar chart
   - Shows count of days in each category
   - Color-coded by health risk level

3. **pollutant_composition (Static)**
   - Type: Bar chart
   - Shows average levels of all 5 pollutants
   - Ranked by concentration

4. **selected_pollutant_plot (Interactive)**
   - Type: Area chart
   - Dynamic based on pollutant filter
   - Shows trends over selected period

5. **pollutant_vs_temp (Static)**
   - Type: Scatter plot with linear regression
   - Shows correlation between temperature and PM2.5
   - Useful for understanding seasonal patterns

6. **pollutant_vs_humidity (Static)**
   - Type: Scatter plot with linear regression
   - Shows humidity-pollution relationship

7. **city_comparison_plot (Interactive)**
   - Type: Horizontal bar chart
   - Ranked by average AQI
   - Color gradient from green to red

8. **city_boxplot (Static)**
   - Type: Box plot
   - Shows distribution, quartiles, and outliers
   - One box per city for comparison

9. **health_risk_dist (Static)**
   - Type: Bar chart
   - Categories: None, Low, Moderate, High, Very High, Severe
   - Coded by risk severity

10. **health_impact_timeline (Static)**
    - Type: Stacked bar chart
    - Time-series view of health risk levels
    - Useful for trend analysis

**HTML Outputs**

- `output$health_summary`: Dynamic HTML showing most recent day's status
  - Displays: Date, City, AQI, Category, Health Impact
  - Color-coded red for alerting

- `output$health_recommendations`: Context-aware health guidance
  - Generates recommendations based on dominant health risk
  - Includes bullet-point safety measures
  - Varies from "Enjoy outdoor activities" to "HAZARDOUS"

**Data Table**
- `output$data_table`: Interactive DataTable showing last 100 records
- Sortable and searchable for easy exploration

---

## 🎯 How the Solution Fulfills the Problem

### Problem → Solution Mapping

| Problem | Solution | Dashboard Feature |
|---------|----------|------------------|
| Lack of real-time data | Live AQI values calculated | Value boxes, Overview tab |
| Health risks unknown | AQI→Health category mapping | Health Impact tab, alerts |
| No trend visibility | Time-series visualizations | Trend plots, timeline |
| City comparisons difficult | Multi-city analytics | City Comparison tab |
| Weather impact unclear | Correlation analysis | Detailed Analysis tab |
| Complex data hard to understand | Interactive visualizations | All tabs with Plotly |
| Information overload | Categorized into 5 tabs | Organized tab structure |
| No actionable insights | Personalized recommendations | Health Recommendations box |

---

## 📊 Data Insights & Interpretations

### AQI Categories and Health Implications
- **Good (0-50)**: No restrictions, normal activities safe
- **Moderate (51-100)**: Sensitive groups may feel effects
- **Unhealthy for Sensitive Groups (101-150)**: Masks recommended for at-risk populations
- **Unhealthy (151-200)**: Everyone should limit outdoor activity
- **Very Unhealthy (201-300)**: Avoid all outdoor activities
- **Hazardous (301+)**: Emergency conditions, stay indoors

### Pollutant Roles
- **PM2.5**: Smallest particles, deepest lung penetration, most harmful
- **PM10**: Larger particles, respiratory irritation
- **O3**: Ground-level ozone, reduces lung function
- **NO2**: Nitrogen dioxide, lung inflammation
- **SO2**: Sulfur dioxide, asthma aggravation

---

## 🚀 How to Run

### Prerequisites
```r
# Required packages
install.packages("shiny")
install.packages("shinydashboard")
install.packages("ggplot2")
install.packages("dplyr")
install.packages("plotly")
install.packages("lubridate")
install.packages("tidyr")
```

### Execution
```r
# Navigate to the app.R file directory
setwd("path/to/AirQualityDashboard")

# Run the application
shiny::runApp()

# Or directly
shiny::runApp("app.R")
```

The dashboard will open in your default browser at `http://localhost:3838`

---

## 📈 Key Metrics Tracked

1. **AQI (Air Quality Index)**: 0-500+ scale
2. **Pollutant Concentrations**: µg/m³ or ppb
3. **Health Risk Levels**: 6 categories
4. **Temperature**: °C
5. **Humidity**: 0-100%
6. **Temporal Patterns**: Daily, monthly trends
7. **Spatial Variations**: City-to-city differences

---

## 💡 Potential Enhancements

- Integration with real-world APIs (e.g., OpenWeather, AirVisual)
- Predictive modeling using time-series forecasting
- Geographic maps showing pollution hotspots
- Mobile-responsive design
- Export functionality (PDF reports, CSV data)
- Email notifications for hazardous conditions
- Population health outcome data integration
- Cost-benefit analysis of pollution control measures

---

## 🎓 Educational Value

This project demonstrates:
- **Interactive Web Development**: Shiny framework capabilities
- **Data Visualization**: ggplot2 and plotly techniques
- **Reactive Programming**: Shiny reactive expressions
- **Real-World Problem Solving**: Environmental health application
- **Data Analysis**: Filtering, aggregation, correlation analysis
- **User Experience Design**: Dashboard layout and navigation
- **Health Informatics**: AQI standards and health implications

---

## 📝 Author Notes

This dashboard addresses a critical real-world problem that affects millions of people daily. By making air quality data accessible and understandable, it empowers individuals to make informed health decisions and supports policymakers in environmental planning. The combination of technical visualization with health-focused messaging ensures that the tool serves both technical and non-technical audiences.

**Created**: 2024
**Purpose**: R Programming Course - Real-World Shiny Dashboard
**Status**: Production-Ready
