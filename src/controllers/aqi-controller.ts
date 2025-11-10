import { Router, Request, Response } from "express";
import AqiService from "../services/aqi.service";
import GeocodingService from "../services/geocoding.service";
import LaMetricFormatterService from "../services/lametric-formatter.service";

const router = Router();

/**
 * GET /aqi
 * Query parameters:
 *   - city: City name (e.g., "London", "Mumbai")
 *   - lat: Latitude
 *   - lon: Longitude
 *   - format: Response format - "full" (default), "compact", or "metric"
 */
router.get("/aqi", async (req: Request, res: Response) => {
	try {
		const { city, lat, lon, format = "compact" } = req.query;

		let aqiData;

		// Step 1: Get AQI data based on input method
		if (city) {
			// Direct city name search (AQICN supports this)
			aqiData = await AqiService.getAqiByCity(city as string);
		} else if (lat && lon) {
			// Coordinate-based search
			const latitude = parseFloat(lat as string);
			const longitude = parseFloat(lon as string);

			await GeocodingService.validateCoordinates(latitude, longitude);
			aqiData = await AqiService.getAqiData(latitude, longitude);
		} else {
			return res.status(400).json({
				error: "Missing parameters",
				message:
					"Please provide either: city name or latitude/longitude",
				examples: [
					"/api/aqi?city=London",
					"/api/aqi?city=Mumbai",
					"/api/aqi?lat=40.7128&lon=-74.0060",
				],
			});
		}

		// Step 2: Format for LaMetric display
		let lametricResponse;
		const formatType = (format as string).toLowerCase();

		if (formatType === "full") {
			lametricResponse =
				LaMetricFormatterService.formatAqiForLametric(aqiData);
		} else if (formatType === "metric") {
			lametricResponse =
				LaMetricFormatterService.formatAqiMetric(aqiData);
		} else {
			lametricResponse =
				LaMetricFormatterService.formatAqiCompact(aqiData);
		}

		// Step 3: Return response
		res.status(200).json({
			success: true,
			data: lametricResponse,
			aqi_info: {
				city: aqiData.city,
				aqi_value: aqiData.aqi,
				aqi_level: aqiData.aqiLevel,
				pm2_5: aqiData.pm2_5,
				pm10: aqiData.pm10,
				recommendation: AqiService.getHealthRecommendation(aqiData.aqi),
				last_update: aqiData.lastUpdate,
			},
		});
	} catch (error: any) {
		console.error("Error in AQI endpoint:", error);
		res.status(500).json({
			error: "Failed to fetch AQI data",
			message:
				error.message ||
				"An error occurred while fetching AQI information",
			troubleshooting: [
				"Verify that AQICN_TOKEN is set correctly in .env",
				"Check that the city name is spelled correctly",
				"Ensure your internet connection is working",
				"Verify that the location has air quality monitoring data",
			],
		});
	}
});

/**
 * GET /aqi/clear-cache
 */
router.get("/aqi/clear-cache", (req: Request, res: Response) => {
	try {
		AqiService.clearCache();
		res.status(200).json({
			success: true,
			message: "AQI cache cleared successfully",
		});
	} catch (error: any) {
		res.status(500).json({
			error: "Failed to clear cache",
			message: error.message,
		});
	}
});

export default router;
