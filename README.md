# True Rippers PS3 Project – Emergency Personal Companion

The True Rippers PS3 Project is a full-stack application designed to function as a personal emergency companion. It continuously monitors vital signs, uses a machine learning model to detect potential emergencies, and leverages HERE APIs to assist in timely emergency response through real-time location, routing, and traffic data.

---

## Key Features

- Secure user authentication with Firebase  
- Real-time monitoring of vital signs (heart rate, temperature, SpO2, etc.)  
- Health emergency prediction using a trained machine learning model  
- Automated alerts to emergency contacts  
- Location-aware response using HERE Technologies APIs  
- Hospital and emergency facility search, routing, and traffic updates  

---

## Technology Stack

### Frontend:
- React with TypeScript and Vite  
- Tailwind CSS for styling  

### Backend:
- Node.js and Express for API services  
- Python with PyTorch for ML model inference  
- Firebase Admin SDK for authentication  

### Machine Learning:
- PyTorch model (`human_vital_sign_model.pth`)  
- Preprocessing with StandardScaler and LabelEncoder from Scikit-learn  

### Geolocation Services:
- HERE Technologies APIs  

---

## HERE APIs Used

- **Geocoding and Search API**  
  Converts geographic coordinates into readable addresses and supports address lookups for user and facility locations.

- **Routing API**  
  Provides driving, walking, and public transport routes to nearby hospitals or predefined emergency zones.

- **Traffic API**  
  Supplies real-time traffic flow and incident information to optimize emergency routes.

- **Discover (Search) API**  
  Helps identify nearby points of interest, such as hospitals, clinics, and police stations, based on user location.

---

## Machine Learning Model Overview

- A PyTorch-based classification model trained to predict emergency status from vital signs data.  
- Input features include heart rate, SpO2, body temperature, and other biometric indicators.  
- Model output is a label: either "Normal" or "Emergency".  
- The model is supported by:  
  - `scaler.pkl`: used for feature normalization  
  - `label_encoder.pkl`: used for label encoding of the target variable  
- The Python script `main.py` handles real-time inference and integrates with the backend system.

---

## Project Structure

```
TrueRippersPS3/
├── backend/
│   ├── main.py                # ML model inference
│   ├── server.js              # Node.js backend server
│   ├── models/                # ML model and preprocessors
│   ├── controllers/           # Auth and business logic
│   ├── middleware/            # Authentication middleware
│   ├── routes/                # API route definitions
│   └── config/                # Firebase, Passport.js config
├── frontend/
│   └── src/
│       ├── components/        # React UI components
│       ├── contexts/          # Global state providers
│       ├── pages/             # Frontend pages
│       ├── types/             # TypeScript interfaces
├── Emergency Personal Companion.pdf
├── package.json / requirements.txt
```

---

## Setup Instructions

### Backend Setup

```bash
cd backend
npm install                  # Node.js dependencies
pip install -r requirements.txt  # Python dependencies

# Start the backend server
node server.js              # Node.js API server
# or
python main.py              # Python ML inference server
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev                 # Start React development server
```

---

## How to Use

- Sign up or log in to access the system.  
- Connect or simulate real-time biometric input.  
- Monitor health status on the dashboard.  
- Receive alerts in case of anomalies detected by the ML model.  
- Use the location services to find nearby medical help or notify emergency contacts with your location.

---

## Documentation and License

- Refer to the `Emergency Personal Companion.pdf` for in-depth technical documentation.  
- License: MIT (you can modify this section based on your actual license).

---

This project combines real-time health monitoring, AI-based risk detection, and location intelligence to support proactive emergency responses. It is suitable for healthcare monitoring systems, eldercare solutions, and mobile personal safety tools.
