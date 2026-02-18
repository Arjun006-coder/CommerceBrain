import pandas as pd
import glob
import os

data_dir = r"d:\Commercebrain-ai\data\raw"
csv_files = glob.glob(os.path.join(data_dir, "*.csv"))

for file in csv_files:
    print(f"\n{'='*50}")
    print(f"File: {os.path.basename(file)}")
    print(f"Size: {os.path.getsize(file) / (1024*1024):.2f} MB")
    try:
        # Read only first few rows to infer schema, then try reading full for counts
        # Using on_bad_lines='skip' to handle potential parsing errors in raw data
        df = pd.read_csv(file, on_bad_lines='skip', low_memory=False)
        print(f"Rows: {len(df)}")
        print(f"Columns: {list(df.columns)}")
        print("\nMissing Values:")
        print(df.isnull().sum()[df.isnull().sum() > 0])
        
        # Check for date columns
        date_cols = [col for col in df.columns if 'date' in col.lower() or 'time' in col.lower()]
        if date_cols:
            print(f"\nPotential Date Columns: {date_cols}")
            for col in date_cols:
                try:
                    print(f"  {col} range: {df[col].min()} to {df[col].max()}")
                except:
                    pass
        
        # Check for other critical columns
        print("\nSample Data (first 2 rows):")
        print(df.head(2).to_dict(orient='records'))
        
    except Exception as e:
        print(f"Error reading file: {e}")
