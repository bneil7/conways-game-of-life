import React, { useState, useCallback, useRef } from "react";
import "../styles/styles.css";
import produce from "immer";

import Slider from "@material-ui/core/Slider";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";

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

function Life() {
  const [generations, setGenerations] = useState(0);
  const [playSpeed, setPlaySpeed] = useState(100); // default 100 ms
  const [gridSize, setGridSize] = useState(42); // initial grid size is 42x42

  const numRows = gridSize;
  const numCols = gridSize;

  const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
  }; // clears the grid

  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const resizeGrid = size => {
    setGridSize(size);
    setGrid(generateEmptyGrid());
  };

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

    setTimeout(() => {
      runSimulation();
      setGenerations(gen => gen + 1);
    }, playSpeed);
  }, [numCols, numRows, playSpeed]);

  const handleChange = (e, newVal) => {
    setPlaySpeed(newVal);
  };

  //   const manualStep = () => {

  //     setGenerations((gen) => gen + 1);
  //   }

  return (
    <div className="App">
      <h1>John Conway's Game of Life</h1>
      <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">
        Wikipedia
      </a>
      <br />
      <h2>Operations</h2>
      <ButtonGroup orientation="vertical" fullWidth="true">
        <Button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "STOP" : "START"}
        </Button>
        <Button disabled={true}>STEP</Button>
        <Button
          onClick={() => {
            setGrid(generateEmptyGrid());
            setGenerations(0);
          }}
          disabled={running ? true : false}
        >
          CLEAR
        </Button>
        <Button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
              );
            }

            setGrid(rows);
            setGenerations(0);
          }}
          disabled={running ? true : false}
        >
          RANDOMIZE
        </Button>
      </ButtonGroup>
      <br />
      <h4>Select Grid Size:</h4>
      <div className="gridsize">
        <Button
          onClick={() => {
            resizeGrid(25);
          }}
          disabled={running ? true : false}
        >
          {running ? "!25x25!" : "25x25"}
        </Button>
        <Button
          onClick={() => {
            resizeGrid(35);
          }}
          disabled={running ? true : false}
        >
          {running ? "!35x35!" : "35x35"}
        </Button>
        <Button
          onClick={() => {
            resizeGrid(50);
          }}
          disabled={running ? true : false}
        >
          {running ? "!50x50!" : "50x50"}
        </Button>
        <Button
          onClick={() => {
            resizeGrid(42);
          }}
          disabled={running ? true : false}
        >
          {running ? "!42x42!" : "42x42"}
        </Button>
      </div>
      <h2>Generation counter: {generations}</h2>
      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((cols, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1; // setting initial state for grid
                  // immer library makes this an immutable change and generate a new grid
                });
                setGrid(newGrid);
              }}
              style={
                running // make div unclickable while simulation is running
                  ? {
                      pointerEvents: "none",
                      width: 20,
                      height: 20,
                      backgroundColor: grid[i][k] ? "#EC87E4" : "#D3FBD8", // ternary to decide color of live/dead cells
                      border: "solid 1px #000000",
                    }
                  : {
                      width: 20,
                      height: 20,
                      backgroundColor: grid[i][k] ? "red" : "#D3FBD8", // ternary to decide color of live/dead cells
                      border: "solid 1px #000000",
                    }
              }
            />
          ))
        )}
      </div>
      <div className="slider">
        <h2>
          Speed Slider (X milliseconds per generation)
          <Slider
            label="speed"
            value={playSpeed}
            onChange={handleChange}
            min={10}
            max={1000}
            step={10}
            valueLabelDisplay="on"
            marks={true}
          />
        </h2>
      </div>
      <div className="rules">
        <h3>Rules</h3>
        <h4>
          These rules, which compare the behavior of the automaton to real life,
          can be condensed into the following:
        </h4>
        <ol>
          <li>1. Any live cell with two or three live neighbours survives.</li>
          <li>
            2. Any dead cell with three live neighbours becomes a live cell.
          </li>
          <li>
            3. All other live cells die in the next generation. Similarly, all
            other dead cells stay dead.
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Life;
