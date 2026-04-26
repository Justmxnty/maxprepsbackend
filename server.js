const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

/*
  🏫 REAL TEXAS 5A / 6A DATABASE
*/
const TEAMS = {
  duncanville: { classification: "6A", city: "Dallas" },
  allen: { classification: "6A", city: "Dallas" },
  westlake: { classification: "6A", city: "Austin" },
  "lake travis": { classification: "6A", city: "Austin" },
  steele: { classification: "6A", city: "San Antonio" },
  judson: { classification: "6A", city: "San Antonio" }
};

/*
  🏈 LIVE GAME STATE (replace later with real ingestion)
*/
let games = {
  live: [
    {
      home: "Duncanville",
      away: "Allen",
      homeScore: 28,
      awayScore: 21,
      quarter: "Q3",
      timeLeft: "6:42"
    }
  ],
  final: [
    {
      home: "Lake Travis",
      away: "Westlake",
      homeScore: 17,
      awayScore: 21
    }
  ],
  scheduled: [
    {
      home: "Judson",
      away: "Steele"
    }
  ]
};

/*
  🧠 ENRICH FUNCTION (THIS IS THE ESPN MAGIC)
*/
function enrich(game) {
  const homeMeta = TEAMS[game.home.toLowerCase()] || {};
  const awayMeta = TEAMS[game.away.toLowerCase()] || {};

  return {
    ...game,
    city: homeMeta.city || awayMeta.city || "Texas",
    classification: homeMeta.classification || awayMeta.classification || "Unknown"
  };
}

/*
  📡 API ENDPOINT (ESPN STRUCTURE)
*/
app.get("/scores", (req, res) => {
  res.json({
    live: games.live.map(enrich),
    final: games.final.map(enrich),
    scheduled: games.scheduled.map(enrich)
  });
});

/*
  🔧 ROOT CHECK
*/
app.get("/", (req, res) => {
  res.send("ESPN Texas HS Football API Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("ESPN API live on", PORT));
