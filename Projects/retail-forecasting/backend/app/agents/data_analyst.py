try:
    from crewai import Agent
except ImportError:
    Agent = None

def get_data_analyst_agent(llm=None) -> Agent:
    return Agent(
        role="Retail Data Analyst",
        goal="Analyze historical sales data to determine baseline demand patterns, trends, and seasonal shifts.",
        backstory="""You are a veteran retail data scientist with years of experience forecasting inventory requirements.
        You understand time-series trends, moving averages, and seasonal sales cycles (such as weekend spikes).
        Your job is to look at historical data numbers and establish a core statistical perspective.""",
        llm=llm,
        verbose=True,
        allow_delegation=False
    )
