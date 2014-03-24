function Hexagon(aSize, anX, aY) {
	var TANSIXTY = Math.tan(2*Math.PI/360*60); // Precalculate this for efficiency's sake
	var size = aSize; // Size is the width of the hexagon
	var x = anX;
	var y = aY;
	var a;
	var h;
	var o;
	
	a = size/4;
	h = size/4*2;
	o = TANSIXTY*a;
	
	this.getSize = function() {
		return size;
	}				
	this.setSize = function(aSize) {
		size = aSize;
	}				
	this.getA = function() {
		return a;
	}
	this.setA = function(anA) {
		a = anA;
	}				
	this.getH = function() {
		return h;
	}				
	this.setH = function(anH) {
		h = anH;
	}				
	this.getO = function() {
		return o;
	}				
	this.setO = function(anO) {
		o = anO;
	}				
	this.getX = function() {
		return x;
	}				
	this.setX = function(anX) {
		x = anX;
	}				
	this.getY = function() {
		return y;
	}				
	this.setY = function(aY) {
		y = aY;
	}				

	this.draw = function(context) {
				context.beginPath();
				context.moveTo(x, y);
				context.lineTo(x+a, y-o);
				context.lineTo(x+a+h, y-o);
				context.lineTo(x+a+a+h, y);
				context.lineTo(x+a+h, y+o);
				context.lineTo(x+a, y+o);
				context.lineTo(x, y);
				context.fill();
				context.stroke();
				context.closePath();
	}
	
	this.contains = function(u, v) {
		var retval = false;
		// Box in centre of hexagon
		var inBox = u >= (x+a) && u <= (x+a+h) && v >= (y-o) && v <= (y+o);					
		// Triangle to the left of box
		var inLeftTriangle = u >= x && u <= x + a && v >= y - (u - x) * TANSIXTY && v <= y + (u - x) * TANSIXTY;					
		// Triangle to the right of box
		var inRightTriangle = u >= x + a + h && u <= x + a + h + a && v >= y - (x + a + h + a - u) * TANSIXTY && v <= y + (x + a + h + a - u) * TANSIXTY;
		
		if (inLeftTriangle || inBox || inRightTriangle) {
			retval = true;
		}					
		return retval;
	}
}
/*******************************************************************/
function Hexcellent(aCellSize, aWidth, aHeight, aLeft, aTop) {
	//grid = new Array();
	var cellSize = aCellSize // The width of a single hexagonal cell
	var gridWidth = aWidth;
	var gridHeight = aHeight;
	var left = aLeft;
	var top = aTop;
	// Create a dummy hexagon to get offset-values for positioning
	var h = new Hexagon(cellSize, 0, 0);
	var horizOffset = cellSize*(3/4);
	var verticOffset = Math.sqrt(3)*cellSize/2;
	var evenLineOffset = h.getH()+h.getA();
	// Create the grid in memory
	//for(var i = 0; i < gridHeight; i++) {
	for(var i = 0; i < gridWidth; i++) {
		grid[i] = new Array();
		//for(var j = 0; j < gridWidth; j++) {
		for(var j = 0; j < gridHeight; j++) {
			if (i%2 == 0) { // Offset every other row to give tessallation

				grid[i][j] = new Hexagon(cellSize, (i*horizOffset)+left,(j*verticOffset)+top);
			} else {

				grid[i][j] = new Hexagon(cellSize, (i*horizOffset)+left,(j*verticOffset + verticOffset/2)+top);

			/*	grid[i][j] = new Hexagon(cellSize, (i*horizOffset+evenLineOffset)+left, ((j+1)*verticOffset)+top);
			} else {
				grid[i][j] = new Hexagon(cellSize, (i*horizOffset)+left, ((j+1)*verticOffset)+top);		*/
			}
		}
	}
	// Given a 2D drawing context on an HTML5 <canvas> tag, draw the grid
	this.draw = function(context) {
		//for(var i = 0; i < gridHeight; i++) {
		for(var i = 0; i < gridWidth; i++) {
			//for(var j = 0; j < gridWidth; j++) {
			for(var j = 0; j < gridHeight; j++) {
				grid[i][j].draw(context);
			}
		}
	}				
	// Find the cell containing point (u, v)
	this.findCell = function(u, v) {
		var retval = null;
		
		//for(var i = 0; i < gridHeight; i++) {
		for(var i = 0; i < gridWidth; i++) {
			//for(var j = 0; j < gridWidth; j++) {
			for(var j = 0; j < gridHeight; j++) {
				if (grid[i][j].contains(u, v))  {
					retval = grid[i][j];
					
					// Add grid coordinates of cell to returned object
					retval.gridX = i;
					retval.gridY = j;
				}
			}
		}					
		return retval;
	}

	this.neighbors = function(aQ,anR) {
		var q = aQ,
			r = anR,
			nQ,
			nR,
			parity,
			d,
			result,
			retArray = new Array();
		var neighbors = [
			[
				[+1,0],[+1,-1],[0,-1],[-1,-1],[-1,0],[0,+1]
			],
			[
				[+1,+1],[+1,0],[0,-1],[-1,0],[-1,+1],[0,+1]
			]
		];
		parity = q%2;

		for (i=0;i<6;i++) {
			d = neighbors[parity][i];
			nQ = q+d[0];
			nR = r+d[1];
			if (nQ>-1 && nQ<gridWidth && nR>-1 && nR<gridHeight) {
				result = grid[nQ][nR];
				if (result.obs != true) {
					result.gridX = nQ;
					result.gridY = nR;
					//console.log(nQ,nR);
					retArray.push(result);
				}			
			}
		}
		return retArray;
	}

	this.diagonals = function(aQ,anR) {
		var q = aQ,
			r = anR,
			nX,
			nY,
			nZ,
			nQ,
			nR,
			diagonals = [[+2,-1,-1],[+1,+1,-2],[-1,+2,-1],[-2,+1,+1],[-1,-1,+2],[+1,-2,+1]],
			d,
			result,
			convert,
			revert,
			retArray = new Array();

		convert = convert_to_cube(q,r);

		for (var i=0;i<6;i++) {
			d = diagonals[i];
			nX = convert[0] + d[0];
			nY = convert[1] + d[1];
			nZ = convert[2] + d[2];
			revert = convert_to_odd_q(nX,nY,nZ);
			nQ = revert[0];
			nR = revert[1];
			//console.log(nQ,nR);

			if (nQ>-1 && nQ<gridWidth && nR>-1 && nR<gridHeight) {
				result = grid[nQ][nR];
				if (!result.obs) {
					result.gridX = nQ;
					result.gridY = nR;
					retArray.push(result);
				}
			}
		}
		return retArray;
	}
}

function convert_to_cube(aQ,anR) {
	var x = aQ;
	var z = anR - (aQ - (aQ%2))/2;
	var y = -x - z;
	var result = [x,y,z];
	return result;
}

function convert_to_odd_q(anX,aY,aZ) {
	var q = anX;
	var r = aZ + (anX - (anX%2))/2;
	var result = [q,r];
	return result;
}
