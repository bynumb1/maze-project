var maze = buildMaze();
var cursorCell;
var startingCursor=false;

function Cell(x, y) {
	this.xPos = x;
	this.yPos = y;
	this.northWall = true;
	this.eastWall = true;
	this.westWall = true;
	this.southWall= true;
	this.visited= false;
	this.arrivedFrom=null;
}

/*
 * Creates a 600 x 600 maze with cells. 
 */

function buildMaze() {
	console.log("buildMaze enter"); 
	var a = new Array();
	for(x=0; x<600; x+=10) {
		for(y=0; y<600; y+=10) {
			var cell = new Cell(x,y);
			var id = x+":"+y;
			a[id]=cell;
			
		}
	}
	console.log("buildMaze exit");
	return a;
}

/*
 * Creates a maze intended for the 600x600 canvas display
 * with units of 10 pixels per block
 */
function drawMaze() {
	var canvas = document.getElementById("maze");
	var context = canvas.getContext('2d');
	var i, y;
	context.strokeStyle='black';
	for(y=0; y<=610; y+=10) {	
		context.beginPath();
		context.moveTo(0,y);
		context.lineTo(600,y);
		context.lineWidth=1;
		context.stroke();
	}
	for(x=0; x<=610; x+=10) {
		context.beginPath();
		context.moveTo(x, 0);
		context.lineTo(x, 600);
		context.lineWidth=1;
		context.stroke();
	}
}


/*
 * Event driven function that can be bound
 * to a listener to display the position

function displayCursorPosition(e) {
        var parentPosition=getPosition(e.currentTarget);
	var xPos=e.clientX - parentPosition.x;
	var yPos=e.clientY - parentPosition.y;
	xPos-=xPos%10
	yPos-=yPos%10
	var posMessage = "X: "+xPos+" Y: "+yPos;
	var text=document.getElementById("pos").innerText=posMessage;
}
 */
 /*
 * Accepts the determines the position of a square in the maze
 * relative to the starting position of the canvas element
 */
function getPosition(element) {
	var xPos=0;
	var yPos=0;	
	
	while(element) {
		xPos += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        	yPos += (element.offsetTop - element.scrollTop + element.clientTop);
        	element = element.offsetParent;
	}
	return { x: xPos, y:yPos };
}
/*
 * Event triggered function that sets the starting
 * cursor for the maze generator
 */
function drawStartingCursor(e) {
	if(!startingCursor) {
		var parentPosition=getPosition(e.currentTarget);
		var xPos=e.clientX -parentPosition.x;
		var yPos=e.clientY -parentPosition.y;
		var key;
		xPos-=xPos%10;
		yPos-=yPos%10;
		
		console.log("Desired Cursor: "+xPos+","+yPos);	
		key=xPos+":"+yPos;
		cursorCell=maze[key];
		console.log(cursorCell);
		

		var canvas=document.getElementById("maze");
		var context=canvas.getContext('2d');

		context.rect(xPos+1.5, yPos+1.5, 6.5, 6.5);
		context.fillStyle="blue";
		context.fill();
		context.stroke();
		startingCursor=true;
	}
}
/*
 * Redraws the selected cell as white
 */
function removeCursor(cell) {
}


/*
 * Event driven function that clears the maze and
 * makes it possible to choose a new starting point
 */
function clearMaze(e) {
	console.log("Enter clearMaze");
	var canvas = document.getElementById("maze");
	var context = canvas.getContext('2d');
	console.log("Obtained canvase element:"+ canvas.width+"x"+canvas.height);
	context.clearRect(0,0,canvas.width, canvas.height);
	drawMaze();
	startingCursor=false;
	cursorCell=null;
	maze=null;
	maze=buildMaze();
}
/*
 * Accepts two cells and a string direction
 * removes the wall in the diretion of the string
 * by drawing over it
 */
function destroyWall(cell1, cell2) {

	var canvas = document.getElementById("maze");
	var context = canvas.getContext('2d');

	cell1Center = {x:cell1.xPos+5, y:cell1.yPos+5};
	cell2Center = {x : cell2.xPos+5, y:cell2.yPos+5};

	context.beginPath;
	context.moveTo(cell1Center.x, cell1Center.y);
	context.lineTo(cell2Center.x, cell2Center.y);
	context.lineWidth=7.75;
	context.strokeStyle='white';
	context.stroke();
}
/*
 * Determines the lookup keys for
 * all a cells neighbors
 */
function getNeighborKeyArray(cell) {
	var north, south, east, west;
	var inc=10;
	console.log("enter getNeighborKeyArray");
	if(cell.yPos-inc<0) {		
		north=null;		
	} else {
		north=cell.xPos+":"+(cell.yPos-inc);
		
	}
	if(cell.yPos+inc>590) {
		south=null;
		
	} else {
		south=cell.xPos+":"+(cell.yPos+inc);
		
	}
	if(cell.xPos-inc<0) {
		east=null;
	} else {
		east=(cell.xPos-inc)+":"+cell.yPos;
	}
	if(cell.xPos+inc>590) {
		west=null;
	} else {
		west=(cell.xPos+inc)+":"+cell.yPos;
	}
	return {0:north, 1:south, 2:east, 3:west};
}
/*
 * Determines if any neighbor of the cell
 * is unvisited
 */
function hasUnvisitedNeighbors(cell) {
	var xPos, yPos;
	var inc = 10;
	var neighborKeyArray;

	neighborKeyArray=getNeighborKeyArray(cell);
	console.log(neighborKeyArray);
	
	for(item in neighborKeyArray) {
			var key = neighborKeyArray[item];
			if(key!=null || key!=undefined) {
				console.log("Key value is: "+ key);
				if(maze[key].visited==false) {
					return true;
				}
			}
	}
	return false;
}
/*
 * Depth first search on the maze
 * bound to run button
  */
function dfs(e) {
	timer = setInterval(stepDFS, 5);
	if(allCellsVisited()) { 
		clearInterval(timer);
	}
	return timer;

}

function stepDFS() {
	
  	var direction,
  	    lookupKey;
  	/* First mark cursor cell visited */
  	console.log("entered dfs routine");
  	if(!allCellsVisited()) { 		
  		cursorCell.visited=true;
  		if(hasUnvisitedNeighbors(cursorCell)) {
  			var madeMove = false;
  			while(!madeMove) {
  			direction = Math.floor(Math.random()*4);
  			
			console.log("cusorCell has unvisited neighbors");
			console.log("Random is: "+direction);
			console.log(cursorCell);
	  		if(direction==0 && cursorCell.yPos-10>=0) {
	  			lookupKey=cursorCell.xPos+":"+(cursorCell.yPos-10);
	  			var neighbor = maze[lookupKey];
	  			if(neighbor.visited===false) {
	  				destroyWall(cursorCell, neighbor);
	  				neighbor.arrivedFrom = cursorCell;
	  				cursorCell=neighbor;
	  				madeMove=true;
	  			}
	  		}
	  		if(direction==1 && cursorCell.xPos+10<=590) {
	  			lookupKey=(cursorCell.xPos+10)+":"+cursorCell.yPos;
	  			var neighbor = maze[lookupKey];
	  			if(neighbor.visited===false) {
	  				destroyWall(cursorCell, neighbor);
	  				neighbor.arrivedFrom=cursorCell;
	  				cursorCell=neighbor;
	  				madeMove=true;
	  			}
	  		} 
	  		if(direction==2 && cursorCell.yPos+10<=590) {
	  			lookupKey=cursorCell.xPos+":"+(cursorCell.yPos+10);
	  			var neighbor = maze[lookupKey];
	  			if(neighbor.visited===false) {
	  				destroyWall(cursorCell, neighbor);
	  				neighbor.arrivedFrom=cursorCell;
	  				cursorCell=neighbor;
	  				madeMove=true;  			
	  			}
	  		} 
	  		if(direction==3 && cursorCell.xPos-10>=0) {
	  			lookupKey=(cursorCell.xPos-10)+":"+cursorCell.yPos;
	  			var neighbor = maze[lookupKey];
	  			if(neighbor.visited===false) {
	  				destroyWall(cursorCell, neighbor);
					neighbor.arrivedFrom=cursorCell;
	  				cursorCell=neighbor;  
	  				madeMove=true;			
	  			}
	  		}
	  	}
	  	} else {
			console.log('cusor backtrack');
			while(!hasUnvisitedNeighbors(cursorCell)) {
	  			cursorCell = cursorCell.arrivedFrom;
			}
	  }

  	}
	
 }
  /*
   * Determines if there are any cells left
   * to be visited
   */
function allCellsVisited() {
	var lookupKey;
	console.log("enter allCellsVisited");
	for(x=0; x<600; x+=10) {
		for(y=0; y<600; y+=10) {
			lookupKey = x+":"+y;
			if(maze[lookupKey].visited==false) {
				console.log("exit allCellsVisited with false");
				return false;
			}
		}
	}
	return true;
}
