import { Router, Request, Response } from "express";
import AqiService from "../services/aqi.service";
import GeocodingService from "../services/geocoding.service";
import LaMetricFormatterService from "../services/lametric-formatter.service";

const router = Router();

/**
 * GET /aqi
 * Query parameters:
 *   - city: City name (e.g., "London", "Mumbai")
 *   - zipcode: Zip/Postal code (e.g., "E14", "10001")
 *   - country: Country code (e.g., "IN", "US", "GB") - optional for city search
 *   - lat: Latitude - alternative to city/zipcode
 *   - lon: Longitude - alternative to city/zipcode
 *   - format: Response format - "full" (default), "compact", or "metric"
 */
router.get("/aqi", async (req: Request, res: Response) => {
	try {
		const {
			city,
			zipcode,
			country,
			lat,
			lon,
			format = "compact",
			countryCode,
		} = req.query;

		let latitude: number;
		let longitude: number;
		let cityName: string = "";

		// Step 1: Get coordinates
		if (lat && lon) {
			// Direct coordinate input
			latitude = parseFloat(lat as string);
			longitude = parseFloat(lon as string);

			// Get city name from coordinates
			try {
				const geoData = await GeocodingService.getCityName(
					latitude,
					longitude
				);
				cityName = `${geoData.name}, ${geoData.country}`;
			} catch (error) {
				cityName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
			}
		} else if (zipcode) {
			// Convert zipcode to coordinates
			const cc = (countryCode as string) || "US";
			const geoData = await GeocodingService.getZipcodeCoordinates(
				zipcode as string,
				cc
			);
			latitude = geoData.lat;
			longitude = geoData.lon;
			cityName = `${geoData.name}, ${geoData.country}`;
		} else if (city) {
			// Convert city name to coordinates
			const cc = country as string | undefined;
			const geoData = await GeocodingService.getCityCoordinates(
				city as string,
				cc
			);
			latitude = geoData.lat;
			longitude = geoData.lon;
			cityName = `${geoData.name}, ${geoData.country}`;
		} else {
			return res.status(400).json({
				error: "Missing parameters",
				message:
					"Please provide either: city name, zipcode, or latitude/longitude coordinates",
				examples: [
					"/api/aqi?city=London",
					"/api/aqi?city=Mumbai&country=IN",
					"/api/aqi?zipcode=10001&countryCode=US",
					"/api/aqi?lat=40.7128&lon=-74.0060",
				],
			});
		}

		// Validate coordinates
		if (isNaN(latitude) || isNaN(longitude)) {
			return res.status(400).json({
				error: "Invalid coordinates",
				message: "Latitude and longitude must be valid numbers",
			});
		}

		// Step 2: Fetch AQI data
		const aqiData = await AqiService.getAqiData(
			latitude,
			longitude,
			cityName
		);

		// Step 3: Format for LaMetric display
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

		// Step 4: Return response
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
				"Ensure your API key is set correctly",
				"Check that the city/zipcode/coordinates are valid",
				"Verify you have network connectivity",
				"Check OpenWeatherMap API quota limits",
			],
		});
	}
});

/**
 * GET /aqi/clear-cache
 * Clear the AQI data cache (for development/force refresh)
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
