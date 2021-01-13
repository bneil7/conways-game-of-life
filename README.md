# conways-game-of-life

## Rules (copypasta directly from Wikipedia: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)

The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead, (or populated and unpopulated, respectively). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

These rules, which compare the behavior of the automaton to real life, can be condensed into the following:

1. Any live cell with two or three live neighbours survives.
2. Any dead cell with three live neighbours becomes a live cell.
3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.

The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick. Each generation is a pure function of the preceding one. The rules continue to be applied repeatedly to create further generations.

####

## Custom Features

Implement at least 3 of the following features:

- Create a few sample cell configurations that users can load and run
- Add an option that creates a random cell configuration that users can run ✅
- Add additional cell properties, like color or size, and incorporate them into your visualization
- Allow users to specify the speed of the simulation ✅ (useRef)
- Provide functionality to manually step through the simulation one generation at a time, as opposed to animating automatically
- Allow users to change the dimension of the grid being displayed ✅
- Given a specific generation, calculate the configuration of cells at that point in time, and jump to that state, bypassing animation (i.e. skip ahead n generations).
