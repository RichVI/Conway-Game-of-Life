import React, { useState, useCallback, useRef, useEffect } from 'react';
import produce from 'immer';
import randomColor from 'randomcolor';

//Set position of neighbor cells to check (up,down,left,right, dia)
const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
];

const App = () => {

    // State of Grid Structure
    const [numRows, setNumRows] = useState(25);
    const [numCols, setNumCols] = useState(25);

    // State of Cell color
    const [color, setColor] = useState('red');

    // State of generation count
    const [genCount, setGenCount] = useState(0)

    // State of whether cell is alive or dead
    const [running, setRunning] = useState(false);
    let runningCount = 0

    // Generate the empty grid
    const generateEmptyGrid = () => {
        const rows = [];
        for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => 0));
        }
        return rows;
    };

    const [grid, setGrid] = useState(() => {
        return generateEmptyGrid();
    });
    
    // Seed the empty grid on render, and button click
    // Using Math.random
    const seedGrid = useCallback(() => {
        const rows = [];
        for (let i = 0; i < numRows; i++) {
            rows.push(
                Array.from(Array(numCols), () =>
                    Math.random() > 0.5 ? 1 : 0
                )
            );
        }
        setGrid(rows);
    }, [numCols, numRows]);

    // Re-render DOM based on seedGrid, numRow, numCol
    useEffect(() => {
        seedGrid();
    }, [seedGrid, numRows, numCols]);

    //Reference the running state to avoid re-render
    const runningRef = useRef(running);
    runningRef.current = running;


    // Simulation continues based on the Ref of generation count
    const runSimulation = useCallback(() => {
        // Watching ref
        if (!runningRef.current) {
            return;
        }

        // Increment the generation count
        setGenCount(runningCount++)

        // Operation Algorithm 
        setGrid((g) => {
            //
            return produce(g, (gridCopy) => {
                for (let i = 0; i < numRows; i++) {
                    for (let j = 0; j < numCols; j++) {
                        let neighbors = 0;
                        operations.forEach(([x, y]) => {
                            const newI = i + x;
                            const newJ = j + y;
                            
                            // Checking each neightbor grid
                            if (
                                newI >= 0 &&
                                newI < numRows &&
                                newJ >= 0 &&
                                newJ < numCols
                            ) {
                                neighbors += g[newI][newJ];
                            }
                        });
                        
                        // Rule 1,3 ) Cell dies if neighbor is less than 3 or more than 3
                        if (neighbors < 2 || neighbors > 3) {
                            gridCopy[i][j] = 0;

                        } 
                        // Rule 4) Dead cell with exactly three neighbor lives
                        else if (g[i][j] === 0 && neighbors === 3) {
                            gridCopy[i][j] = 1;
                        }
                    }
                }
            });
        });

        //Set timeout speed/frequency for simulation
        setTimeout(runSimulation, 100);
    }, [numCols, numRows, runningCount]);

    return (
        <>
            <div>Generation: {genCount}</div>

            {/* Start simiulation  */}
            <button
                onClick={() => {
                    setRunning(!running);
                    if (!running) {
                        runningRef.current = true;
                        runSimulation();
                    }
                }}>
                {running ? 'Stop' : 'Start'}
            </button>
            
            {/* Customs Feature - Seeding the grid with random cells */}
            <button
                onClick={() => {
                    seedGrid();
                }}>
                seed
            </button>

            {/* Generate Empty Grid */}
            <button
                onClick={() => {
                    setGrid(generateEmptyGrid());
                }}>
                Clear Grid
            </button>
            
            {/* Customs Feature - Custom Grid size */}
            <button
                onClick={() => {
                    setNumRows(25);
                    setNumCols(25);
                }}>
                Small
            </button>
            <button
                onClick={() => {
                    setNumRows(50);
                    setNumCols(50);
                }}>
                Medium
            </button>
            <button
                onClick={() => {
                    setNumRows(100);
                    setNumCols(100);
                }}>
                Large
            </button>


            {/* Customs Feature - Set Cell Color */}
            <button
                onClick={() => {
                    setColor('red')
                }}>
                Red
            </button>
            <button
                onClick={() => {
                    setColor('purple')
                }}>
                Purple
            </button>
            <button
                onClick={() => {
                    setColor('green')
                }}>
                Green
            </button>
            <button
                onClick={() => {
                    setColor('pink')
                }}>
                Pink
            </button>
            <button
                onClick={() => {
                    setColor('orange')
                }}>
                Orange
            </button>
            <button
                onClick={() => {
                    setColor('blue')
                }}>
                Blue
            </button>
            <button
                onClick={() => {
                    setColor('yellow')
                }}>
                Yellow
            </button>


            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${numCols}, 20px)`,
                }}>

                {/*Create own cell*/}
                {grid.map((rows, i) =>
                    rows.map((col, j) => (
                        <div
                            key={`${i}-${j}`}
                            onClick={() => {
                                if(!running){
                                    const newGrid = produce(grid, (gridCopy) => {
                                        gridCopy[i][j] = grid[i][j] ? 0 : 1;
                                    });
                                    setGrid(newGrid);
                                }
                            }}
                            style={{
                                width: 20,
                                height: 20,
                                backgroundColor: grid[i][j] ? randomColor({hue: `${color}`}) : 'black',
                                border: 'solid 1px black',
                            }}
                        />
                    ))
                )}
            </div>
        </>
    );
};
export default App;

