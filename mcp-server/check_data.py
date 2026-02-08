import json
import pandas as pd
import os

data_path = "d:/tambo_hack/tambo-pulse/mcp-server/data/patients.json"
with open(data_path, "r") as f:
    data = json.load(f)

df = pd.DataFrame(data)
print(f"Total records: {len(df)}")
print(f"Columns: {df.columns.tolist()}")
print(f"Risk Score Dtype: {df['risk_score'].dtype}")
print(f"Max Risk: {df['risk_score'].max()}")
print(f"Min Risk: {df['risk_score'].min()}")
print(f"Count >= 0.7: {len(df[df['risk_score'] >= 0.7])}")
print(f"Departments: {df['department'].unique().tolist()}")
