try:
    from crewai import Agent
except ImportError:
    Agent = None

def get_weather_analyst_agent(llm=None) -> Agent:
    return Agent(
        role="Weather & Environmental Analyst",
        goal="Correlate temperature, precipitation, and environmental factors with shifts in product demand.",
        backstory="""You are a meteorology-focused retail planner. You study how temperature drops, heatwaves, 
        snowstorms, or rainy seasons affect consumer buying choices. You know exactly which products sell 
        more when it rains or snows, and which drop when temperatures fluctuate.""",
        llm=llm,
        verbose=True,
        allow_delegation=False
    )
