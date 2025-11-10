/**
 * AQI Level Descriptions
 */
export const AQI_LEVELS = {
	1: "Good",
	2: "Fair",
	3: "Moderate",
	4: "Poor",
	5: "Very Poor",
};

/**
 * AQI Level Emojis/Icons for LaMetric
 * LaMetric uses numeric icon IDs. These are common IDs for weather/air quality
 */
export const AQI_ICONS = {
	1: 49386, // Good - Green leaf/check icon
	2: 49387, // Fair - Yellow warning
	3: 49388, // Moderate - Orange alert
	4: 49389, // Poor - Red alert
	5: 49390, // Very Poor - Red danger
};

/**
 * Default OpenWeatherMap Air Pollution API endpoint
 * Alternative: AQICN API (aqicn.org)
 */
export const OWM_BASE_URL = "http://api.openweathermap.org/data/2.5";
export const OWM_GEO_URL = "http://api.openweathermap.org/geo/1.0";
export const AQICN_BASE_URL = "https://api.waqicn.org";

/**
 * API Keys - should be provided via environment variables
 */
export const API_KEYS = {
	openWeatherMap: process.env.OWM_API_KEY || "",
	aqicn: process.env.AQICN_API_KEY || "",
};

/**
 * LaMetric icon library references
 * PM2.5 = 34945, PM10 = 34946, AQI = 34947
 * Reference: https://developer.lametric.com/icons/library/
 */
export const LAMETRIC_ICONS = {
	pm2_5: 34945,
	pm10: 34946,
	aqi: 34947,
	location: 34835,
	air_quality: 49386,
};

/**
 * Cache configuration
 */
export const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
