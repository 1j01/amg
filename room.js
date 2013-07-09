
Room = function(name, w,h){
	this.name = name;
	this.canvas = document.createElement("canvas");
	this.ctx = this.canvas.getContext("2d");
	this.width = w;
	this.height = h;
	this.rows = [];
	for(var i=0;i<this.height;i++){
		var row=[];
		for(var j=0;j<this.width;j++){
			row.push({type:""});
		}
		this.rows.push(row);
	}
};
