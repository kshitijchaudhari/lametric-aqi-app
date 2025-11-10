/**
 * AQI Level Descriptions (AQICN Scale: 0-500)
 * Mapped to LaMetric 1-5 scale for display
 */
export const AQI_LEVELS = {
	1: "Good",
	2: "Fair",
	3: "Moderate",
	4: "Poor",
	5: "Very Poor",
};

/**
 * AQICN API converts 0-500 scale to 1-5 for LaMetric
 */
export const AQI_TO_LEVEL = (aqi: number): number => {
	if (aqi <= 50) return 1; // Good
	if (aqi <= 100) return 2; // Fair
	if (aqi <= 150) return 3; // Moderate
	if (aqi <= 200) return 4; // Poor
	return 5; // Very Poor
};

/**
 * AQICN API Endpoints (100% Free, No Credit Card Required)
 * Signup: https://aqicn.org/data-platform/token/
 */
export const AQICN_BASE_URL = "https://api.waqi.info";

/**
 * API Keys
 */
export const API_KEYS = {
	aqicn: process.env.AQICN_TOKEN || "",
	fallback: process.env.FALLBACK_API_KEY || "",
};

/**
 * LaMetric icon library references
 */
export const LAMETRIC_ICONS = {
	pm2_5: 34945,
	pm10: 34946,
	aqi: 34947,
	location: 34835,
	air_quality: 49386,
};

/**
 * AQI Level Emojis/Icons for LaMetric
 */
export const AQI_ICONS = {
	1: 49386, // Good - Green check
	2: 49387, // Fair - Yellow warning
	3: 49388, // Moderate - Orange alert
	4: 49389, // Poor - Red alert
	5: 49390, // Very Poor - Dark red danger
};

/**
 * Cache configuration
 */
export const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
