const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// TEST DATA (so Squarespace ALWAYS shows something)
const data = {
  live: [
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
  ],
  final: [
    {
      home: "Lake Travis",
      away: "Westlake",
      homeScore: 17,
      awayScore: 21,
      city: "Austin",
      classification: "6A"
    }
  ],
  scheduled: [
    {
      home: "Judson",
      away: "Steele",
      city: "San Antonio",
      classification: "6A"
    }
  ]
};

// ROOT CHECK
app.get("/", (req, res) => {
  res.send("Texas HS Football API is running");
});

// ✅ THIS IS WHAT SQUARESPACE NEEDS
app.get("/scores", (req, res) => {
  res.json(data);
});

// IMPORTANT FOR RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
