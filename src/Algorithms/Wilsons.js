import { ROW, COL } from '../components/Grid/Grid.js';
import { getNeighbors, newGrid, removeWall } from './utility.js';

// gets the direction of the second cell in relation to the first cell
function getDirection(firstCell, secondCell){
    let x = firstCell.row - secondCell.row
    let y = firstCell.col - secondCell.col 

    // 0: north
    // 1: east
    // 2: south
    // 3: west
    if(x > 0){
        return 0
    }else if(x < 0){
        return 2
    }else if(y > 0){
        return 3
    }else if(y < 0){
        return 1
    }
}

// removes the wall of the cell and the cell in the passed direction
function removeWallDirection(cell, direction, grid){

    if(direction == 0){
        // north 
        console.log("remove north")
        removeWall(cell, grid[cell.row-1][cell.col])
    } else if(direction == 1){
        // east
        console.log("remove east")
        removeWall(cell, grid[cell.row][cell.col+1])
    } else if(direction == 2){
        // south
        console.log("remove south")
        removeWall(cell, grid[cell.row+1][cell.col])
    } else if(direction == 3){
        // west
        console.log("remove west")
        removeWall(cell, grid[cell.row][cell.col-1])
    }
    
    
}

// maps 2D grid to 1D array
function getPos(cell){
    return (cell.row * COL) + cell.col
}


// wilsons maze generation algorithm
export function wilsons(grid){
    // mazeObj to keep track of all cells in grid and if they are already in maze
    let mazeObj = {}
    for(let i = 0; i < ROW * COL; i++){
        mazeObj[i] = false
    }

    let gridArr = [] // grid array to hold updated grids
    let currentCell = grid[Math.floor(ROW/2)][Math.floor(COL/2)] // sets starting to middle of maze
    mazeObj[getPos(currentCell)] = true // this random cell, middle, is now part of the maze
    let counter = ROW * COL - 1 // how many cells are left to be part of the maze
    currentCell.current = true;
    gridArr.push(newGrid(grid))

    
    // want to keep looping while we have more cells left in the maze
    while(counter > 0){
        let pathObj = {} // will hold the path to trace back

        // pick unvisited cell, do this at the start of every random walk
        let randRow = Math.floor(Math.random() * ROW)
        let randCol = Math.floor(Math.random() * COL)
        let currentCell = grid[randRow][randCol]
        let pathCell = currentCell // used for path unwarp
        currentCell.path = true;
        gridArr.push(newGrid(grid))


        //counter -= 1 // can decrement a counter since this will 100% be a start for the path
        
        // loop while rand is not in the maze
        while(true){
            let nextCell = getNeighbors(grid, currentCell) // this will give me a neighbor of the random startin cell

            // check if that cell is already in the maze
            if(mazeObj[getPos(currentCell)] == true){
                pathObj[getPos(currentCell).toString()] = 4 // ending, this cell is in the maze
                gridArr.push(newGrid(grid))
                break;
            } 

            let direction = getDirection(currentCell, nextCell)
            pathObj[getPos(currentCell).toString()] = direction
            
            

            currentCell = nextCell // reset the current cell
            currentCell.path = true;
            gridArr.push(newGrid(grid))
        }
        console.log(pathObj)
        console.log(getPos(pathCell))

        
        
        // want to unwrap pathObj and remove walls
        while(pathObj[getPos(pathCell)] != 4){
            let tempDir = pathObj[getPos(pathCell)];
            console.log(tempDir)
    
            if(tempDir == 0){
                removeWallDirection(pathCell, 0, grid)
                counter -= 1
                mazeObj[getPos(pathCell)] = true
                pathCell = grid[pathCell.row -1][pathCell.col]
            } else if(tempDir == 1){
                removeWallDirection(pathCell, 1, grid)
                counter -= 1
                mazeObj[getPos(pathCell)] = true
                pathCell = grid[pathCell.row][pathCell.col+1]
            } else if(tempDir == 2){
                removeWallDirection(pathCell, 2, grid)
                counter -= 1
                mazeObj[getPos(pathCell)] = true
                pathCell = grid[pathCell.row +1][pathCell.col]
            } else if(tempDir == 3){
                removeWallDirection(pathCell, 3, grid)
                counter -= 1
                mazeObj[getPos(pathCell)] = true
                pathCell = grid[pathCell.row][pathCell.col-1]
            }
            
        }
    }
    gridArr.push(newGrid(grid))
    return gridArr;
    
}


