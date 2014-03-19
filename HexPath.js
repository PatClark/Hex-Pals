/**************************PATHFINDING******************************/	
/****based on http://www.vanreijmersdal.nl/54/hexagon-pathfinding***/

// function found on developerfusion.com
function MultiDimensionalArray(iRows,iCols) {
	var i;
	var j;
	var a = new Array(iRows);
	for (i=0;i<iRows;i++) {
		a[i] = new Array(iCols);
		for (j=0;j<iCols;j++) {
			a[i][j] = "";
		}
	}
	return(a);
}

function hex_accessible(x,y) {
	if(grid[x] == undefined) return false;
	if(grid[x][y] == undefined) return false;
	if(grid[x][y].obs == true) return false;
	if(grid[x][y].has_foe == true) return false;

	return true;
}

function hex_distance(x1,y1,x2,y2) {
	dx = Math.abs(x1-x2);
	dy = Math.abs(y1-y2);
	return Math.sqrt((dx*dx) + (dy*dy));
}

// A* Pathfinding with Manhattan Heuristics for Hexagons.
function path(start_x,start_y,end_x,end_y,show) {
	// Check cases path is impossible from the start.
	var error = 0;
	if (start_x == end_x && start_y == end_y) error=1;
	//if (!hex_accessible(start_x,start_y)) error=1;
	if (!hex_accessible(end_x,end_y)) error=1;
	if(error==1) {
		//alert('Path is impossible to create.');
		return false;
	}

	// Init
	var openlist = new Array(grid.x*grid.y+2);
	var openlist_x = new Array(grid.x);
	var openlist_y = new Array(grid.y);
	var statelist = MultiDimensionalArray(grid.x+1,grid.y+1); // current open or closed state
	var openlist_g = MultiDimensionalArray(grid.x+1,grid.y+1);
	var openlist_f = MultiDimensionalArray(grid.x+1,grid.y+1);
	var openlist_h = MultiDimensionalArray(grid.x+1,grid.y+1);
	var parent_x = MultiDimensionalArray(grid.x+1,grid.y+1);
	var parent_y = MultiDimensionalArray(grid.x+1,grid.y+1);
	var path = MultiDimensionalArray(grid.x*grid.y+2,2);

	var select_x = 0;
	var select_y = 0;
	var node_x = 0;
	var node_y = 0;
	var counter = 1; // openlist_ID counter
	var selected_id = 0; // actual openlist ID

	var neighbors = [
		[
			[+1,0],[+1,-1],[0,-1],[-1,-1],[-1,0],[0,+1]
		],
		[
			[+1,+1],[+1,0],[0,-1],[-1,0],[-1,+1],[0,+1]
		]
	];
	var parity;

	// Add start coordinates to openlist
	openlist[1] = true;
	openlist_x[1] = start_x;
	openlist_y[1] = start_y;
	openlist_f[start_x][start_y] = 0;
	openlist_h[start_x][start_y] = 0;
	openlist_g[start_x][start_y] = 0;
	statelist[start_x][start_y]= true;

	// Try to find the path until the target coordinate is found
	while (statelist[end_x][end_y] != true) {
		set_first = true;
		// Find lowest F in openlist
		for (var i in openlist) {
			if(openlist[i] == true) {
				select_x = openlist_x[i];
				select_y = openlist_y[i];
				if(set_first == true) {
					lowest_found = openlist_f[select_x][select_y];
					set_first = false;
				}
				if (openlist_f[select_x][select_y]<=lowest_found) {
					lowest_found = openlist_f[select_x][select_y];
					lowest_x = openlist_x[i];
					lowest_y = openlist_y[i];
					selected_id = i;
				}	
			}
		}
		if(set_first==true) {
			// openlist is empty
			//alert('No possible route can be found.');
			return false;
		}
		// add lowest F as closed to the statelist and remove from openlist
		statelist[lowest_x][lowest_y] = 2;
		openlist[selected_id] = false;


		parity = lowest_x%2;
		// add connected nodes to the openlist
		for(i=0;i<6;i++) {
			// run node update for 6 neighboring tiles
			node_x = lowest_x + neighbors[parity][i][0];
			node_y = lowest_y + neighbors[parity][i][1];
			
			if (hex_accessible([node_x],[node_y])) {
				if(statelist[node_x][node_y] == true) {
					if(openlist_g[node_x][node_y] < openlist_g[lowest_x][lowest_y]) {
						parent_x[lowest_x][lowest_y] = node_x;
						parent_y[lowest_x][lowest_y] = node_y;
						openlist_g[lowest_x][lowest_y] = openlist_g[node_x][node_y] + 10;
						openlist_f[lowest_x][lowest_y] = openlist_g[lowest_x][lowest_y] + openlist_h[lowest_x][lowest_y];
					}
				} else if(statelist[node_x][node_y] == 2) {
					// it's on closed list do nothing
				} else {
					counter++;
					// add to openlist
					openlist[counter] = true;
					openlist_x[counter] = node_x;
					openlist_y[counter] = node_y;
					statelist[node_x][node_y] = true;
					// set parent
					parent_x[node_x][node_y] = lowest_x;
					parent_y[node_x][node_y] = lowest_y;
					// update h, g, and f
					var ydist = end_y - node_y;
					if (ydist<0) ydist = ydist*-1;
					var xdist = end_x - node_x;
					if (xdist<0) xdist = xdist*-1;
					openlist_h[node_x][node_y] = hex_distance(node_x,node_y,end_x,end_y) * 10;
					openlist_g[node_x][node_y] = openlist_g[lowest_x][lowest_y] + 10;
					openlist_f[node_x][node_y] = openlist_g[node_x][node_y] + openlist_h[node_x][node_y];
				}
			}
		}
	}
	// get path
	temp_x=end_x;
	temp_y=end_y;
	counter=0;
	while(temp_x != start_x || temp_y != start_y) {
		counter++;
		path[counter][1] = temp_x;
		path[counter][2] = temp_y;
		temp_x = parent_x[path[counter][1]][path[counter][2]];
		temp_y = parent_y[path[counter][1]][path[counter][2]];
	}
	counter++;
	path[counter][1] = start_x;
	path[counter][2] = start_y;
	step_one=counter-1;

	// draw path
	if (show != null) {
		cxt.fillStyle = "orange";
		while (counter != 0) {
			grid[path[counter][1]][path[counter][2]].draw(cxt);
			counter--;
		}
	} else {
		var retval = null;
		retval = grid[path[step_one][1]][path[step_one][2]];
		retval.gridX = path[step_one][1];
		retval.gridY = path[step_one][2];
		return retval;
	}
}
