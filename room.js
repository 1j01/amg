
Room = function(name, w,h, aa){
	const TS = 16;
	
	this.name = name;
	this.canvas = document.createElement("canvas");
	this.ctx = this.canvas.getContext("2d");
	this.width = w;
	this.height = h;
	this.rows = [];
	for(var i=0;i<this.height;i++){
		var row=[];
		for(var j=0;j<this.width;j++){
			row.push({});
		}
		this.rows.push(row);
	}
	
	this.redraw = function(){
		this.redrawRegion(0,0,this.width,this.height);
	};
	this.redrawRegion = function(x,y,w,h){
		this.ctx.clearRect(x*TS,y*TS,w*TS,h*TS);
		for(var xi=x;xi<xi+w;xi++){
			for(var yi=y;yi<yi+h;yi++){
				var b=this.rows[yi][xi];
				if(!b){
					this.ctx.fillStyle="rgba(255,255,255,"+Math.random()+")";
					this.ctx.fillRect(xi*TS+TS/4,yi*TS/4,TS/2,TS/2);
					continue;
				}
				this.ctx.drawImage(b.sprite);
			}
		}
	};
};
