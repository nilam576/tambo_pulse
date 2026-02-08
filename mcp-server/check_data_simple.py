import json
import pandas as pd
data_path = "d:/tambo_hack/tambo-pulse/mcp-server/data/patients.json"
with open(data_path, "r") as f:
    data = json.load(f)
df = pd.DataFrame(data)
c = len(df[df['risk_score'] >= 0.7])
print(f"COUNT_GE_07: {c}")
print(f"DTYPE: {df['risk_score'].dtype}")
