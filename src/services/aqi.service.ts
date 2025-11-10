import axios from "axios";
import { AqiResponse, ProcessedAqiData } from "../models/types";
import {
	OWM_BASE_URL,
	API_KEYS,
	AQI_LEVELS,
	CACHE_DURATION,
} from "../utils/constants";

class AqiService {
	private cache: Map<string, { data: ProcessedAqiData; timestamp: number }> =
		new Map();

	/**
	 * Fetch AQI data from OpenWeatherMap Air Pollution API
	 */
	async getAqiData(
		lat: number,
		lon: number,
		cityName?: string
	): Promise<ProcessedAqiData> {
		try {
			// Check cache
			const cacheKey = `${lat.toFixed(4)}_${lon.toFixed(4)}`;
			const cachedData = this.cache.get(cacheKey);

			if (
				cachedData &&
				Date.now() - cachedData.timestamp < CACHE_DURATION
			) {
				console.log(`✓ Using cached AQI data for ${cacheKey}`);
				return cachedData.data;
			}

			// Fetch from OpenWeatherMap Air Pollution API
			const response = await axios.get<AqiResponse>(
				`${OWM_BASE_URL}/air_pollution`,
				{
					params: {
						lat,
						lon,
						appid: API_KEYS.openWeatherMap,
					},
				}
			);

			if (
				!response.data ||
				!response.data.list ||
				response.data.list.length === 0
			) {
				throw new Error("No AQI data available for this location");
			}

			const aqiData = response.data.list;
			const aqi = aqiData.main.aqi;
			const components = aqiData.components;

			const processedData: ProcessedAqiData = {
				city: cityName || `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
				aqi,
				aqiLevel: this.getAqiLevelDescription(aqi),
				pm2_5: Math.round(components.pm2_5 * 10) / 10,
				pm10: Math.round(components.pm10 * 10) / 10,
				co: Math.round(components.co * 10) / 10,
				no2: Math.round(components.no2 * 10) / 10,
				o3: Math.round(components.o3 * 10) / 10,
				so2: Math.round(components.so2 * 10) / 10,
				lastUpdate: new Date(aqiData.dt * 1000).toLocaleString(),
			};

			// Cache the result
			this.cache.set(cacheKey, {
				data: processedData,
				timestamp: Date.now(),
			});

			return processedData;
		} catch (error: any) {
			throw new Error(`Failed to fetch AQI data: ${error.message}`);
		}
	}

	/**
	 * Get human-readable AQI level
	 */
	private getAqiLevelDescription(aqi: number): string {
		return AQI_LEVELS[aqi as keyof typeof AQI_LEVELS] || "Unknown";
	}

	/**
	 * Get AQI health recommendation
	 */
	getHealthRecommendation(aqi: number): string {
		switch (aqi) {
			case 1:
				return "Air quality is good. Enjoy outdoor activities!";
			case 2:
				return "Air quality is fair. Unusually sensitive people should consider limiting prolonged outdoor exertion.";
			case 3:
				return "Air quality is moderate. Members of sensitive groups may experience health effects.";
			case 4:
				return "Air quality is poor. Everyone may begin to experience health effects.";
			case 5:
				return "Air quality is very poor. Everyone should avoid outdoor activities.";
			default:
				return "Unknown air quality level";
		}
	}

	/**
	 * Clear cache (useful for force refresh)
	 */
	clearCache(): void {
		this.cache.clear();
		console.log("✓ AQI cache cleared");
	}
}

export default new AqiService();
