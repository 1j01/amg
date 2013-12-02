
// Contains rooms.
// #persistant
Universe = function(mainctx){
	var u=this;
	u.rooms = {};
	u.active = null;
	u.addRoom = function(room){
		u.rooms[room.name] = room;
		//room.redraw();
		if(!u.active){
			u.active = room;
		}
	};
	/*u.getState = function(){
		//serialize
		var s = '{"rooms":{';
		for(var i in u.rooms){
			var r=u.rooms[i];
			s += '"'+i.replace(/"/,"\\\"")+'":{';
				
			s += '}';
		}
		s += "}}";
		return s;
	};*/
	var patcanvas=document.createElement("canvas");
	patcanvas.width=TS;
	patcanvas.height=TS;
	
	var patctx=patcanvas.getContext("2d");
	patctx.fillStyle="#222";
	patctx.fillRect(0,0,TS,TS);
	patctx.fillStyle="#555";
	patctx.fillRect(TS/2,TS/2,2,2);
	var pat=mainctx.createPattern(patcanvas,"repeat");
	
	u.update=function(){
		//draw backgrund
		//mainctx.beginPath();
		//mainctx.rect(0,0,mainctx.canvas.width,mainctx.canvas.height);
		//mainctx.fillStyle=pat;
		//mainctx.fill();
		mainctx.fillStyle = "#000";
		mainctx.fillRect(0,0,mainctx.canvas.width,mainctx.canvas.height);
		
		//draw stars!
		/*mainctx.fillStyle = "#AAA";
		for(var i=0;i<50;i++){
			mainctx.fillRect(Math.random()*mainctx.canvas.width,Math.random()*mainctx.canvas.height,2,2);
		}*/
		
		//draw rooms
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
