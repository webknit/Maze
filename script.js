// Constructor for the maze itself
function Maze(width, height) {

	// Set the default values
	this.width = width;
	this.height = height;
	
	this.startX = null;
	this.startY = null;
	this.startOrientation = null;
	this.endX = null;
	this.endY = null;
	
	// Add directions to an array to keep the code DRY
	this.directions = ['north', 'east', 'south', 'west'];
	
	// Create the spaces in the maze
	// eg if you grid is 7x5 we want 35 squares
	this.spaces = [];
	
	var x, y;
	
	for(x=1; x <= width; x++) {
	
		// Created array objects
		this.spaces[x] = [];
		
		for(y=1; y <= height; y++) {
		
			// Creates objects inside the array
			// Creating the 4 sides for NSEW and setting to false to begin with
			this.spaces[x][y] = new MazeSpace(this.directions);
		
		}
	
	}

}

// Set the starting position
Maze.prototype.setStart = function(x, y, orientation) {

	// Check if it's acceptable(in bounds and NSEW)
	if (this.isInBounds(x,y) && this.isValidDirection(orientation)) {

		this.startX = x;
		this.startY = y;
		this.startOrientation = orientation;
		return true;
	
	}
	
	// Return true or false
	return false;

}

// Set the end position
Maze.prototype.setEnd = function(x, y) {

	if(!this.isInBounds(x,y)) {
	
		return false;
	
	}

	// If it passes then set the end variables
	this.endX = x;
	this.endY = y;
	return true;

}

// This sets the walls
Maze.prototype.setWall = function(x,y, direction) {

	// Standard check
	if (this.isInBounds(x,y) && this.isValidDirection(direction)) {
	
		// This is using the setWall from the new MazeSpace in the spaces array
		// Takes an x and y variable which accesses the array element along with the direction
		this.spaces[x][y].setWall(direction);
		return true;
	
	}
	
	return false;
	
}

// Seperate the direction validation to keep things DRY
Maze.prototype.isValidDirection = function(direction) {

	return this.directions.indexOf(direction) !== -1;

}

// Seperate the inbounds validation to keep things DRY
Maze.prototype.isInBounds = function(x, y) {

	return x > 0 && x <= this.width && y > 0 && y <= this.height;

}

Maze.prototype.canMove = function(x, y, direction) {

	if (!this.isValidDirection(direction)) {

		return false;

	}

	if (!this.isInBounds(x,y)) {

		return false;

	}

	var forwardX, forwardY;

	switch(direction) {

		case 'north':
			forwardX = x;
			forwardY = y + 1;
			break;
		case 'east':
			forwardX = x + 1;
			forwardY = y;
			break;
		case 'south':
			forwardX = x;
			forwardY = y - 1;
			break;
		case 'west':
			forwardX = x - 1;
			forwardY = y;
			break;

	}

	if (!this.isInBounds(forwardX, forwardY)) {

		return false;

	}

	if (this.spaces[x][y][direction]) {

		return false;

	}

	var opposites = {

		north: 'south',
		east: 'west',
		south: 'north',
		west: 'east'

	}

	if (this.spaces[forwardX][forwardY][opposites[direction]]) {

		return false;

	}


	return true;

}

// Constructor for the space. walls etc
function MazeSpace(directions) {

	var x;
	
	for(x=0; x < directions.length; x++) {
	
		this[directions[x]] = false;
	
	}

}

MazeSpace.prototype.setWall = function(direction) {

	// Set the direction to true, meaning it has a wall
	this[direction] = true;

}

function Robot() {

    this.x = null;
    this.y = null;
    this.orientation = null;
    this.maze = null;
    
}

Robot.prototype.setMaze = function(maze) {

    this.maze = maze;
    this.x = maze.startX;
    this.y = maze.startY;
    this.orientation = maze.startOrientation;
    
};

Robot.prototype.turnRight = function() {

    if (!this.maze || !this.maze.isValidDirection(this.orientation)) {
    
        return false;
        
    }

    var rights = {
        north: "east",
        east: "south",
        south: "west",
        west: "north"
    }
    
    this.orientation = rights[this.orientation];
    return true;
    
}

Robot.prototype.turnLeft = function() {

    if (!this.maze || !this.maze.isValidDirection(this.orientation)) {
    
        return false;
        
    }

    var lefts = {
        north: "west",
        east: "north",
        south: "east",
        west: "south"
    }
    
    this.orientation = lefts[this.orientation];
    return true;
    
}

Robot.prototype.moveForward = function() {

	if(!this.canMoveForward()) {

		return false;

	}

	switch(this.orientation) {

		case 'north':
			this.y += 1
			break;
		case 'east':
			this.x += 1
			break;
		case 'south':
			this.y -= 1
			break;
		case 'west':
			this.x -= 1
			break;

	}

	return true;

}

Robot.prototype.canMoveForward = function() {

	if (!this.maze) {

		return false;

	}

	return this.maze.canMove(this.x, this.y, this.orientation)

}

Robot.prototype.exitMaze = function(steps) {

	if(this.maze) {

		while(steps != 0) {

			steps -= 1;

			if(this.canMoveForward()) {

				this.moveForward();
				this.turnLeft();

			}

			else {

				this.turnRight();

			}

			if(this.x == this.maze.endX && this.y == this.maze.endY) {

				return true;

			}

		}

		return false;

	}

}