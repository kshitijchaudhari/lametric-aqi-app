import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import AqiController from "./src/controllers/aqi.controller";

dotenv.config();

const main = async () => {
	const app = express();
	const port = process.env.PORT || 3000;

	// Middleware
	app.use(cors());
	app.use(express.json());

	// Health check endpoint
	app.get("/health", (req: Request, res: Response) => {
		res.status(200).json({
			status: "OK",
			message: "LaMetric AQI App is running",
		});
	});

	// API Routes
	app.use("/api", AqiController);

	// 404 Handler
	app.use((req: Request, res: Response) => {
		res.status(404).json({
			error: "Route not found",
			message:
				"Please use /api/aqi?city=CityName or /api/aqi?lat=40&lon=-73",
		});
	});

	// Error Handler
	app.use((err: any, req: Request, res: Response, next: Function) => {
		console.error("Error:", err);
		res.status(500).json({
			error: "Internal Server Error",
			message: err.message || "Something went wrong",
		});
	});

	app.listen(port, () => {
		console.log(`✓ LaMetric AQI App server started on port: ${port}`);
		console.log(`✓ Base URL: http://localhost:${port}`);
		console.log(
			`✓ API Endpoint: http://localhost:${port}/api/aqi?city=London`
		);
	});
};

main().catch((err) => {
	console.error("Failed to start server:", err);
	process.exit(1);
});
