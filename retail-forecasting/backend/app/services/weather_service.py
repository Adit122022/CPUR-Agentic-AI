import random

class WeatherService:
    @staticmethod
    def get_forecast(date_str: str) -> dict:
        """
        Simulate fetching weather data for a given date.
        Returns:
            dict containing temperature, precipitation probability, and weather condition.
        """
        # Seed based on date string length and hash to keep it deterministic for the day
        random.seed(hash(date_str))
        
        conditions = ["Sunny", "Cloudy", "Rainy", "Stormy", "Snowing"]
        # Generate some mock weather parameters
        condition = random.choice(conditions)
        temp = random.randint(10, 85) # 10°F to 85°F
        precip_prob = random.randint(0, 100) if condition in ["Rainy", "Stormy", "Snowing"] else random.randint(0, 20)
        
        return {
            "date": date_str,
            "condition": condition,
            "temperature_f": temp,
            "precipitation_probability": precip_prob,
            "summary": f"Expect {condition.lower()} weather with a temperature around {temp}°F."
        }
