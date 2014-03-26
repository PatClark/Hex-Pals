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
	thatOneGuy[0].spec_atk = [];
	thatOneGuy[0].color = "red";
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
	thatOneGuy[1].spec_atk = [];
	thatOneGuy[1].color = "purple";
	result.has_guy = 2;
}

function moveGuy(e) {
	var x = e.pageX-5,
		y = e.pageY-5,
		a = activeGuy-1,
		msg;

	var pc = thatOneGuy[a];

	var result = field.findCell(x,y);
	if (result != null && !result.obs) {
		if (typeof result.has_guy != "number") {
			var newX = result.getX() + result.getA(),
				newY = result.getY();

			byeOldGuy(a);

			pc.setX(newX),
			pc.setY(newY);

			cxt.fillStyle = pc.color;
			pc.draw(cxt);

			pc.grid=[result.gridX,result.gridY];
			result.has_guy = a+1;

			/*move_count_down();

			enemy_cleanup();

			if (move_count <= 0) {
				foeMove();
				move_count = 2;
			}*/
		} else if (result.has_guy != a+1) {
			activeGuy = result.has_guy;
			whoIsGuy();
		} else {

		}
	}
}

function move_count_down(aNum) {
	if (aNum == null) {
		var num = 1;
	} else {
		var num = aNum;
	}
	move_count = move_count-num;
	var msg = "Moves until enemy turn: " + move_count;
	write_report(c,msg);
}

function enemy_cleanup() {
	var a = activeGuy-1,
		n = inactiveGuy-1,
		num_foes = thatBadGuy.length,
		dead = -1,
		bX,
		bY;
	for (var i=0;i<num_foes;i++) {
		if (thatOneGuy[a].grid[0] == thatBadGuy[i].grid[0] && thatOneGuy[a].grid[1] == thatBadGuy[i].grid[1]) {
			dead = i;
		}
	}
	if (dead > -1) {
		bX = thatBadGuy[dead].grid[0];
		bY = thatBadGuy[dead].grid[1];
		thatBadGuy.splice(dead,1);
		grid[bX][bY].has_foe = 0;
	}
	num_foes = thatBadGuy.length;
	dead = -1;
	for (var i=0;i<num_foes;i++) {
		if (thatOneGuy[n].grid[0] == thatBadGuy[i].grid[0] && thatOneGuy[n].grid[1] == thatBadGuy[i].grid[1]) {
			dead = i;
		}
	}
	if (dead > -1) {
		bX = thatBadGuy[dead].grid[0];
		bY = thatBadGuy[dead].grid[1];
		thatBadGuy.splice(dead,1);
		grid[bX][bY].has_foe = 0;
	}	
}

function special_atk(e) {
	var x = e.pageX-5,
		y = e.pageY-5,
		a = activeGuy-1,
		n = inactiveGuy-1,
		newX,
		newY,
		msg;
	var pc = thatOneGuy[a].spec_atk;
	var result = field.findCell(x,y);
	if (result != null && !result.obs) {
		for (var i=0;i<pc.length;i++) {
			if (pc[i].gridX == result.gridX && pc[i].gridY == result.gridY) {
				console.log("SPECIAL ATTACK ACTIVATED!");

				// moves inactive guy
				newX = result.getX() + result.getA(),
				newY = result.getY();
				byeOldGuy(n);
				thatOneGuy[n].setX(newX);
				thatOneGuy[n].setY(newY);

				if (n == 0) {var color = "red";}
				if (n == 1) {var color = "purple";}

				cxt.fillStyle = color;
				thatOneGuy[n].draw(cxt);

				thatOneGuy[n].grid=[result.gridX,result.gridY];
				result.has_guy = n+1;
				//move_count_down();
				//enemy_cleanup();

				thatOneGuy[a].spec_atk = [];
				buttonSelect(moveGuy);
			}
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
	if (activeGuy == 1) {
		inactiveGuy = 2;
	} else if (activeGuy == 2) {
			inactiveGuy = 1;
		}
	var color = thatOneGuy[activeGuy-1].color
	console.log("Active Guy is " + color);
}
