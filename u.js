
// Contains rooms.
// #persistant
Universe = function(mainctx){
	var u=this;
	u.rooms = {};
	u.addRoom = function(room){
		u.rooms[room.name] = room;
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
	pat.width=16;
	pat.height=16;
	
	var patctx=pat.getContext("2d");
	patctx.fillStyle="#222";
	patctx.fillRect(0,0,16,16);
	patctx.fillStyle="#555";
	patctx.fillRect(8,8,1,1);
	u.pat=mainctx.createPattern(pat,"repeat");
	
	u.update=function(){
		mainctx.beginPath();
		mainctx.rect(0,0,mainctx.canvas.width,mainctx.canvas.height);
		mainctx.fillStyle=u.pat;
		mainctx.fill();
		
		
	};
};
