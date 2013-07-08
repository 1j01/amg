
// Contains rooms.
Universe = function(){
	this.rooms = {};
	this.addRoom = function(room){
		this.rooms[room.name] = room;
	};
	this.getState = function(){
		var s = '{"rooms":{';
		for(var i in this.rooms){
			var r=this.rooms[i];
			s += '"'+i.replace(/"/,"\\\"")+'":{';
				
			s += '}';
		}
		s += "}}";
		return s;
	};
};
