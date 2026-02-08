import pandas as pd
import numpy as np
from faker import Faker
import uuid
from datetime import datetime, timedelta
import json
import os

fake = Faker()
np.random.seed(42)

DEPARTMENTS = ["ICU", "ER", "Cardiology", "Oncology", "General", "Neurology", "Pediatrics"]
DIAGNOSES = [
    ("E11.9", "Type 2 Diabetes"),
    ("I25.10", "Coronary Artery Disease"),
    ("J44.1", "COPD with Acute Exacerbation"),
    ("I50.9", "Heart Failure"),
    ("N18.3", "Chronic Kidney Disease Stage 3"),
    ("J18.9", "Pneumonia"),
    ("I10", "Essential Hypertension"),
    ("F32.9", "Major Depressive Disorder"),
    ("K21.0", "GERD"),
    ("M54.5", "Low Back Pain"),
]

def generate_vitals():
    """Generate realistic vital signs"""
    return {
        "heart_rate": int(np.random.normal(80, 15)),
        "blood_pressure_systolic": int(np.random.normal(125, 20)),
        "blood_pressure_diastolic": int(np.random.normal(80, 12)),
        "temperature": round(np.random.normal(98.6, 0.8), 1),
        "oxygen_saturation": min(100, max(85, int(np.random.normal(96, 3)))),
        "respiratory_rate": int(np.random.normal(16, 3)),
    }

def calculate_risk_score(vitals, age, department):
    """Calculate risk score based on vitals and factors"""
    score = 0.3  # baseline
    
    # Age factor
    if age > 70:
        score += 0.2
    elif age > 55:
        score += 0.1
    
    # Vital signs factors
    if vitals["heart_rate"] > 100 or vitals["heart_rate"] < 50:
        score += 0.15
    if vitals["blood_pressure_systolic"] > 160 or vitals["blood_pressure_systolic"] < 90:
        score += 0.15
    if vitals["oxygen_saturation"] < 92:
        score += 0.2
    if vitals["temperature"] > 100.4 or vitals["temperature"] < 96:
        score += 0.1
    
    # Department factor
    if department == "ICU":
        score += 0.15
    elif department == "ER":
        score += 0.1
    
    return min(1.0, max(0.0, round(score + np.random.uniform(-0.1, 0.1), 2)))

def generate_patients(n=10000):
    """Generate n patient records"""
    patients = []
    
    for i in range(n):
        # Weight age distribution toward 45-75
        age = int(np.random.triangular(18, 60, 95))
        department = np.random.choice(DEPARTMENTS, p=[0.15, 0.15, 0.15, 0.1, 0.25, 0.1, 0.1])
        diagnosis_code, diagnosis_name = DIAGNOSES[np.random.randint(0, len(DIAGNOSES))]
        vitals = generate_vitals()
        
        patient = {
            "patient_id": str(uuid.uuid4()),
            "name": fake.name(),
            "age": age,
            "gender": np.random.choice(["M", "F"]),
            "department": department,
            "room": f"{department[:3].upper()}-{np.random.randint(100, 500)}",
            "diagnosis": diagnosis_code,
            "diagnosis_name": diagnosis_name,
            "vitals": vitals,
            "risk_score": calculate_risk_score(vitals, age, department),
            "admission_date": (datetime.now() - timedelta(days=np.random.randint(0, 30))).isoformat(),
            "estimated_los": np.random.randint(1, 14),  # Length of stay in days
            "attending_physician": fake.name(),
            "insurance": np.random.choice(["Medicare", "Medicaid", "Private", "Self-Pay"]),
        }
        patients.append(patient)
        
        if (i + 1) % 1000 == 0:
            print(f"Generated {i + 1} patients...")
    
    return patients

def main():
    print("🏥 Generating 10,000 synthetic patient records...")
    patients = generate_patients(10000)
    
    # Create dataframe
    df = pd.DataFrame(patients)
    
    # Flatten vitals for CSV
    vitals_df = pd.json_normalize(df["vitals"])
    vitals_df.columns = [f"vitals_{col}" for col in vitals_df.columns]
    df_flat = pd.concat([df.drop("vitals", axis=1), vitals_df], axis=1)
    
    # Ensure data directory exists
    os.makedirs("data", exist_ok=True)
    
    # Save CSV
    df_flat.to_csv("data/patients.csv", index=False)
    print(f"✅ Saved data/patients.csv")
    
    # Save JSON (with nested vitals)
    with open("data/patients.json", "w") as f:
        json.dump(patients, f, indent=2)
    print(f"✅ Saved data/patients.json")
    
    # Print summary statistics
    print("\n📊 Summary Statistics:")
    print(f"   Total patients: {len(df):,}")
    print(f"   High-risk (≥0.7): {len(df[df['risk_score'] >= 0.7]):,}")
    print(f"   Moderate risk (0.4-0.7): {len(df[(df['risk_score'] >= 0.4) & (df['risk_score'] < 0.7)]):,}")
    print(f"   Low risk (<0.4): {len(df[df['risk_score'] < 0.4]):,}")
    print(f"\n   By Department:")
    for dept in DEPARTMENTS:
        count = len(df[df['department'] == dept])
        avg_risk = df[df['department'] == dept]['risk_score'].mean()
        print(f"   - {dept}: {count:,} patients, avg risk: {avg_risk:.2f}")

if __name__ == "__main__":
    main()
