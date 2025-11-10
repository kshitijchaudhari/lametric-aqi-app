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

			// Cast to any to avoid TypeScript array inference issues
			const stationData: any = response.data.data;

			// Initialize geo as undefined
			let geoArray: number[] | undefined;

			// Check if it's an array and get the first element
			if (Array.isArray(stationData) && stationData.length > 0) {
				// Get first station - explicitly typed as any to bypass TypeScript issues
				const station: any = stationData;

				// Extract geo if station has the expected structure
				if (
					station &&
					station.station &&
					Array.isArray(station.station.geo)
				) {
					geoArray = station.station.geo;
				}
			} else if (
				stationData &&
				stationData.station &&
				Array.isArray(stationData.station.geo)
			) {
				// If it's not an array, try direct access
				geoArray = stationData.station.geo;
			}

			// Validate geo data exists and has 2 elements
			if (!geoArray || !Array.isArray(geoArray) || geoArray.length < 2) {
				throw new Error("No geographic data available for city");
			}

			// Extract and convert to numbers
			const latitude: number = Number(geoArray);
			const longitude: number = Number(geoArray);

			// Validate numbers
			if (isNaN(latitude) || isNaN(longitude)) {
				throw new Error("Invalid geographic coordinates");
			}

			return {
				lat: latitude,
				lon: longitude,
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
