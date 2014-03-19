function foe(aSize,anX,aY) {
	var newFoe = new Array();
	newFoe = new Hexagon(aSize,anX,aY);
	thatBadGuy.push(newFoe);
	cxt.fillStyle = "yellow";
	thatBadGuy[thatBadGuy.length-1].draw(cxt);
}

function makeFoe(e) {
	var x = e.pageX-5,
		y = e.pageY-5;

	var result = field.findCell(x,y);
	if (result != null && result.obs != true) {
		var newX = result.getX() + result.getA(),
			newY = result.getY(),
			newSize = result.getSize()/2;

		foe(newSize,newX,newY);
		thatBadGuy[thatBadGuy.length-1].grid=[result.gridX,result.gridY];
		result.has_foe = true;
	}
}

function pcgFoe(num) {
	for (i=0;i<num;i++) {
		var x = Math.floor(Math.random()*grid.x);
		var y = Math.floor(Math.random()*grid.y);
		var result = grid[x][y];

		if (result != null && 
			result != grid[0][0] && 
			result != grid[0][1] && 
			result != grid[1][0] && 
			!result.obs && 
			!result.has_foe) {

			var newX = result.getX() + result.getA(),
				newY = result.getY(),
				newSize = result.getSize()/2;

			result.gridX = x,
			result.gridY = y;

			foe(newSize,newX,newY);
			thatBadGuy[thatBadGuy.length-1].grid=[result.gridX,result.gridY];
			result.has_foe = true;
		} else {i--;}
	}
}

function foeMove() {
	// move one hex closer to PC
	if (thatBadGuy.length > 0) {
		for (i=0;i<thatBadGuy.length;i++) {
			var badguy = thatBadGuy[i]
			var result1 = hex_distance(badguy.grid[0],badguy.grid[1],thatOneGuy[0].grid[0],thatOneGuy[0].grid[1]);
			var result2 = hex_distance(badguy.grid[0],badguy.grid[1],thatOneGuy[1].grid[0],thatOneGuy[1].grid[1]);
			if (result1 == result2) {
				var tgt = Math.random();
				if (tgt < .5) {tgt = 0;} else {tgt = 1;}
			}
			if (result1 < result2) {tgt = 0;} else {tgt = 1;}

			var result = path(badguy.grid[0],badguy.grid[1],thatOneGuy[tgt].grid[0],thatOneGuy[tgt].grid[1]);

			if (result != false) {
				//console.log(result);
				var newX = result.getX() + result.getA(),
					newY = result.getY();

				byeOldFoe(i);

				badguy.setX(newX),
				badguy.setY(newY);

				cxt.fillStyle = "yellow";
				badguy.draw(cxt);

				badguy.grid=[result.gridX,result.gridY]
				result.has_foe = true;
			}
		}
	}
}

function byeOldFoe(index) {
	var oldX = thatBadGuy[index].getX();
	var oldY = thatBadGuy[index].getY();

	cxt.fillStyle = "#fff";
	cxt.strokeStyle = "#000";
	cxt.lineWidth = 1;

	var was = field.findCell(oldX,oldY);
	was.draw(cxt);
	was.has_foe = false;
}
