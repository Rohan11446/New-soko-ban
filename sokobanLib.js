import generate from "sokoban-generator";

// Optional warmup to speed up first request
generate({ width: 5, height: 5, boxes: 1, attempts: 10, type: "string" });
console.log("Sokoban generator warmed up");

export default generate;
