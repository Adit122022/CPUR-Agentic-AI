import random

class SocialMediaService:
    @staticmethod
    def get_product_buzz(sku: str) -> dict:
        """
        Simulate gathering social media buzz parameters for a given SKU.
        """
        # Seed by SKU length + hash to keep it deterministic for testing
        random.seed(hash(sku))
        
        sentiments = ["Positive", "Neutral", "Negative"]
        sentiment = random.choice(sentiments)
        
        # Product specific mock data triggers
        promo_active = random.choice([True, False])
        mention_count = random.randint(100, 5000)
        
        if promo_active:
            sentiment = "Positive"
            mention_count += random.randint(1000, 3000)
            
        buzz_score = round(random.uniform(0.1, 1.0), 2)
        
        return {
            "sku": sku,
            "sentiment": sentiment,
            "buzz_score": buzz_score,
            "weekly_mentions": mention_count,
            "active_campaign": promo_active,
            "summary": f"Social media sentiment is {sentiment.lower()} with a buzz score of {buzz_score}/1.0. Promotion active: {promo_active}."
        }
