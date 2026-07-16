const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { nodeEnv } = require("./config/env");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");

const app = express();

app.use(helmet());

app.use(
	cors({
		origin:
			nodeEnv === "production"
				? process.env.FRONTEND_URL
				: "http://localhost:5173",
		credentials: true,
	}),
);

if (nodeEnv === "development") {
	app.use(morgan("dev"));
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Mount all routes
app.use(routes);

// Global error handler
app.use(errorHandler);

module.exports = app;