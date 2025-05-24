from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import pickle
import numpy as np
import random
from typing import Dict
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define model paths
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "human_vitals.pth")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
LABEL_ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

# Load the models and scalers
try:
    model = torch.load(MODEL_PATH)
    model.eval()
    scaler = pickle.load(open(SCALER_PATH, "rb"))
    label_encoder = pickle.load(open(LABEL_ENCODER_PATH, "rb"))
except Exception as e:
    print(f"Error loading models: {e}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Model directory: {MODEL_DIR}")

class VitalSigns(BaseModel):
    heart_rate: float
    respiratory_rate: float
    body_temperature: float
    oxygen_saturation: float
    systolic_bp: float
    diastolic_bp: float

def generate_random_patient_data():
    return {
        "age": random.randint(20, 80),
        "gender": random.choice(["Male", "Female"]),
        "weight_kg": round(random.uniform(50, 100), 2),
        "height_m": round(random.uniform(1.5, 2.0), 2)
    }

@app.post("/predict")
async def predict(vital_signs: VitalSigns) -> Dict:
    try:
        # Generate random patient data
        patient_data = generate_random_patient_data()
        
        # Combine all features
        features = [
            vital_signs.heart_rate,
            vital_signs.respiratory_rate,
            vital_signs.body_temperature,
            vital_signs.oxygen_saturation,
            vital_signs.systolic_bp,
            vital_signs.diastolic_bp,
            patient_data["age"],
            1 if patient_data["gender"] == "Male" else 0,  # Encode gender
            patient_data["weight_kg"],
            patient_data["height_m"]
        ]
        
        # Scale features
        features_scaled = scaler.transform([features])
        
        # Convert to tensor and get prediction
        features_tensor = torch.FloatTensor(features_scaled)
        with torch.no_grad():
            prediction = model(features_tensor)
            predicted_class = 1 if prediction.item() > 0.5 else 0
        
        return {"risk": predicted_class}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 