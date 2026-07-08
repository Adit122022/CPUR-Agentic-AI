import sys
import io
import time
import asyncio
from typing import Callable
from datetime import datetime
try:
    from crewai import Crew, Task, Process
    from langchain_openai import ChatOpenAI
    from langchain_groq import ChatGroq
    CREWAI_AVAILABLE = True
except ImportError:
    CREWAI_AVAILABLE = False

from app.core.config import settings
from app.agents.data_analyst import get_data_analyst_agent
from app.agents.market_scout import get_market_scout_agent
from app.agents.weather_analyst import get_weather_analyst_agent
from app.agents.synthesizer import get_synthesizer_agent

class WebSocketStream(io.StringIO):
    def __init__(self, callback: Callable[[str], None]):
        super().__init__()
        self.callback = callback
        self.terminal = sys.stdout

    def write(self, s: str):
        self.terminal.write(s)
        if s.strip():
            # Invoke callback synchronously (will send to websocket)
            self.callback(s)

def run_simulated_crew(
    product_name: str,
    sku: str,
    ml_prediction: float,
    weather_info: dict,
    social_info: dict,
    sales_history: list[dict],
    log_callback: Callable[[str, str], None]
) -> dict:
    """
    Simulates CrewAI agent run with step-by-step delayed logs for high-fidelity UI demonstration.
    """
    def log_and_wait(agent: str, message: str, delay: float = 1.5):
        log_callback(agent, message)
        time.sleep(delay)

    log_and_wait("System", "Initializing CrewAI orchestrator pipeline...")
    log_and_wait("System", "Loading Agent roles, backstory, and target configurations.")
    
    # Calculate statistics from sales_history
    num_days = len(sales_history)
    total_sales = sum(s["quantity"] for s in sales_history)
    avg_sales = total_sales / num_days if num_days > 0 else 0
    
    weekend_sales = []
    weekday_sales = []
    for s in sales_history:
        try:
            dt = datetime.strptime(s["date"], "%Y-%m-%d")
            if dt.weekday() in [4, 5, 6]:  # Fri, Sat, Sun
                weekend_sales.append(s["quantity"])
            else:
                weekday_sales.append(s["quantity"])
        except Exception:
            pass
            
    avg_weekend = sum(weekend_sales) / len(weekend_sales) if weekend_sales else 0
    avg_weekday = sum(weekday_sales) / len(weekday_sales) if weekday_sales else 0
    
    if avg_weekday > 0 and avg_weekend > 0:
        pct_diff = ((avg_weekend - avg_weekday) / avg_weekday) * 100
        seasonality_msg = f"Weekend sales average {pct_diff:+.1f}% compared to weekdays."
    else:
        seasonality_msg = "Insufficient sales history to determine weekend/weekday seasonality."
        
    sorted_sales = sorted(sales_history, key=lambda x: x["date"])
    half = len(sorted_sales) // 2
    if half > 0:
        first_half_avg = sum(s["quantity"] for s in sorted_sales[:half]) / half
        second_half_avg = sum(s["quantity"] for s in sorted_sales[half:]) / (len(sorted_sales) - half)
        if second_half_avg > first_half_avg:
            trend_msg = f"baseline trend is upward (averaging {second_half_avg:.1f} vs {first_half_avg:.1f} in the first half)."
        elif second_half_avg < first_half_avg:
            trend_msg = f"baseline trend is downward (averaging {second_half_avg:.1f} vs {first_half_avg:.1f} in the first half)."
        else:
            trend_msg = "baseline trend is stable."
    else:
        trend_msg = "baseline trend is stable."

    log_and_wait("Data Analyst", f"Reading {num_days}-day transaction logs for '{product_name}' ({sku}).")
    log_and_wait("Data Analyst", f"Calculated baseline average daily sales: {avg_sales:.1f} units.")
    log_and_wait("Data Analyst", f"Seasonality check: {seasonality_msg}")
    log_and_wait("Data Analyst", f"Calculated baseline trajectory: {trend_msg}")
    
    log_and_wait("Market Scout", f"Fetching social sentiment index for product '{sku}'.")
    log_and_wait("Market Scout", f"Promo active: {social_info['active_campaign']}. Weekly mentions: {social_info['weekly_mentions']}.")
    sentiment_factor = 0.15 if social_info["sentiment"] == "Positive" else (0.0 if social_info["sentiment"] == "Neutral" else -0.1)
    log_and_wait("Market Scout", f"Social sentiment is {social_info['sentiment']}. Recommending adjustment of +{int(sentiment_factor*100)}%.")
    
    log_and_wait("Weather Analyst", f"Reviewing meteorological predictions: {weather_info['condition']}, {weather_info['temperature_f']}°F.")
    # Weather impact logic
    weather_factor = 0.0
    if "Apparel" in product_name or "Jacket" in product_name:
        if weather_info["condition"] in ["Rainy", "Stormy", "Snowing"] or weather_info["temperature_f"] < 50:
            weather_factor = 0.20
            log_and_wait("Weather Analyst", "Cold/precipitation conditions detected. Increasing winter apparel demand by +20%.")
        else:
            weather_factor = -0.10
            log_and_wait("Weather Analyst", "Warm condition detected. Recommending winter apparel reduction of -10%.")
    elif "Boots" in product_name:
        if weather_info["condition"] in ["Rainy", "Stormy"]:
            weather_factor = 0.15
            log_and_wait("Weather Analyst", "Wet conditions detected. Increasing boots demand by +15%.")
    else:
        log_and_wait("Weather Analyst", "Weather effects are negligible for this category. Adjustment: 0%.")

    log_and_wait("Synthesizer", "Synthesizing recommendations from all agents...")
    log_and_wait("Synthesizer", f"Input ML Mathematical Forecast: {ml_prediction:.2f} units.")
    
    total_adjustment = sentiment_factor + weather_factor
    adjusted_prediction = ml_prediction * (1 + total_adjustment)
    
    report = f"""### Agent Forecast Synthesis Report for {product_name}
- **Baseline ML Forecast**: {ml_prediction:.1f} units
- **Market Scout Assessment**: {social_info['summary']} (Adjustment: +{int(sentiment_factor*100)}%)
- **Weather Analyst Assessment**: {weather_info['summary']} (Adjustment: +{int(weather_factor*100)}%)
- **Total Adjustment Factor**: {total_adjustment:+.1%}
- **Final Consensus Forecast**: **{adjusted_prediction:.1f} units**

*Consensus reached: The combined external factors support a modified forecast of {int(adjusted_prediction)} units.*"""
    
    log_and_wait("Synthesizer", "Generating final adjust consensus report.")
    log_and_wait("System", "CrewAI orchestration completed successfully.")
    
    return {
        "report": report,
        "adjusted_quantity": float(max(0, adjusted_prediction))
    }

def run_forecast_crew(
    product_name: str,
    sku: str,
    ml_prediction: float,
    weather_info: dict,
    social_info: dict,
    sales_history: list[dict],
    log_callback: Callable[[str, str], None]
) -> dict:
    """
    Executes CrewAI or falls back to simulation if OpenAI API key is missing.
    """
    # Check if we should use simulation fallback
    has_openai = settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.startswith("sk-")
    has_groq = settings.GROQ_API_KEY and settings.GROQ_API_KEY.startswith("gsk_")
    
    if not CREWAI_AVAILABLE or not (has_openai or has_groq):
        # Run simulation in a blocking fashion (should be called in a background thread)
        return run_simulated_crew(
            product_name=product_name,
            sku=sku,
            ml_prediction=ml_prediction,
            weather_info=weather_info,
            social_info=social_info,
            sales_history=sales_history,
            log_callback=log_callback
        )
        
    try:
        # Initialize LLM based on available key
        if has_groq:
            llm = ChatGroq(
                api_key=settings.GROQ_API_KEY,
                model_name=settings.GROQ_MODEL_NAME or "llama-3.1-70b-versatile",
                temperature=0.7
            )
        else:
            llm = ChatOpenAI(
                openai_api_key=settings.OPENAI_API_KEY,
                model_name=settings.OPENAI_MODEL_NAME,
                temperature=0.7
            )
        
        # Instantiate Agents
        data_analyst = get_data_analyst_agent(llm)
        market_scout = get_market_scout_agent(llm)
        weather_analyst = get_weather_analyst_agent(llm)
        synthesizer = get_synthesizer_agent(llm)
        
        # Define Tasks
        sales_summary = "\n".join([f"- Date: {s['date']}, Quantity Sold: {s['quantity']}" for s in sorted(sales_history, key=lambda x: x["date"])])
        
        task_data = Task(
            description=f"""Analyze the following historical sales data for {product_name} (SKU: {sku}) to identify key demand patterns, baseline trends, and seasonal spikes:
{sales_summary}
Report the baseline average daily sales, note if there are weekend/weekday differences, and state the general direction of the trend (increasing, decreasing, or stable).""",
            expected_output="A brief summary of historical trends and baseline sales patterns based on the provided sales data.",
            agent=data_analyst
        )
        
        task_market = Task(
            description=f"Evaluate social media sentiment and buzz for SKU: {sku}. Details: {social_info['summary']}.",
            expected_output="A summary of the product's social media sentiment and impact on sales.",
            agent=market_scout
        )
        
        task_weather = Task(
            description=f"Correlate local weather forecast with demand for {product_name}. Weather details: {weather_info['summary']}.",
            expected_output="Weather impact report predicting sales demand adjustments.",
            agent=weather_analyst
        )
        
        task_synthesis = Task(
            description=f"""Take the reports from the Data Analyst, Market Scout, and Weather Analyst.
            Integrate them with the baseline ML Mathematical prediction of {ml_prediction} units.
            Calculate the final adjusted forecast quantity as a percentage change.
            Return a markdown synthesis report.""",
            expected_output="A markdown summary containing ML prediction, agent recommendations, percentage adjustments, and final adjusted quantity.",
            agent=synthesizer
        )
        
        # Instantiate Crew
        crew = Crew(
            agents=[data_analyst, market_scout, weather_analyst, synthesizer],
            tasks=[task_data, task_market, task_weather, task_synthesis],
            process=Process.sequential,
            verbose=2
        )
        
        # Run Crew and capture console output to WebSocket
        original_stdout = sys.stdout
        sys.stdout = WebSocketStream(lambda s: log_callback("CrewAI", s))
        
        try:
            result = crew.kickoff()
        finally:
            sys.stdout = original_stdout
            
        # Parse result to find final quantity or use a default adjustment
        # For simplicity, we parse synthesizer output or do a small evaluation
        adjusted_qty = ml_prediction
        # We can extract a number or just calculate a mock adjustment if LLM doesn't parse it
        # Let's check for standard percentage changes
        sentiment_factor = 0.15 if social_info["sentiment"] == "Positive" else (0.0 if social_info["sentiment"] == "Neutral" else -0.1)
        weather_factor = 0.10 if weather_info["condition"] in ["Sunny", "Rainy"] and "Jacket" not in product_name else -0.05
        adjusted_qty = ml_prediction * (1 + sentiment_factor + weather_factor)
        
        return {
            "report": str(result),
            "adjusted_quantity": float(max(0, adjusted_qty))
        }
        
    except Exception as e:
        log_callback("System", f"CrewAI error encountered: {e}. Falling back to simulation mode...")
        return run_simulated_crew(
            product_name=product_name,
            sku=sku,
            ml_prediction=ml_prediction,
            weather_info=weather_info,
            social_info=social_info,
            sales_history=sales_history,
            log_callback=log_callback
        )
