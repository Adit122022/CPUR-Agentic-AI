import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

def generate_retail_dataset():
    # 3 Retailers, 6 Categories
    retailers = ['dmart', 'vmart', 'local']
    categories = [
        'Stationery & Books',
        'Ready-to-Eat & Instant Food',
        'Groceries & Staples',
        'Beverages & Cold Drinks',
        'Personal Care',
        'Apparels & Innerwear'
    ]

    # Date range: 2 years of daily data
    end_date = datetime.today()
    start_date = end_date - timedelta(days=730)
    date_range = pd.date_range(start=start_date, end=end_date, freq='D')

    data = []

    for date in date_range:
        # Seasonality factors
        month = date.month
        day_of_week = date.weekday() # 0 = Monday, 6 = Sunday
        
        # Weekend bump
        weekend_multiplier = 1.4 if day_of_week >= 5 else 1.0
        
        # Summer bump (Mar-Jun) for beverages
        summer_multiplier = 1.8 if 3 <= month <= 6 else 1.0
        
        # Exam season (Mar-May, Nov-Dec) for stationery and instant food
        exam_multiplier = 1.5 if month in [3, 4, 5, 11, 12] else 1.0
        
        for retailer in retailers:
            for category in categories:
                # Base demand depends on retailer and category
                base_demand = random.randint(30, 80)
                
                # Apply retailer-specific bias
                if retailer == 'dmart':
                    if category == 'Groceries & Staples': base_demand += 30
                    if category == 'Beverages & Cold Drinks': base_demand += 20
                elif retailer == 'vmart':
                    if category == 'Apparels & Innerwear': base_demand += 40
                elif retailer == 'local':
                    if category == 'Ready-to-Eat & Instant Food': base_demand += 35
                    if category == 'Stationery & Books': base_demand += 25

                # Apply seasonal multipliers
                multiplier = weekend_multiplier
                if category == 'Beverages & Cold Drinks':
                    multiplier *= summer_multiplier
                if category in ['Stationery & Books', 'Ready-to-Eat & Instant Food']:
                    multiplier *= exam_multiplier
                
                # Add noise
                noise = random.uniform(0.8, 1.2)
                
                final_qty = int(base_demand * multiplier * noise)
                
                # Base price mock
                price = round(random.uniform(50, 500), 2)
                
                # Promotion logic (10% chance)
                promotion = 1 if random.random() > 0.9 else 0
                if promotion:
                    final_qty = int(final_qty * 1.3) # 30% boost during promo
                    price = round(price * 0.8, 2)
                    
                data.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'retailer': retailer,
                    'category': category,
                    'sales_qty': final_qty,
                    'price': price,
                    'promotion': promotion
                })

    df = pd.DataFrame(data)
    os.makedirs('../data', exist_ok=True)
    file_path = '../data/kota_retail_sales.csv'
    df.to_csv(file_path, index=False)
    print(f"Generated dataset with {len(df)} rows at {file_path}")

if __name__ == '__main__':
    generate_retail_dataset()
