library(shiny)
library(shinydashboard)
library(ggplot2)
library(dplyr)
library(plotly)
library(lubridate)

# Generate realistic air quality data
set.seed(123)
generate_aq_data <- function(n = 1000) {
  cities <- c("New York", "Los Angeles", "Chicago", "Houston", "Phoenix")
  pollutants <- c("PM2.5", "PM10", "O3", "NO2", "SO2")

  data <- expand_grid(
    city = cities,
    date = seq(as.Date("2023-01-01"), as.Date("2023-12-31"), by = "day")
  ) %>%
    mutate(
      PM2.5 = rnorm(n(), mean = 35, sd = 20) %>% pmax(0),
      PM10 = rnorm(n(), mean = 50, sd = 25) %>% pmax(0),
      O3 = rnorm(n(), mean = 50, sd = 15) %>% pmax(0),
      NO2 = rnorm(n(), mean = 40, sd = 18) %>% pmax(0),
      SO2 = rnorm(n(), mean = 20, sd = 10) %>% pmax(0),
      Temperature = rnorm(n(), mean = 15, sd = 10),
      Humidity = rnorm(n(), mean = 60, sd = 15) %>% pmin(100) %>% pmax(0)
    ) %>%
    mutate(
      AQI = pmin(
        (PM2.5 / 35 * 100),
        (PM10 / 150 * 100),
        (O3 / 70 * 100),
        (NO2 / 200 * 100),
        (SO2 / 350 * 100)
      ),
      AQI_Category = case_when(
        AQI <= 50 ~ "Good",
        AQI <= 100 ~ "Moderate",
        AQI <= 150 ~ "Unhealthy for Sensitive Groups",
        AQI <= 200 ~ "Unhealthy",
        AQI <= 300 ~ "Very Unhealthy",
        TRUE ~ "Hazardous"
      ),
      Health_Risk = case_when(
        AQI_Category == "Good" ~ "None",
        AQI_Category == "Moderate" ~ "Low",
        AQI_Category == "Unhealthy for Sensitive Groups" ~ "Moderate",
        AQI_Category == "Unhealthy" ~ "High",
        AQI_Category == "Very Unhealthy" ~ "Very High",
        TRUE ~ "Severe"
      ),
      Health_Impact = case_when(
        AQI_Category == "Good" ~ "No adverse health effects expected",
        AQI_Category == "Moderate" ~ "Unusually sensitive people should consider limiting prolonged outdoor exertion",
        AQI_Category == "Unhealthy for Sensitive Groups" ~ "Members of sensitive groups may experience health effects",
        AQI_Category == "Unhealthy" ~ "Some members of general public may experience health effects",
        AQI_Category == "Very Unhealthy" ~ "Health alert: Everyone may begin to experience health effects",
        TRUE ~ "Health warning: Everyone should avoid outdoor exertion"
      )
    )

  return(data)
}

aq_data <- generate_aq_data()

# Function to calculate AQI category color
get_aqi_color <- function(category) {
  colors <- list(
    "Good" = "#2ecc71",
    "Moderate" = "#f39c12",
    "Unhealthy for Sensitive Groups" = "#e74c3c",
    "Unhealthy" = "#c0392b",
    "Very Unhealthy" = "#8b0000",
    "Hazardous" = "#4a0000"
  )
  return(colors[[category]])
}

# UI Definition
ui <- dashboardPage(
  dashboardHeader(
    title = "Air Quality Monitoring Dashboard",
    titleWidth = 350
  ),
  dashboardSidebar(
    sidebarMenu(
      menuItem("Overview", tabName = "overview", icon = icon("dashboard")),
      menuItem("Detailed Analysis", tabName = "analysis", icon = icon("chart-line")),
      menuItem("City Comparison", tabName = "comparison", icon = icon("map")),
      menuItem("Health Impact", tabName = "health", icon = icon("heartbeat")),
      menuItem("Data Table", tabName = "table", icon = icon("table")),
      br(),
      h4("Filters", style = "margin-left: 15px;"),
      dateRangeInput(
        "date_range",
        "Select Date Range:",
        start = as.Date("2023-01-01"),
        end = as.Date("2023-12-31"),
        startview = "month"
      ),
      selectInput(
        "city_filter",
        "Select City:",
        choices = c("All", unique(aq_data$city)),
        selected = "All"
      ),
      selectInput(
        "pollutant_filter",
        "Select Pollutant:",
        choices = c("PM2.5", "PM10", "O3", "NO2", "SO2"),
        selected = "PM2.5"
      )
    )
  ),
  dashboardBody(
    tabItems(
      # Overview Tab
      tabItem(
        tabName = "overview",
        h2("Overview"),
        fluidRow(
          valueBoxOutput("current_aqi"),
          valueBoxOutput("most_affected_city"),
          valueBoxOutput("avg_temperature")
        ),
        br(),
        fluidRow(
          box(
            plotlyOutput("aqi_trend_plot"),
            width = 12,
            title = "AQI Trend Over Time",
            status = "primary"
          )
        ),
        fluidRow(
          box(
            plotOutput("aqi_category_dist"),
            width = 6,
            title = "AQI Category Distribution",
            status = "info"
          ),
          box(
            plotOutput("pollutant_composition"),
            width = 6,
            title = "Average Pollutant Levels",
            status = "info"
          )
        )
      ),

      # Detailed Analysis Tab
      tabItem(
        tabName = "analysis",
        h2("Detailed Analysis"),
        fluidRow(
          box(
            plotlyOutput("selected_pollutant_plot"),
            width = 12,
            title = "Selected Pollutant Trend",
            status = "primary"
          )
        ),
        fluidRow(
          box(
            plotOutput("pollutant_vs_temp"),
            width = 6,
            title = "Pollutant vs Temperature",
            status = "warning"
          ),
          box(
            plotOutput("pollutant_vs_humidity"),
            width = 6,
            title = "Pollutant vs Humidity",
            status = "warning"
          )
        )
      ),

      # City Comparison Tab
      tabItem(
        tabName = "comparison",
        h2("City Comparison"),
        fluidRow(
          box(
            plotlyOutput("city_comparison_plot"),
            width = 12,
            title = "Average AQI by City",
            status = "primary"
          )
        ),
        fluidRow(
          box(
            plotOutput("city_boxplot"),
            width = 12,
            title = "AQI Distribution by City",
            status = "info"
          )
        )
      ),

      # Health Impact Tab
      tabItem(
        tabName = "health",
        h2("Health Impact Analysis"),
        fluidRow(
          box(
            htmlOutput("health_summary"),
            width = 12,
            status = "danger",
            title = "Current Health Alert"
          )
        ),
        fluidRow(
          box(
            plotOutput("health_risk_dist"),
            width = 6,
            title = "Health Risk Days by Category",
            status = "warning"
          ),
          box(
            plotOutput("health_impact_timeline"),
            width = 6,
            title = "Health Impact Timeline",
            status = "warning"
          )
        ),
        fluidRow(
          box(
            htmlOutput("health_recommendations"),
            width = 12,
            status = "info",
            title = "Health Recommendations"
          )
        )
      ),

      # Data Table Tab
      tabItem(
        tabName = "table",
        h2("Raw Data"),
        fluidRow(
          box(
            dataTableOutput("data_table"),
            width = 12,
            status = "primary"
          )
        )
      )
    )
  )
)

# Server Logic
server <- function(input, output, session) {

  # Reactive data filtering
  filtered_data <- reactive({
    data <- aq_data %>%
      filter(date >= input$date_range[1] & date <= input$date_range[2])

    if (input$city_filter != "All") {
      data <- data %>% filter(city == input$city_filter)
    }

    return(data)
  })

  # Value Boxes
  output$current_aqi <- renderValueBox({
    current_aqi <- mean(filtered_data()$AQI, na.rm = TRUE)
    category <- filtered_data()$AQI_Category[1]

    valueBox(
      paste(round(current_aqi, 1)),
      "Average AQI",
      icon = icon("wind"),
      color = ifelse(current_aqi <= 50, "green",
                     ifelse(current_aqi <= 100, "yellow",
                            ifelse(current_aqi <= 150, "orange",
                                   ifelse(current_aqi <= 200, "red", "purple"))))
    )
  })

  output$most_affected_city <- renderValueBox({
    city_aqi <- filtered_data() %>%
      group_by(city) %>%
      summarize(avg_aqi = mean(AQI, na.rm = TRUE)) %>%
      arrange(desc(avg_aqi)) %>%
      slice(1)

    valueBox(
      city_aqi$city,
      "Most Affected City",
      icon = icon("location-pin"),
      color = "red"
    )
  })

  output$avg_temperature <- renderValueBox({
    avg_temp <- mean(filtered_data()$Temperature, na.rm = TRUE)

    valueBox(
      paste(round(avg_temp, 1), "°C"),
      "Average Temperature",
      icon = icon("thermometer"),
      color = "blue"
    )
  })

  # Plots
  output$aqi_trend_plot <- renderPlotly({
    p <- filtered_data() %>%
      group_by(date) %>%
      summarize(avg_aqi = mean(AQI, na.rm = TRUE)) %>%
      ggplot(aes(x = date, y = avg_aqi)) +
      geom_line(color = "#3498db", size = 1) +
      geom_point(color = "#2980b9", size = 2) +
      labs(title = "Daily Average AQI Trend",
           x = "Date", y = "AQI Value") +
      theme_minimal() +
      theme(plot.title = element_text(hjust = 0.5, size = 14, face = "bold"))

    ggplotly(p, tooltip = c("x", "y"))
  })

  output$aqi_category_dist <- renderPlot({
    filtered_data() %>%
      group_by(AQI_Category) %>%
      count() %>%
      mutate(AQI_Category = factor(AQI_Category,
                                    levels = c("Good", "Moderate",
                                              "Unhealthy for Sensitive Groups",
                                              "Unhealthy", "Very Unhealthy",
                                              "Hazardous"))) %>%
      ggplot(aes(x = AQI_Category, y = n, fill = AQI_Category)) +
      geom_col() +
      scale_fill_manual(values = c("#2ecc71", "#f39c12", "#e74c3c",
                                    "#c0392b", "#8b0000", "#4a0000")) +
      labs(title = "Distribution of AQI Categories",
           x = "AQI Category", y = "Number of Days") +
      theme_minimal() +
      theme(axis.text.x = element_text(angle = 45, hjust = 1),
            plot.title = element_text(hjust = 0.5, size = 14, face = "bold")) +
      guides(fill = FALSE)
  })

  output$pollutant_composition <- renderPlot({
    pollutants_avg <- filtered_data() %>%
      summarize(
        PM2.5 = mean(PM2.5, na.rm = TRUE),
        PM10 = mean(PM10, na.rm = TRUE),
        O3 = mean(O3, na.rm = TRUE),
        NO2 = mean(NO2, na.rm = TRUE),
        SO2 = mean(SO2, na.rm = TRUE)
      ) %>%
      tidyr::pivot_longer(everything(), names_to = "Pollutant", values_to = "Level")

    ggplot(pollutants_avg, aes(x = reorder(Pollutant, -Level), y = Level, fill = Pollutant)) +
      geom_col() +
      labs(title = "Average Pollutant Levels",
           x = "Pollutant", y = "Concentration (µg/m³)") +
      theme_minimal() +
      theme(plot.title = element_text(hjust = 0.5, size = 14, face = "bold"),
            axis.text.x = element_text(angle = 45, hjust = 1)) +
      guides(fill = FALSE)
  })

  output$selected_pollutant_plot <- renderPlotly({
    pollutant <- input$pollutant_filter

    p <- filtered_data() %>%
      group_by(date) %>%
      summarize(value = mean(get(pollutant), na.rm = TRUE)) %>%
      ggplot(aes(x = date, y = value)) +
      geom_line(color = "#e74c3c", size = 1) +
      geom_area(alpha = 0.3, fill = "#e74c3c") +
      labs(title = paste(pollutant, "Concentration Over Time"),
           x = "Date", y = paste(pollutant, "(µg/m³)")) +
      theme_minimal() +
      theme(plot.title = element_text(hjust = 0.5, size = 14, face = "bold"))

    ggplotly(p, tooltip = c("x", "y"))
  })

  output$pollutant_vs_temp <- renderPlot({
    ggplot(filtered_data(), aes(x = Temperature, y = PM2.5)) +
      geom_point(alpha = 0.5, color = "#3498db") +
      geom_smooth(method = "lm", color = "#e74c3c", se = TRUE) +
      labs(title = "PM2.5 vs Temperature",
           x = "Temperature (°C)", y = "PM2.5 (µg/m³)") +
      theme_minimal() +
      theme(plot.title = element_text(hjust = 0.5, size = 14, face = "bold"))
  })

  output$pollutant_vs_humidity <- renderPlot({
    ggplot(filtered_data(), aes(x = Humidity, y = PM2.5)) +
      geom_point(alpha = 0.5, color = "#9b59b6") +
      geom_smooth(method = "lm", color = "#e74c3c", se = TRUE) +
      labs(title = "PM2.5 vs Humidity",
           x = "Humidity (%)", y = "PM2.5 (µg/m³)") +
      theme_minimal() +
      theme(plot.title = element_text(hjust = 0.5, size = 14, face = "bold"))
  })

  output$city_comparison_plot <- renderPlotly({
    p <- filtered_data() %>%
      group_by(city) %>%
      summarize(avg_aqi = mean(AQI, na.rm = TRUE)) %>%
      arrange(avg_aqi) %>%
      ggplot(aes(x = reorder(city, avg_aqi), y = avg_aqi, fill = avg_aqi)) +
      geom_col() +
      scale_fill_gradient(low = "#2ecc71", high = "#e74c3c") +
      labs(title = "Average AQI by City",
           x = "City", y = "Average AQI") +
      coord_flip() +
      theme_minimal() +
      theme(plot.title = element_text(hjust = 0.5, size = 14, face = "bold"),
            legend.position = "none")

    ggplotly(p, tooltip = c("x", "y"))
  })

  output$city_boxplot <- renderPlot({
    ggplot(filtered_data(), aes(x = city, y = AQI, fill = city)) +
      geom_boxplot(alpha = 0.7) +
      labs(title = "AQI Distribution by City",
           x = "City", y = "AQI Value") +
      theme_minimal() +
      theme(plot.title = element_text(hjust = 0.5, size = 14, face = "bold"),
            axis.text.x = element_text(angle = 45, hjust = 1),
            legend.position = "none")
  })

  output$health_risk_dist <- renderPlot({
    filtered_data() %>%
      group_by(Health_Risk) %>%
      count() %>%
      mutate(Health_Risk = factor(Health_Risk,
                                   levels = c("None", "Low", "Moderate", "High", "Very High", "Severe"))) %>%
      ggplot(aes(x = Health_Risk, y = n, fill = Health_Risk)) +
      geom_col() +
      scale_fill_manual(values = c("#2ecc71", "#f1c40f", "#f39c12", "#e74c3c", "#c0392b", "#8b0000")) +
      labs(title = "Days by Health Risk Level",
           x = "Health Risk Level", y = "Number of Days") +
      theme_minimal() +
      theme(plot.title = element_text(hjust = 0.5, size = 14, face = "bold"),
            axis.text.x = element_text(angle = 45, hjust = 1),
            legend.position = "none")
  })

  output$health_impact_timeline <- renderPlot({
    filtered_data() %>%
      group_by(date, Health_Risk) %>%
      count() %>%
      ggplot(aes(x = date, fill = Health_Risk)) +
      geom_bar() +
      scale_fill_manual(values = c("#2ecc71", "#f1c40f", "#f39c12", "#e74c3c", "#c0392b", "#8b0000")) +
      labs(title = "Health Risk Timeline",
           x = "Date", y = "Count", fill = "Health Risk") +
      theme_minimal() +
      theme(plot.title = element_text(hjust = 0.5, size = 14, face = "bold"))
  })

  output$health_summary <- renderUI({
    recent_data <- filtered_data() %>%
      arrange(desc(date)) %>%
      slice(1)

    if (nrow(recent_data) > 0) {
      HTML(paste(
        "<h4 style='color: #c0392b;'>Current Status</h4>",
        "<p><strong>Date:</strong>", recent_data$date[1], "</p>",
        "<p><strong>City:</strong>", recent_data$city[1], "</p>",
        "<p><strong>AQI:</strong>", round(recent_data$AQI[1], 1), "</p>",
        "<p><strong>Category:</strong>", recent_data$AQI_Category[1], "</p>",
        "<p><strong>Health Impact:</strong></p>",
        "<p style='color: #e74c3c;'>", recent_data$Health_Impact[1], "</p>"
      ))
    }
  })

  output$health_recommendations <- renderUI({
    most_common_risk <- filtered_data() %>%
      group_by(Health_Risk) %>%
      count() %>%
      arrange(desc(n)) %>%
      slice(1) %>%
      pull(Health_Risk)

    recommendations <- case_when(
      most_common_risk == "None" ~ "<p>✓ Air quality is good. Enjoy outdoor activities!</p>",
      most_common_risk == "Low" ~ "<p>⚠ No major concerns, but sensitive individuals should limit intense outdoor activity</p>",
      most_common_risk == "Moderate" ~ "<p>⚠ Members of sensitive groups may experience health effects. Consider wearing masks if you belong to a sensitive group.</p>",
      most_common_risk == "High" ~ "<p>⚠ General public should reduce prolonged outdoor exposure. Use air purifiers indoors.</p>",
      most_common_risk == "Very High" ~ "<p>🚨 Avoid outdoor activities. Everyone should wear N95/P100 masks if they must go outside.</p>",
      TRUE ~ "<p>🚨 HAZARDOUS: Stay indoors, use air purifiers, and consult health authorities.</p>"
    )

    HTML(paste(
      "<h4>General Recommendations:</h4>",
      recommendations,
      "<ul>",
      "<li>Monitor local air quality alerts regularly</li>",
      "<li>Keep windows and doors closed on high AQI days</li>",
      "<li>Use HEPA filters in air purifiers</li>",
      "<li>Avoid strenuous outdoor exercise on unhealthy air days</li>",
      "<li>Vulnerable populations should take extra precautions</li>",
      "</ul>"
    ))
  })

  output$data_table <- renderDataTable({
    filtered_data() %>%
      select(date, city, AQI, AQI_Category, PM2.5, PM10, O3, NO2, SO2,
             Temperature, Humidity, Health_Risk) %>%
      arrange(desc(date)) %>%
      head(100)
  })
}

shinyApp(ui, server)
