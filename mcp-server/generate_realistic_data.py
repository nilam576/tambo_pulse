import json
import random
import uuid
from datetime import datetime, timedelta

def generate_medical_data(count=10000):
    departments = ["ICU", "Emergency", "Cardiology", "Neurology", "Oncology", "Pediatrics"]
    diagnoses = [
        "Acute Respiratory Failure",
        "Septic Shock",
        "Myocardial Infarction",
        "Ischemic Stroke",
        "Congestive Heart Failure",
        "Diabetic Ketoacidosis",
        "Bacterial Pneumonia",
        "Gastrointestinal Bleed",
        "Pulmonary Embolism",
        "Cerebral Hemorrhage"
    ]
    medications_list = [
        "Norepinephrine", "Vancomycin", "Heparin", "Amiodarone", "Lisinopril", 
        "Furosemide", "Metformin", "Atorvastatin", "Aspirin", "Insulin"
    ]
    
    patients = []
    start_date = datetime.now() - timedelta(days=30)
    
    for _ in range(count):
        risk = random.random()
        # Correlate vitals slightly with risk
        hr_base = 70 + (risk * 40)
        spo2_base = 98 - (risk * 15)
        
        patient = {
            "patient_id": f"P-{uuid.uuid4().hex[:8].upper()}",
            "name": f"Patient {random.randint(1000, 9999)}",
            "department": random.choice(departments),
            "risk_score": round(risk, 3),
            "admission_date": (start_date + timedelta(days=random.randint(0, 30))).isoformat(),
            "diagnosis": random.choice(diagnoses),
            "vitals": {
                "heart_rate": int(hr_base + random.randint(-5, 5)),
                "spo2": int(max(70, min(100, spo2_base + random.randint(-2, 2)))),
                "bp_systolic": int(110 + (risk * 50) + random.randint(-10, 10)),
                "bp_diastolic": int(70 + (risk * 20) + random.randint(-5, 5))
            },
            "medications": random.sample(medications_list, random.randint(1, 4))
        }
        patients.append(patient)
    
    return patients

if __name__ == "__main__":
    data = generate_medical_data()
    with open("mcp-server/data/patients.json", "w") as f:
        json.dump(data, f, indent=2)
    print(f"✅ Generated {len(data)} realistic medical records.")
