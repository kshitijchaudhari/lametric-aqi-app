import {
	ProcessedAqiData,
	LaMetricResponse,
	LaMetricFrame,
} from "../models/types";
import { LAMETRIC_ICONS, AQI_ICONS } from "../utils/constants";

class LaMetricFormatterService {
	/**
	 * Format AQI data for LaMetric Time display
	 * Returns frames with text and metric information
	 */
	formatAqiForLametric(aqiData: ProcessedAqiData): LaMetricResponse {
		const frames: LaMetricFrame[] = [];

		// Frame 1: City Name and AQI Level
		frames.push({
			text: `${aqiData.city}`,
			icon: LAMETRIC_ICONS.location,
		});

		// Frame 2: Overall AQI Value and Level
		frames.push({
			text: `AQI: ${aqiData.aqi}`,
			icon: AQI_ICONS[aqiData.aqi as keyof typeof AQI_ICONS],
		});

		// Frame 3: AQI Level Description
		frames.push({
			text: aqiData.aqiLevel,
			icon: LAMETRIC_ICONS.air_quality,
		});

		// Frame 4: PM2.5 Value
		frames.push({
			text: `PM2.5: ${aqiData.pm2_5}`,
			icon: LAMETRIC_ICONS.pm2_5,
		});

		// Frame 5: PM10 Value
		frames.push({
			text: `PM10: ${aqiData.pm10}`,
			icon: LAMETRIC_ICONS.pm10,
		});

		// Frame 6: Last Update Time
		frames.push({
			text: `Updated: ${aqiData.lastUpdate}`,
			icon: LAMETRIC_ICONS.aqi,
		});

		// Frame 7: CO (if available)
		if (aqiData.co !== undefined) {
		frames.push({
			text: `CO: ${aqiData.co} µg/m³`,
			icon: LAMETRIC_ICONS.air_quality
		});
		}

		// Frame 8: NO2 (if available)
		if (aqiData.no2 !== undefined) {
		frames.push({
			text: `NO2: ${aqiData.no2} µg/m³`,
			icon: LAMETRIC_ICONS.air_quality
		});
		}


		return { frames };
	}

	/**
	 * Format AQI data in compact mode (fewer frames for better display on small screen)
	 */
	formatAqiCompact(aqiData: ProcessedAqiData): LaMetricResponse {
		const frames: LaMetricFrame[] = [];

		// Frame 1: City and AQI
		frames.push({
			text: `${aqiData.city.split(",")}`,
			icon: LAMETRIC_ICONS.location,
		});

		// Frame 2: AQI Value with Level
		frames.push({
			text: `AQI ${aqiData.aqi}/5`,
			icon: AQI_ICONS[aqiData.aqi as keyof typeof AQI_ICONS],
		});

		// Frame 3: Level Description
		frames.push({
			text: aqiData.aqiLevel,
			icon: LAMETRIC_ICONS.air_quality,
		});

		// Frame 4: PM2.5
		frames.push({
			text: `PM2.5: ${aqiData.pm2_5}`,
			icon: LAMETRIC_ICONS.pm2_5,
		});

		// Frame 5: PM10
		frames.push({
			text: `PM10: ${aqiData.pm10}`,
			icon: LAMETRIC_ICONS.pm10,
		});

		return { frames };
	}

	/**
	 * Format with metric-style display for specific values
	 */
	formatAqiMetric(aqiData: ProcessedAqiData): LaMetricResponse {
		const frames: LaMetricFrame[] = [];

		// Main frame with PM2.5 as metric
		frames.push({
			text: `${aqiData.city.split(",")} - ${aqiData.aqiLevel}`,
			icon: AQI_ICONS[aqiData.aqi as keyof typeof AQI_ICONS],
		});

		frames.push({
			metric: {
				value: aqiData.pm2_5,
				unit: "µg/m³",
			},
			icon: LAMETRIC_ICONS.pm2_5,
		});

		frames.push({
			metric: {
				value: aqiData.pm10,
				unit: "µg/m³",
			},
			icon: LAMETRIC_ICONS.pm10,
		});

		frames.push({
			metric: {
				value: aqiData.aqi,
				unit: "AQI",
			},
			icon: LAMETRIC_ICONS.aqi,
		});

		return { frames };
	}
}

export default new LaMetricFormatterService();
