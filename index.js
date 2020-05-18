require("./startup/logging");
const express = require("express"), http = require('http'), https = require('https');
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const cool = require("cool-ascii-faces");
const winston = require("winston");
var mung = require("express-mung");
const config = require("config");
const app = express();

//middelware
app.use(
  mung.json(function transform(body, req, res) {
    body.providerApi = config.get("extraBodyMessage");
    return body;
  })
);

const router = express.Router();
require("./startup/logging");
const env = require("./startup/environment");
require("./startup/routes")(app);
const { createDb } = require("./startup/db");
require("./startup/config")();
require("./startup/validation")();

winston.info("Application Name: " + config.get("name"));
winston.info("Application Email: " + config.get("email.address"));
//check connection
createDb();

app.set("view engine", "pug");
app.set("views", "./views");

// environment
env.selectEnvironmet();

if (process.env.NODE_VIDLY_ENV == "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled ...");
}
//
app.get("/", (req, res) => {
  res.render("index", { title: "armanriazi-vidly-api", message: "Welcome" });
});
app.get("/cool", (req, res) => res.send(cool()));

const port = process.env.SERVER_VIDLY_PORT || 3060;
app.listen(port, process.env.SERVER_VIDLY_IP, () =>
  winston.info(`Listening on port ${port}...`)
);

// comments
// const port = process.env.SERVER_VIDLY_PORT || 3061;
// // is NODE_ENV set to "development"?
// //const DEVMODE = process.env.NODE_ENV === "development";
// winston.info(
//   `application started in ${process.env.NODE_ENV} mode on port ${port}`
// );
