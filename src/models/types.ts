/**
 * Interface for AQI data from OpenWeatherMap API
 */
export interface AqiResponse {
	coord: number[];
	list: AqiDataPoint[];
}

export interface AqiDataPoint {
	dt: number;
	main: {
		aqi: number; // 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
	};
	components: {
		co: number;
		no: number;
		no2: number;
		o3: number;
		so2: number;
		pm2_5: number;
		pm10: number;
		nh3: number;
	};
}

/**
 * Geocoding response from OpenWeatherMap Geocoding API
 */
export interface GeocodingResponse {
	name: string;
	lat: number;
	lon: number;
	country: string;
	state?: string;
}

export interface ZipcodeGeocodingResponse {
	zip: string;
	name: string;
	lat: number;
	lon: number;
	country: string;
}

/**
 * Processed AQI data for LaMetric display
 */
export interface ProcessedAqiData {
	city: string;
	country?: string;
	aqi: number;
	aqiLevel: string;
	pm2_5: number;
	pm10: number;
	co: number;
	no2: number;
	o3: number;
	so2: number;
	lastUpdate: string;
}

/**
 * LaMetric frame types
 */
export interface LaMetricFrame {
	text?: string;
	icon?: number;
	metric?: {
		value: number;
		unit: string;
	};
}

export interface LaMetricResponse {
	frames: LaMetricFrame[];
}
