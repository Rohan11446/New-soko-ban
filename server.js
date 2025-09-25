import express from 'express';
import { SokobanSolver } from 'sokoban-solver'; // Assuming a Sokoban solver library is available

const app = express();
const port = process.env.PORT || 3000;

app.get('/generate', (req, res) => {
  const { width = 10, height = 20, boxes = 5, minWalls = 3 } = req.query;

  // Step 1: Initialize an empty grid
  const grid = Array.from({ length: height }, () => Array(width).fill(' '));

  // Step 2: Place boxes and goals
  const goals = [];
  const boxesPositions = [];
  for (let i = 0; i < boxes; i++) {
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      if (grid[y][x] === ' ' && !goals.some(g => g.x === x && g.y === y)) {
        grid[y][x] = 'O'; // Goal
        goals.push({ x, y });
        placed = true;
      }
    }
  }

  // Step 3: Place the player adjacent to a box
  const playerPos = { x: goals[0].x + 1, y: goals[0].y };
  grid[playerPos.y][playerPos.x] = '웃';

  // Step 4: Add walls and floors
  // This is a simplified approach; you can enhance it by adding more walls
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === ' ' && Math.random() < minWalls / 100) {
        grid[y][x] = '#'; // Wall
      }
    }
  }

  // Step 5: Validate the level
  const solver = new SokobanSolver(grid);
  if (!solver.isSolvable()) {
    return res.status(500).json({ error: 'Generated level is not solvable' });
  }

  // Step 6: Convert grid to CSV
  const csv = grid.map(row => row.join(',')).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=level.csv');
  res.send(csv);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
