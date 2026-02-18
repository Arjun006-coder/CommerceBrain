
import pandas as pd
import json

df = pd.read_csv('data/processed/master_dataset.csv')
print(f"Total rows: {len(df)}")
print(f"Columns: {list(df.columns)}")
print("\nSample row:")
print(json.dumps(df.iloc[0].to_dict(), indent=2))
print("\nSentiment distribution:")
print(df['sentiment'].value_counts())
