import express from "express";
import cors from "cors";
import generate from "./sokobanLib.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Map classic symbols to your custom legend
function mapToCustomLegend(levelString) {
  return levelString
    .replace(/@/g, "웃")   // Player
    .replace(/\+/g, "(웃)") // Player on endzone
    .replace(/#/g, "#")    // Wall
    .replace(/\$/g, "▩")   // Box
    .replace(/\*/g, "◙")   // Box in endzone
    .replace(/\./g, "O");  // Endzone
}

// Convert level string to CSV
function convertToCSV(levelString) {
  return levelString
    .split("\n")
    .map(row => row.split("").join(","))
    .join("\n");
}

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Sokoban Level Generator API",
    usage:
      "GET /generate?width=7&height=7&boxes=2&minWalls=5&attempts=1000&seed=123"
  });
});

// Generate endpoint
app.get("/generate", (req, res) => {
  const width = parseInt(req.query.width) || 7;
  const height = parseInt(req.query.height) || 7;
  const boxes = parseInt(req.query.boxes) || 2;
  const minWalls = parseInt(req.query.minWalls) || 5;
  const attempts = parseInt(req.query.attempts) || 1000;
  const seed = parseInt(req.query.seed) || Date.now();
  const type = "string";

  try {
    const level = generate({ width, height, boxes, minWalls, attempts, seed, type });

    if (!level) {
      return res.status(400).json({
        error: "Could not generate a solvable level with given constraints"
      });
    }

    const mappedLevel = mapToCustomLegend(level);
    const csvContent = convertToCSV(mappedLevel);

    res.setHeader("Content-Disposition", "attachment; filename=sokoban_level.csv");
    res.setHeader("Content-Type", "text/csv");
    res.send(csvContent);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Sokoban API running on port ${PORT}`);
});
