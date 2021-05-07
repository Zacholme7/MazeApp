import React, {useState} from 'react';
import Node from '../Node/Node'
import {useSelector, useDispatch} from 'react-redux';
import './Grid.css'

export const ROW = 20;
export const COL = 45;

const getInitialGrid = () =>{
    const grid = [];
    for(let row = 0; row < ROW; row++){
        const currRow = [];
        for(let col = 0; col < COL; col++){
            currRow.push(createNode(col, row));
        }
        grid.push(currRow);
    }
    return grid;
}

const createNode = (col, row) => {
    return {
        starting: false, // the starting node
        ending: false, // the ending node
        col: col, // column of the cell
        row: row, // row of the cell
        visited: false, // has the cell been visited already
        path: false, // is the cell part of the current path
        current: false, // is the cell the current one
        top: true, // top wall
        bottom: true, // bottom wall
        right: true, // right wall
        left: true, // left wall
        doublePath: false, // double path when you backtrack in pathfinding
        inMaze: false // in maze for wilsons
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let gridConditioner = 0;
let solveConditioner = 0;
let resetConditioner = 0;

const Grid = () =>  {
    
    const [grid, setGrid] = useState(getInitialGrid());
    const algo = useSelector(state => state.algo)
    const solver = useSelector(state => state.solver)

      
    async function generate() {
        if(gridConditioner == 0){
            gridConditioner = 1;
            solveConditioner = 1
            let maze = algo(grid);
            for(let i = 0; i < maze.length; i++){
                await sleep(5);
                setGrid(maze[i])
            }
            solveConditioner = 0;
            resetConditioner = 1;
        }
    };

    async function pathfinder() {
        if(gridConditioner == 1 && solveConditioner == 0){
            resetConditioner = 0;
            solveConditioner = 1
            let solvedMaze = solver(grid);
            for(let i = 0; i < solvedMaze.length; i++){
                await sleep(5);
                setGrid(solvedMaze[i])
            }
            resetConditioner = 1;
        }
    }


    const resetGrid = () => {
        if(resetConditioner == 1 ){
            gridConditioner = 0
            solveConditioner = 0
            setGrid(getInitialGrid());
        }
    };


    


        return(
            <div>
                
           <div className="top">
               <div className="control-container">
               <button className={`control-btn`} onClick={() => generate()} >
                       Generate Maze
            </button>
            <button className={`control-btn`} onClick={() => resetGrid()} >
                       Reset to Inital Grid
            </button>
            <button className={`control-btn`} onClick={() => pathfinder()} >
                       Solve Maze
            </button>
               </div>
            </div>

           
        
            <div className="grid">
                {grid.map((row, rowIdx) => {
                    return(
                        <div key={rowIdx} className="row" style={{height: `calc(100% / ${ROW}`, width: "100%", display: 'flex'}}>
                            {row.map((node, nodeIdx) => {
                                
                                const {starting, ending, col, row, visited, path, current, top, bottom, right, left, doublePath} = node;
                                return(
                                    <Node 
                                        key = {nodeIdx}
                                        starting = {starting}
                                        ending = {ending}
                                        col = {col}
                                        row = {row}
                                        visited = {visited}
                                        path = {path}
                                        current = {current}
                                        top = {top}
                                        bottom = {bottom}
                                        right = {right}
                                        left = {left}
                                        doublePath = {doublePath}
                                    ></Node>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            </div>
        );
}



export default Grid;
