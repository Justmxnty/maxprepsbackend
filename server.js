const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

/*
  MASTER CACHE (ESPN STRUCTURE)
*/
let cache = {
  live: [],
  final: [],
  scheduled: [],
  lastUpdated: null
};

/*
  🔥 TEMP DATA (replace later with MaxPreps scraping)
  This keeps your API WORKING immediately
*/
function loadMockData() {
  cache.live = [
    {
      home: "Duncanville",
      away: "Allen",
      homeScore: 28,
      awayScore: 21,
      quarter: "Q3",
      timeLeft: "6:42",
      city: "Dallas",
      classification: "6A"
    }
  ];

  cache.final = [
    {
      home: "Lake Travis",
      away: "Westlake",
      homeScore: 17,
      awayScore: 21,
      city: "Austin",
      classification: "6A"
    }
  ];

  cache.scheduled = [
    {
      home: "Judson",
      away: "Steele",
      city: "San Antonio",
      classification: "6A"
    }
  ];

  cache.lastUpdated = new Date().toISOString();
}

/*
  ROOT (fixes "Cannot GET /")
*/
app.get("/", (req, res) => {
  res.send("Texas HS Football API is running");
});

/*
  MAIN ENDPOINT (Squarespace uses this)
*/
app.get("/scores", (req, res) => {
  res.json(cache);
});

/*
  REFRESH DATA FUNCTION
  (later you replace this with MaxPreps scraping)
*/
function refreshData() {
  loadMockData();
  console.log("API updated:", cache.lastUpdated);
}

/*
  AUTO REFRESH
*/
refreshData();
setInterval(refreshData, 15000);

/*
  START SERVER (Render-safe)
*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API running on port", PORT);
});
