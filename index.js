require("./startup/logging");
const express = require("express");
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const cool = require("cool-ascii-faces");
const winston = require("winston");
var mung = require("express-mung");
const config = require("config");
const app = express();

require("./startup/cors")(app);

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
var port = 3051;

require("./startup/validation")();

//winston.info("Application Name: " + config.get("name"));
//winston.info("Application Email: " + config.get("email.address"));

//check connection
createDb();
// environment
env.selectEnvironmet();

app.set("view engine", "pug");
app.set("views", "./views");

if (process.env.NODE_ENV == "development") {
  port = process.env.SERVER_VIDLY_PORT || 3060;
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled ...");
} else {
  port = process.env.PORT || 3060;
}
//
app.get("/", (req, res) => {
  res.render("index", {
    title: "armanriazi-vidly-api",
    message: "Welcome to the Api 1.0.0",
    rel: "icon",
    type: "image/x-icon",
    href: "https://miro.medium.com/max/256/1*zORANF0nahgJyvs3sXMMlg.png",
    main: "Example APIs",
    p1:
      "Query Genre:     https://armanriazi-vidly-api.herokuapp.com/api/genres/name/comedy",
    p2:
      "Token Generate:  https://armanriazi-vidly-api.herokuapp.com/api/auth/yourRefToken",
  });
});
app.get("/cool", (req, res) => res.send(cool()));

var server = app.listen(port, () =>
  winston.info(`Listening on port ${server.address().port}...`)
);

// comments

// get one unique id
//couch.uniqid().then(ids => ids[0]);
// get N unique ids
//couch.uniqid(N).then(ids => ids.map(...));

// const port = process.env.SERVER_VIDLY_PORT || 3061;
// // is NODE_ENV set to "development"?
// //const DEVMODE = process.env.NODE_ENV === "development";
// winston.info(
//   `application started in ${process.env.NODE_ENV} mode on port ${port}`
// );
