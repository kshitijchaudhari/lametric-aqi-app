import axios from "axios";
import { GeocodingResponse, ZipcodeGeocodingResponse } from "../models/types";
import { OWM_GEO_URL, API_KEYS } from "../utils/constants";

class GeocodingService {
	/**
	 * Convert city name to coordinates using OpenWeatherMap Geocoding API
	 */
	async getCityCoordinates(
		cityName: string,
		countryCode?: string
	): Promise<GeocodingResponse> {
		try {
			const query = countryCode ? `${cityName},${countryCode}` : cityName;
			const response = await axios.get<GeocodingResponse[]>(
				`${OWM_GEO_URL}/direct`,
				{
					params: {
						q: query,
						limit: 1,
						appid: API_KEYS.openWeatherMap,
					},
				}
			);

			if (!response.data || response.data.length === 0) {
				throw new Error(`City "${cityName}" not found`);
			}

			return response.data;
		} catch (error: any) {
			throw new Error(
				`Geocoding error for city "${cityName}": ${error.message}`
			);
		}
	}

	/**
	 * Convert zip code to coordinates using OpenWeatherMap Geocoding API
	 */
	async getZipcodeCoordinates(
		zipcode: string,
		countryCode: string = "US"
	): Promise<ZipcodeGeocodingResponse> {
		try {
			const response = await axios.get<ZipcodeGeocodingResponse>(
				`${OWM_GEO_URL}/zip`,
				{
					params: {
						zip: `${zipcode},${countryCode}`,
						appid: API_KEYS.openWeatherMap,
					},
				}
			);

			if (!response.data) {
				throw new Error(`Zipcode "${zipcode}" not found`);
			}

			return response.data;
		} catch (error: any) {
			throw new Error(
				`Geocoding error for zipcode "${zipcode}": ${error.message}`
			);
		}
	}

	/**
	 * Get city name from coordinates (reverse geocoding)
	 */
	async getCityName(lat: number, lon: number): Promise<GeocodingResponse> {
		try {
			const response = await axios.get<GeocodingResponse[]>(
				`${OWM_GEO_URL}/reverse`,
				{
					params: {
						lat,
						lon,
						limit: 1,
						appid: API_KEYS.openWeatherMap,
					},
				}
			);

			if (!response.data || response.data.length === 0) {
				throw new Error("Location not found for given coordinates");
			}

			return response.data;
		} catch (error: any) {
			throw new Error(`Reverse geocoding error: ${error.message}`);
		}
	}
}

export default new GeocodingService();
