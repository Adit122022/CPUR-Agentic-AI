try:
    from crewai import Agent
except ImportError:
    Agent = None

def get_synthesizer_agent(llm=None) -> Agent:
    return Agent(
        role="Consensus Synthesizer",
        goal="Combine mathematical ML forecasts, statistical trends, social sentiment, and weather forecasts to produce a single final adjusted demand quantity and a qualitative justification.",
        backstory="""You are the lead inventory planner and director of forecasting. 
        Your job is to listen to the Data Analyst, Market Scout, and Weather Analyst, review the raw machine learning 
        prediction, and synthesize a single, unified quantity forecast. You produce a structured report justifying your adjustments.""",
        llm=llm,
        verbose=True,
        allow_delegation=False
    )
