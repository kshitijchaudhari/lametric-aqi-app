import axios from "axios";
import { AqicnResponse, ProcessedAqiData } from "../models/types";
import {
	AQICN_BASE_URL,
	API_KEYS,
	AQI_TO_LEVEL,
	AQI_LEVELS,
	CACHE_DURATION,
} from "../utils/constants";

class AqiService {
	private cache: Map<string, { data: ProcessedAqiData; timestamp: number }> =
		new Map();

	/**
	 * Fetch AQI data from AQICN API (100% Free, No Credit Card)
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

			// Try direct coordinates first
			let response: any;
			try {
				response = await axios.get<AqicnResponse>(
					`${AQICN_BASE_URL}/feed/geo:${lat};${lon}/`,
					{
						params: {
							token: API_KEYS.aqicn,
						},
						timeout: 5000,
					}
				);
			} catch (error) {
				console.log("Geo search failed, trying city name if provided");
				if (!cityName) throw error;

				response = await axios.get<AqicnResponse>(
					`${AQICN_BASE_URL}/feed/${encodeURIComponent(cityName)}/`,
					{
						params: {
							token: API_KEYS.aqicn,
						},
						timeout: 5000,
					}
				);
			}

			if (response.data.status !== "ok") {
				throw new Error("No AQI data available for this location");
			}

			const aqiData = response.data.data;
			const aqi = aqiData.aqi;
			const aqiLevel = AQI_TO_LEVEL(aqi);
			const iaqi = aqiData.iaqi;

			// Extract pollutant data (AQICN uses different format)
			const processedData: ProcessedAqiData = {
				city:
					cityName ||
					aqiData.city.name ||
					`${lat.toFixed(2)}, ${lon.toFixed(2)}`,
				country: "Unknown",
				aqi: aqiLevel, // Convert to 1-5 scale for LaMetric
				aqiLevel:
					AQI_LEVELS[aqiLevel as keyof typeof AQI_LEVELS] ||
					"Unknown",
				pm2_5: iaqi.pm2_5?.v ? Math.round(iaqi.pm2_5.v * 10) / 10 : 0,
				pm10: iaqi.pm10?.v ? Math.round(iaqi.pm10.v * 10) / 10 : 0,
				temperature: iaqi.t?.v
					? Math.round(iaqi.t.v * 10) / 10
					: undefined,
				humidity: iaqi.h?.v
					? Math.round(iaqi.h.v * 10) / 10
					: undefined,
				lastUpdate: new Date(aqiData.time.v * 1000).toLocaleString(),
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
	 * Get AQI data directly by city name using AQICN
	 */
	async getAqiByCity(cityName: string): Promise<ProcessedAqiData> {
		try {
			const response = await axios.get<AqicnResponse>(
				`${AQICN_BASE_URL}/feed/${encodeURIComponent(cityName)}/`,
				{
					params: {
						token: API_KEYS.aqicn,
					},
					timeout: 5000,
				}
			);

			if (response.data.status !== "ok") {
				throw new Error(`City "${cityName}" not found`);
			}

			const aqiData = response.data.data;
			const aqi = aqiData.aqi;
			const aqiLevel = AQI_TO_LEVEL(aqi);
			const iaqi = aqiData.iaqi;

			const processedData: ProcessedAqiData = {
				city: aqiData.city.name,
				country: "Unknown",
				aqi: aqiLevel,
				aqiLevel:
					AQI_LEVELS[aqiLevel as keyof typeof AQI_LEVELS] ||
					"Unknown",
				pm2_5: iaqi.pm2_5?.v ? Math.round(iaqi.pm2_5.v * 10) / 10 : 0,
				pm10: iaqi.pm10?.v ? Math.round(iaqi.pm10.v * 10) / 10 : 0,
				temperature: iaqi.t?.v
					? Math.round(iaqi.t.v * 10) / 10
					: undefined,
				humidity: iaqi.h?.v
					? Math.round(iaqi.h.v * 10) / 10
					: undefined,
				lastUpdate: new Date(aqiData.time.v * 1000).toLocaleString(),
			};

			const cacheKey = `city_${cityName}`;
			this.cache.set(cacheKey, {
				data: processedData,
				timestamp: Date.now(),
			});

			return processedData;
		} catch (error: any) {
			throw new Error(
				`Failed to fetch AQI data for city "${cityName}": ${error.message}`
			);
		}
	}

	/**
	 * Get human-readable health recommendation
	 */
	getHealthRecommendation(aqiLevel: number): string {
		switch (aqiLevel) {
			case 1:
				return "Air quality is good. Enjoy outdoor activities!";
			case 2:
				return "Air quality is fair. Sensitive groups may be slightly affected.";
			case 3:
				return "Air quality is moderate. Sensitive groups may experience health effects.";
			case 4:
				return "Air quality is poor. Everyone may experience health effects.";
			case 5:
				return "Air quality is very poor. Everyone should avoid outdoor activities.";
			default:
				return "Unknown air quality level";
		}
	}

	/**
	 * Clear cache
	 */
	clearCache(): void {
		this.cache.clear();
		console.log("✓ AQI cache cleared");
	}
}

export default new AqiService();
