const express = require("express");
const dotenv = require("dotenv");
const app = express();
const appErrorManager = require("./controllers/errorController");

const userRoutes = require("./routes/userRoutes");
const consRoutes = require("./routes/consRoutes");
dotenv.config({
  path: "./.env",
});
const cors = require("cors");
const rateLimt = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const xss = require("xss-clean");
const helmet = require("helmet");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const limiter = rateLimt({
  max: 70,
  windowMs: 60 * 60 * 1000,
  message:
    "Trop de requete proviennent de votre address IP. Veuillez réessayer dans 1 heure ",
});
app.use(cors());
app.use("/api", limiter);
app.use(helmet());
app.use(express.json({ limit: "7kb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Votre application  a bien demarré",
  });
});
app.use("/api/v1/users", userRoutes);

app.use("/api/v1/cons", consRoutes);

app.all("*", (req, res, next) => {
  next(
    new AppError(
      `${req.originalUrl} ne correspond à aucun point d'entrée sur notre serveur`
    )
  );
});

app.use(appErrorManager);
module.exports = app;
