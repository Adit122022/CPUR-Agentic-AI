import numpy as np
from sklearn.tree import DecisionTreeRegressor
from datetime import datetime

class DecisionTreeModel:
    def __init__(self):
        self.model = DecisionTreeRegressor(max_depth=5, random_state=42)

    def predict_next_day(self, history: list[dict]) -> float:
        """
        history: list of dicts with {"date": "YYYY-MM-DD", "quantity": int}
        """
        if not history or len(history) < 2:
            return 10.0  # Fallback default
            
        # Sort history by date
        sorted_history = sorted(history, key=lambda x: x["date"])
        
        X = []
        y = []
        
        for idx, item in enumerate(sorted_history):
            date_obj = datetime.strptime(item["date"], "%Y-%m-%d")
            day_of_week = date_obj.weekday()
            X.append([idx, day_of_week])
            y.append(item["quantity"])
            
        X = np.array(X)
        y = np.array(y)
        
        # Train model
        self.model.fit(X, y)
        
        # Predict next day (index = len(history))
        next_idx = len(sorted_history)
        next_date = datetime.strptime(sorted_history[-1]["date"], "%Y-%m-%d")
        next_day_of_week = (next_date.weekday() + 1) % 7
        
        prediction = self.model.predict([[next_idx, next_day_of_week]])[0]
        return float(max(0, prediction))
