import React, { useState, useCallback, useRef } from "react";
// import logo from './logo.svg';
import "./App.css";
import produce from "immer";

const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
]; // represents locations surrounding current cell (neighbor cells)

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
}; // clears the grid

function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false); // by default 'running' state is false

  const runningRef = useRef(running); // useRef hook imported from React
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return; // recursive, whenever not running: kill simulation
    }

    // SIMULATE. uses double for loops to run thru every value in the grid (rows & cols)
    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK]; // tells us how many neighbors the current cell has
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
              // Rule 1, Any live cell with fewer than two live neighbours dies, as if by underpopulation.
              // Rule 3, Any live cell with more than three live neighbours dies, as if by overpopulation.
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
              // Rule 4, Any dead cell with EXACTLY THREE live neighbours becomes a live cell, as if by reproduction.
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100); // runs once every .5 second
  }, []);

  return (
    <div className="App">
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "STOP LIFE" : "START LIFE"}
      </button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        CLEAR
      </button>
      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
            );
          }

          setGrid(rows);
        }}
      >
        RANDOMIZE
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1; // setting initial state for grid
                  // immer library makes this an immutable change and generate a new grid
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "#EC87E4" : "#D3FBD8", // ternary to decide color of live/dead cells
                border: "solid 1px #000000",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
