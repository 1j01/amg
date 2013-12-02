
// #persistant
LevelEditor = function(u, mainctx){
	var le=this;
	var canvas = mainctx.canvas;
	le.selected = null;
	
	var mouseDown = false;
	var mx, my;
	var pmx, pmy;
	le.update = function(editing){
		//do something probably
		if(mouseDown){
			if(le.selected){
				for(var name in u.rooms){
					var room = u.rooms[name];
					var rmx = mx - room.x;
					var rmy = my - room.y;
					if(rmx>=0 && rmy>=0 && rmx<room.width && rmy<room.height){
						room.rows[rmy][rmx] = le.selected;
						return;
					}
				}
			}
		}
	};
	
	canvas.addEventListener("mousemove",function(e){
		mx = Math.floor(e.clientX / TS);
		my = Math.floor(e.clientY / TS);
	});
	canvas.addEventListener("mousedown",function(e){
		mx = Math.floor(e.clientX / TS);
		my = Math.floor(e.clientY / TS);
		
		mouseDown = true;
	});
	addEventListener("mouseup",function(e){
		mouseDown = false;
	});
	
};
