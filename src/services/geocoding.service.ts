import axios from "axios";
import { AqicnGeoResponse } from "../models/types";
import { AQICN_BASE_URL, API_KEYS } from "../utils/constants";

class GeocodingService {
	/**
	 * Search city by name using AQICN API
	 * Returns station data which includes coordinates
	 */
	async getCityCoordinates(cityName: string): Promise<{
		lat: number;
		lon: number;
		name: string;
		country?: string;
	}> {
		try {
			const response = await axios.get<AqicnGeoResponse>(
				`${AQICN_BASE_URL}/feed/${encodeURIComponent(cityName)}/`,
				{
					params: {
						token: API_KEYS.aqicn,
					},
					timeout: 5000,
				}
			);

			if (response.data.status !== "ok" || !response.data.data) {
				throw new Error(
					`City "${cityName}" not found in AQICN database`
				);
			}

			// AQICN returns data directly for city search (not array)
			const stationData = response.data.data;
			const geo = Array.isArray(stationData)
				? stationData?.station?.geo
				: (stationData as any)?.station?.geo;

			if (!geo || !Array.isArray(geo)) {
				throw new Error("No geographic data available for city");
			}

			return {
				lat: geo,
				lon: geo,
				name: cityName,
				country: "Unknown",
			};
		} catch (error: any) {
			throw new Error(
				`Failed to find city "${cityName}": ${error.message}`
			);
		}
	}

	/**
	 * Get coordinates from latitude/longitude
	 * (Pass-through, just validates)
	 */
	async validateCoordinates(
		lat: number,
		lon: number
	): Promise<{
		lat: number;
		lon: number;
		name: string;
	}> {
		if (isNaN(lat) || isNaN(lon)) {
			throw new Error("Invalid coordinates");
		}
		if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
			throw new Error("Coordinates out of valid range");
		}
		return {
			lat,
			lon,
			name: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
		};
	}

	/**
	 * Search nearby stations by coordinates
	 */
	async getNearbyStations(lat: number, lon: number): Promise<any> {
		try {
			const response = await axios.get<AqicnGeoResponse>(
				`${AQICN_BASE_URL}/feed/geo:${lat};${lon}/`,
				{
					params: {
						token: API_KEYS.aqicn,
					},
					timeout: 5000,
				}
			);

			if (response.data.status !== "ok") {
				throw new Error("No data available for coordinates");
			}

			return response.data.data;
		} catch (error: any) {
			throw new Error(`Geocoding error: ${error.message}`);
		}
	}
}

export default new GeocodingService();
