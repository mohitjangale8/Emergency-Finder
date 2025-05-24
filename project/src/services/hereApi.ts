import { hereApiKey } from '../config';

const HERE_API_KEY = '4EDNLlWOUfLaUaxZlQ41R4p7BRIhBB0TS_kL_LwHCKA';

interface Coordinates {
  lat: number;
  lng: number;
}

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: number;
  coordinates: Coordinates;
}

interface RouteResponse {
  routes: Array<{
    sections: Array<{
      summary: {
        length: number;
        duration: number;
        traffic: {
          status: 'free' | 'moderate' | 'heavy';
        };
      };
      polyline: string;
    }>;
  }>;
}

interface TrafficInfo {
  congestion: number;
  status: 'free' | 'moderate' | 'heavy';
}

export const hereApi = {
  // Get address from coordinates
  async getAddressFromCoordinates(coords: Coordinates): Promise<string> {
    try {
      console.log('Getting address for coordinates:', coords);
      const response = await fetch(
        `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${coords.lat},${coords.lng}&lang=en-US&apikey=${HERE_API_KEY}`
      );
      const data = await response.json();
      console.log('Address response:', data);
      return data.items[0].address.label;
    } catch (error) {
      console.error('Error getting address:', error);
      throw new Error('Failed to get address');
    }
  },

  // Find nearby hospitals
  async findNearbyHospitals(coords: Coordinates): Promise<Hospital[]> {
    try {
      console.log('Finding hospitals near coordinates:', coords);
      const response = await fetch(
        `https://discover.search.hereapi.com/v1/discover?` +
        `q=hospital&` +
        `at=${coords.lat},${coords.lng}&` +
        `limit=5&` +
        `apikey=${HERE_API_KEY}`
      );
      const data = await response.json();
      console.log('Hospitals response:', data);
      
      return data.items.map((item: any) => ({
        id: item.id,
        name: item.title,
        address: item.address.label,
        distance: item.distance,
        coordinates: {
          lat: item.position.lat,
          lng: item.position.lng
        }
      }));
    } catch (error) {
      console.error('Error finding hospitals:', error);
      throw new Error('Failed to find nearby hospitals');
    }
  },

  // Get route between two points with traffic information
  async getRoute(origin: Coordinates, destination: Coordinates) {
    try {
      console.log('Getting route from', origin, 'to', destination);

      // Format coordinates for the API
      const originStr = `${origin.lat},${origin.lng}`;
      const destStr = `${destination.lat},${destination.lng}`;

      // Get current time in ISO format
      const now = new Date().toISOString();

      const response = await fetch(
        `https://router.hereapi.com/v8/routes?` +
        `transportMode=car` +
        `&origin=${originStr}` +
        `&destination=${destStr}` +
        `&return=summary,polyline,actions,instructions` +
        `&traffic=true` +
        `&departureTime=${now}` +
        `&apikey=${hereApiKey}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Route API error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.routes || !data.routes[0] || !data.routes[0].sections || !data.routes[0].sections[0]) {
        throw new Error('Invalid route data received');
      }

      const route = data.routes[0].sections[0];
      
      // Extract traffic status from the route data or use default
      const trafficStatus = route.summary?.traffic?.status || 'free';
      
      return {
        distance: route.summary.length,
        duration: route.summary.duration,
        polyline: route.polyline,
        traffic: {
          status: trafficStatus
        }
      };
    } catch (error) {
      console.error('Error getting route:', error);
      throw new Error('Failed to get route information');
    }
  },

  // Get traffic information for a route using Traffic Flow API v7
  async getTrafficInfo(origin: Coordinates, destination: Coordinates): Promise<TrafficInfo> {
    try {
      // Get traffic flow for the route area
      const response = await fetch(
        `https://data.traffic.hereapi.com/v7/flow?` +
        `in=${origin.lat},${origin.lng};r=1000&` +
        `locationReferencing=shape&` +
        `apikey=${HERE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Traffic response:', data);

      // Calculate average congestion from traffic flow data
      const congestion = this.calculateAverageCongestion(data);
      
      return {
        congestion: congestion,
        status: this.getTrafficStatus(congestion)
      };
    } catch (error) {
      console.error('Error getting traffic info:', error);
      return {
        congestion: 0,
        status: 'free'
      };
    }
  },

  calculateAverageCongestion(data: any): number {
    if (!data.results || !data.results.length) {
      return 0;
    }

    let totalCongestion = 0;
    let count = 0;

    data.results.forEach((result: any) => {
      if (result.currentFlow && result.currentFlow.jamFactor) {
        totalCongestion += result.currentFlow.jamFactor;
        count++;
      }
    });

    return count > 0 ? totalCongestion / count : 0;
  },

  getTrafficStatus(congestion: number): 'free' | 'moderate' | 'heavy' {
    if (congestion < 0.3) return 'free';
    if (congestion < 0.7) return 'moderate';
    return 'heavy';
  }
}; 