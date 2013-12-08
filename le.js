
// #persistant
LevelEditor = function(u, mainctx){
	var le = this;
	var canvas = mainctx.canvas;
	le.selected = null;
	
	var mouseDown = [false, false, false];
	var mx, my;
	var pmx, pmy;
	
	var offset_mode_modifier = "ctrl";
	var offset_mode_button = false;
	var offset_mode_started = false;
	var offset_start_mx, offset_start_my;
	
	var currentTile;
	le.update = function(editing){
		//hey it does something probably
		if(le.selected && mouseDown[0]){
			if(offset_mode_button){
				currentTile = {
					//offset_mx = mx - offset_start_mx
					spriteX:le.selected.spriteX+mx-offset_start_mx,
					spriteY:le.selected.spriteY+my-offset_start_my,
					sprite:le.selected.sprite
				};
				var img = aa.getImage(currentTile.sprite);
				if(currentTile.spriteX < 0
				|| currentTile.spriteY < 0
				|| currentTile.spriteX >= (img.width/TS)
				|| currentTile.spriteY >= (img.height/TS)){
					currentTile = null;
				}
			} else {
				currentTile = le.selected;
			}
			draw(currentTile);
		}else if(mouseDown[2]){
			draw(null)
		}
		if(offset_mode_button){
			//preview palette
			mainctx.globalAlpha = 0.2;
			mainctx.drawImage(
				aa.getImage(le.selected.sprite),
				TS*((offset_mode_started? offset_start_mx :mx) - le.selected.spriteX),
				TS*((offset_mode_started? offset_start_my :my) - le.selected.spriteY)
			);
			mainctx.globalAlpha = 1;
		}
		function draw(block){
			for(var name in u.rooms){
				var room = u.rooms[name];
				var rmx = mx - room.x;
				var rmy = my - room.y;
				if(rmx>=0 && rmy>=0 && rmx<room.width && rmy<room.height){
					room.rows[rmy][rmx] = block;//@TODO #BUG implement copyof operator
					return;
				}
			}
		}
	};
	
	canvas.addEventListener("mousemove",function(e){
		mx = Math.floor(e.clientX / TS);
		my = Math.floor(e.clientY / TS);
	});
	addEventListener("keyup", function(e){
		if(!e[offset_mode_modifier+"Key"]){
			offset_mode_button = false;
			offset_mode_started = false;
		}
	});
	addEventListener("keydown", function(e){
		if(e[offset_mode_modifier+"Key"]){
			offset_mode_button = true;
		}
	});
	canvas.addEventListener("mousedown",function(e){
		mx = Math.floor(e.clientX / TS);
		my = Math.floor(e.clientY / TS);
		if(offset_mode_button && !offset_mode_started){
			offset_start_mx = mx;
			offset_start_my = my;
			offset_mode_started = true;
		}
		mouseDown[e.button] = true;
	});
	addEventListener("mouseup",function(e){
		mouseDown[e.button] = false;
	});
	
};
