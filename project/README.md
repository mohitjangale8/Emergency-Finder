# Emergency Hospital Finder

A React web application that helps users with heart conditions find nearby hospitals during emergencies. The application provides real-time location services, hospital search, routing, and traffic information using HERE APIs.

## Features

- Get user's current location and address
- Find nearby hospitals with distance information
- Display interactive map with user and hospital locations
- Show route to selected hospital with traffic information
- Real-time traffic status and congestion levels
- Color-coded route visualization based on traffic conditions

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- HERE API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root and add your HERE API key:
   ```
   REACT_APP_HERE_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Allow location access when prompted
2. View your current location and address
3. Browse the list of nearby hospitals
4. Click on a hospital to see the route and traffic information
5. The map will show your location, the hospital location, and the route with traffic status

## Technologies Used

- React
- TypeScript
- HERE Maps JavaScript API
- HERE Routing API
- HERE Traffic API
- Tailwind CSS

## API Endpoints Used

- Reverse Geocoding API: Get address from coordinates
- Discover API: Find nearby hospitals
- Routing API: Get route information
- Traffic Flow API: Get traffic information

## Note

Make sure to keep your HERE API key secure and never commit it to version control. 