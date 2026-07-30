library(shiny)
library(shinydashboard)
library(tidyverse)
library(caret)

# Load Titanic Data (Ensure titanic.csv is in your directory)
# For this script, we'll use a local copy or load from a URL
titanic_url <- "https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv"
titanic_data <- read.csv(titanic_url)

ui <- dashboardPage(
  dashboardHeader(title = "R Assignment Dashboard"),
  dashboardSidebar(
    sidebarMenu(
      menuItem("Titanic Analysis", tabName = "titanic", icon = icon("ship")),
      menuItem("Fuel Efficiency (mtcars)", tabName = "mtcars_tab", icon = icon("car"))
    )
  ),
  dashboardBody(
    tabItems(
      # --- Titanic Tab ---
      tabItem(tabName = "titanic",
              fluidRow(
                box(title = "Data Overview", width = 12, verbatimTextOutput("titanic_struct")),
                box(title = "Survival by Category", width = 6,
                    selectInput("var", "Select Variable:", choices = c("Pclass", "Sex", "Embarked")),
                    plotOutput("titanic_plot")),
                box(title = "Insights", width = 6, 
                    helpText("Insight 1: Females had a significantly higher survival rate."),
                    helpText("Insight 2: Upper-class (Pclass 1) passengers were prioritized during evacuation."))
              )
      ),
      # --- mtcars Tab ---
      tabItem(tabName = "mtcars_tab",
              fluidRow(
                box(title = "Regression Results", width = 6, verbatimTextOutput("model_summary")),
                box(title = "Actual vs Predicted MPG", width = 6, plotOutput("reg_plot")),
                box(title = "Model Performance", width = 12, tableOutput("metrics"))
              )
      )
    )
  )
)

server <- function(input, output) {
  
  # Titanic Logic
  output$titanic_struct <- renderPrint({
    str(titanic_data)
  })
  
  output$titanic_plot <- renderPlot({
    ggplot(titanic_data, aes_string(x = input$var, fill = "factor(Survived)")) +
      geom_bar(position = "fill") +
      scale_fill_discrete(name = "Survived", labels = c("No", "Yes")) +
      labs(y = "Proportion") + theme_minimal()
  })
  
  # mtcars Logic (Machine Learning Pipeline)
  output$model_summary <- renderPrint({
    model <- lm(mpg ~ wt + hp + cyl, data = mtcars)
    summary(model)
  })
  
  output$reg_plot <- renderPlot({
    model <- lm(mpg ~ wt + hp + cyl, data = mtcars)
    preds <- predict(model, mtcars)
    ggplot(mtcars, aes(x = preds, y = mpg)) +
      geom_point() + geom_abline(color = "red") +
      labs(x = "Predicted MPG", y = "Actual MPG") + theme_minimal()
  })
}

shinyApp(ui, server)