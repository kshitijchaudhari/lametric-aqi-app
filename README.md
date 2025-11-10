LaMetric Time AQI (Air Quality Index) App
A fully functional, production-ready LaMetric Time app that displays real-time Air Quality Index (AQI) data including PM2.5, PM10, and other air pollutants for any city, zipcode, or geographic coordinates.

Features
✅ Real-time AQI Data - Fetches current air quality information
✅ PM2.5 & PM10 Monitoring - Detailed particulate matter levels
✅ Multiple Input Methods - Search by city name, zip code, or coordinates
✅ Multiple Display Formats - Full, Compact, and Metric display modes
✅ Built-in Caching - 10-minute cache to reduce API calls
✅ Health Recommendations - Contextual air quality health advice
✅ TypeScript - Type-safe, production-ready code
✅ Comprehensive Error Handling - Detailed error messages and troubleshooting
✅ Free & Open Source - MIT License

Prerequisites
Node.js 14+ and npm/yarn

LaMetric Time Device (produced before 2022, model "LM 37X8")

Internet Connection for both the device and server

Get your own token at https://aqicn.org/city/london/
Add the token to the .env file in the root of the project.

3 Correct API Endpoints
By City Name (Recommended)

GET https://api.waqi.info/feed/London/?token=YOUR_TOKEN
By Station ID (Your example: London)

GET https://api.waqi.info/feed/@5724/?token=YOUR_TOKEN
By Coordinates

GET https://api.waqi.info/feed/geo:51.5074;-0.1278/?token=YOUR_TOKEN