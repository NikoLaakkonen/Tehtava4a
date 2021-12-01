let sanakirja = [];
const express = require("express");
const fs = require("fs");

let data = fs.readFileSync("./sanakirja.txt", {
  encoding: "utf8",
  flag: "r",
});

//jakaa stringin osiin
const splitLines = data.split(/\r?\n/);
// käy läpi  splitLines:ssa  rivit
splitLines.forEach((line) => {
  const sanat = line.split(" "); //sanat taulukkoon sanat
  console.log(sanat);
  const sana = {
    eng: sanat[0],
    fin: sanat[1],
  };
  sanakirja.push(sana);
  console.log(sanakirja);
});

//const bodyParser = require("body-parser");
/* const app = express().use(bodyParser.json()); //vanha tapa - ei enää voimassa. 
kts. https://devdocs.io/express/ -> req.body*/
var app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

/*CORS isn’t enabled on the server, this is due to security reasons by default,
so no one else but the webserver itself can make requests to the server.*/
// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  res.setHeader("Content-type", "application/json");

  // Pass to next layer of middleware
  next();
});

// GET all users
app.get("/sanat", (req, res) => {
  //data:ssa on nyt koko tiedoston sisältö
  /*tiedoston sisältö pitää pätkiä ja tehdä taulukko*/

  res.json(sanakirja);
});
// GET sana
app.get("/sanat/:sana", (req, res) => {
  const haettavaSana = req.params.sana;
  const sana = sanakirja.find((haettava) => haettava.fin === haettavaSana);
  res.json(sana ? sana.eng : { message: "Not found" });
});

// Lisää sanan
app.post("/sanat", (req, res) => {
  const sana = req.body;
  sanakirja.push(sana);
  try {
    // Tallentaa sen sanakirjaan
    data += `${sana.eng} ${sana.fin}\n`;
    fs.writeFileSync("./sanakirja.txt", data);
    return res.status(201).json(sana);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }

  res.json(sana);
});

app.listen(3000, () => {
  console.log("Server listening at port 3000");
});
