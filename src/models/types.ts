/**
 * AQICN API Response Interface
 */
export interface AqicnResponse {
	status: string;
	data: {
		aqi: number;
		idx: number;
		attribution: Array<{
			url: string;
			name: string;
		}>;
		city: {
			geo: number[];
			name: string;
			url: string;
		};
		dominentpol: string;
		iaqi: {
			pm2_5?: { v: number };
			pm10?: { v: number };
			no2?: { v: number };
			o3?: { v: number };
			co?: { v: number };
			so2?: { v: number };
			t?: { v: number };
			h?: { v: number };
			p?: { v: number };
		};
		time: {
			s: string;
			tz: string;
			v: number;
		};
	};
}

/**
 * AQICN Geo Search Response
 */
export interface AqicnGeoResponse {
	status: string;
	data: Array<{
		uid: number;
		aqi: string;
		station: {
			name: string;
			geo: number[];
			url: string;
		};
	}>;
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
	co?: number; // Optional: add if you want it
	no2?: number; // Optional: add if you want it
	temperature?: number;
	humidity?: number;
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
