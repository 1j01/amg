
// Contains rooms.
// #persistant
Universe = function(mainctx){
	var u=this;
	u.rooms = {};
	u.addRoom = function(room){
		u.rooms[room.name] = room;
		room.redraw();
	};
	u.getState = function(){
		//serialize
		var s = '{"rooms":{';
		for(var i in u.rooms){
			var r=u.rooms[i];
			s += '"'+i.replace(/"/,"\\\"")+'":{';
				
			s += '}';
		}
		s += "}}";
		return s;
	};
	var pat=document.createElement("canvas");
	pat.width=TS;
	pat.height=TS;
	
	var patctx=pat.getContext("2d");
	patctx.fillStyle="#222";
	patctx.fillRect(0,0,TS,TS);
	patctx.fillStyle="#555";
	patctx.fillRect(TS/2,TS/2,2,2);
	u.pat=mainctx.createPattern(pat,"repeat");
	
	u.update=function(){
		mainctx.beginPath();
		mainctx.rect(0,0,mainctx.canvas.width,mainctx.canvas.height);
		mainctx.fillStyle=u.pat;
		mainctx.fill();
		mainctx.save();
		
		for(var name in u.rooms){
			var room=u.rooms[name];
			mainctx.save();
			mainctx.translate(room.x*TS,room.y*TS);
			room.draw(mainctx);
			mainctx.restore();
		}
		mainctx.restore();
	};
};
