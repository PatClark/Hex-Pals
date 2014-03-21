var move_count = 2;

function write_report(c,msg) {
	cxt.clearRect(160,0,150,20);
	cxt.fillStyle="black";
	cxt.fillText(msg,165,17);
}

function guy(aSize,anX,aY) {
	var newGuy = new Array();
		//theX = anX + 25;
	newGuy = new Hexagon(aSize,anX,aY);
	thatOneGuy.push(newGuy);
	cxt.fillStyle = "red";
	thatOneGuy[0].draw(cxt);

	var result = field.findCell(anX,aY);

	thatOneGuy[0].grid=[result.gridX,result.gridY];
	result.has_guy = 1;
}

function guy2(aSize,anX,aY) {
	var newGuy = new Array();
		//theX = anX + 25;
	newGuy = new Hexagon(aSize,anX,aY);
	thatOneGuy.push(newGuy);
	cxt.fillStyle = "purple";
	thatOneGuy[1].draw(cxt);

	var result = field.findCell(anX,aY);

	thatOneGuy[1].grid=[result.gridX,result.gridY];
	result.has_guy = 2;
}

function moveGuy(e) {
	var x = e.pageX-5,
		y = e.pageY-5,
		index = activeGuy-1,
		msg;

	var pc = thatOneGuy[index];
	if (index == 0) {var color = "red";}
	if (index == 1) {var color = "purple";}

	var result = field.findCell(x,y);
	if (result != null && !result.obs) {
		if (typeof result.has_guy != "number") {
			var newX = result.getX() + result.getA(),
				newY = result.getY();

			byeOldGuy(index);

			pc.setX(newX),
			pc.setY(newY);

			cxt.fillStyle = color;
			pc.draw(cxt);

			pc.grid=[result.gridX,result.gridY];
			result.has_guy = index+1;
			move_count--;
			//console.log("move_count = " + move_count);
			msg = "Moves until enemy turn: " + move_count;
			write_report(c,msg);

			var num_foes = thatBadGuy.length;
			var dead = -1;
			for (i=0;i<num_foes;i++) {
				if (pc.grid[0] == thatBadGuy[i].grid[0] && pc.grid[1] == thatBadGuy[i].grid[1]) {
					dead = i;
				}
			}
			if (dead > -1) {
				thatBadGuy.splice(dead,1);
				result.has_foe = false;
			}
			if (move_count <= 0) {
				foeMove();
				move_count = 2;
			}
		} else if (result.has_guy != index+1) {
			activeGuy = result.has_guy;
			whoIsGuy();
		} else {

		}
	}
}

function byeOldGuy(index) {
	var oldX = thatOneGuy[index].getX(),
		oldY = thatOneGuy[index].getY();

	cxt.fillStyle = "#fff";
	cxt.strokeStyle = "#000";
	cxt.lineWidth = 1;

	var was = field.findCell(oldX,oldY);
	was.draw(cxt);
	was.has_guy = false;
}

function whoIsGuy() {
	if (activeGuy == 1) {var color = "red"} else {if (activeGuy == 2) {var color = "purple";}}
	console.log("Active Guy is " + color);
}
