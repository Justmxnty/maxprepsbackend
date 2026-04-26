const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

let cache = {
  games: [],
  lastUpdated: null
};

// 🔥 YOUR TARGET MARKETS
const TARGET_CITIES = ["san antonio", "austin", "temple", "dallas", "houston"];

// (optional but recommended)
const VALID_6A_5A = [
  "allen", "duncanville", "north shore", "lake travis",
  "westlake", "judson", "steele", "de soto"
];

async function scrapeScores() {
  try {
    const url = "https://www.maxpreps.com/scoreboard/football/texas/";

    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);
    let games = [];

    $(".game, .contest").each((i, el) => {
      const home = $(el).find(".home .name, .team.home .name").text().trim();
      const away = $(el).find(".away .name, .team.away .name").text().trim();

      const homeScore = $(el).find(".home .score, .team.home .score").text().trim() || "0";
      const awayScore = $(el).find(".away .score, .team.away .score").text().trim() || "0";

      if (!home || !away) return;

      // ✅ FILTER: 5A / 6A (basic version)
      if (!isValidTeam(home) && !isValidTeam(away)) return;

      // ✅ FILTER: Regions
      if (!isTargetCity(home) && !isTargetCity(away)) return;

      games.push({
        home,
        away,
        homeScore,
        awayScore,
        homeLogo: getLogo(home),
        awayLogo: getLogo(away)
      });
    });

    cache.games = games;
    cache.lastUpdated = new Date();

    console.log("Updated:", games.length);

  } catch (err) {
    console.error("Scrape failed:", err.message);
  }
}

function isTargetCity(name) {
  return TARGET_CITIES.some(city =>
    name.toLowerCase().includes(city)
  );
}

function isValidTeam(name) {
  return VALID_6A_5A.some(team =>
    name.toLowerCase().includes(team)
  );
}

function getLogo(team) {
  return `https://yourdomain.com/logos/${team.replace(/\s/g, "").toLowerCase()}.png`;
}

// ✅ MAIN ENDPOINT (Squarespace will call this)
app.get("/scores", async (req, res) => {
  res.json({
    updated: cache.lastUpdated,
    games: cache.games
  });
});

// auto-refresh every 30 sec
setInterval(scrapeScores, 30000);

// initial load
scrapeScores();

app.get("/", (req, res) => {
  res.send("MaxPreps API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Live on", PORT));
