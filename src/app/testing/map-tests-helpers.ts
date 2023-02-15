import { environment } from "src/environments/environment";
import { IObservationPosition } from "../_map/i-observation-position.dto";

export const searchTerm = 'London';
export const latitude = -2.567;
export const longitude = 1.5768;
export const apiUrl = 'https://maps.google.com/maps/api/geocode/json?';
export const apiKey = environment.mapKey;

export const googleMapsApiResponse =
{
  "results": [
    {
      "address_components": [
        {
          "long_name": "London",
          "short_name": "London",
          "types": ["locality", "political"]
        },
        {
          "long_name": "London",
          "short_name": "London",
          "types": ["postal_town"]
        },
        {
          "long_name": "Greater London",
          "short_name": "Greater London",
          "types": ["administrative_area_level_2", "political"]
        },
        {
          "long_name": "England",
          "short_name": "England",
          "types": ["administrative_area_level_1", "political"]
        },
        {
          "long_name": "United Kingdom",
          "short_name": "GB",
          "types": ["country", "political"]
        }
      ],
      "formatted_address": "London, UK",
      "geometry": {
        "bounds": {
          "northeast": {
            "lat": 51.6723432,
            "lng": 0.148271
          },
          "southwest": {
            "lat": 51.38494009999999,
            "lng": -0.3514683
          }
        },
        "location": {
          "lat": 51.5072178,
          "lng": -0.1275862
        },
        "location_type": "APPROXIMATE",
        "viewport": {
          "northeast": {
            "lat": 51.6723432,
            "lng": 0.148271
          },
          "southwest": {
            "lat": 51.38494009999999,
            "lng": -0.3514683
          }
        }
      },
      "place_id": "ChIJdd4hrwug2EcRmSrV3Vo6llI",
      "types": ["locality", "political"]
    }
  ],
  "status": "OK"
};

export const testLatitude: number = 0.6;
export const testLongitude: number = -0.4;

export const fakeLocationMarker = <IObservationPosition>{
  observationPositionId: 1,
  latitude: testLatitude,
  longitude: testLongitude,
  formattedAddress: 'address string',
  shortAddress: 'short address tring'
};