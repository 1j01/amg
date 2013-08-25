
Room = function(name, x,y,w,h, aa){
	var r=this;
	
	r.name = name;
	r.canvas = document.createElement("canvas");
	r.ctx = r.canvas.getContext("2d");
	r.gcanvas = document.createElement("canvas");
	r.gctx = r.gcanvas.getContext("2d");
	r.x = x;
	r.y = y;
	r.width = w;
	r.height = h;
	resizeCanvas();
	
	r.rows = [];
	for(var i=0;i<=r.height;i++){
		var row=[];
		for(var j=0;j<=r.width;j++){
			row.push(0);
		}
		r.rows.push(row);
	}
	///console.log(r.rows);
	function resizeCanvas(){
		r.canvas.width = r.width * TS;
		r.canvas.height = r.height * TS;
		r.gcanvas.width = r.width * TS;
		r.gcanvas.height = r.height * TS;
	}
	r.redraw = function(){
		r.redrawRegion(0,0,r.width,r.height);
	};
	r.redrawRegion = function(x,y,w,h){
		r.gctx.clearRect(x*TS,y*TS,w*TS,h*TS);
		for(var xi=x;xi<x+w;xi++){
			for(var yi=y;yi<y+h;yi++){
				//console.log(r.rows[yi],yi);
				var b=r.rows[yi][xi];
				if(!b){
					r.gctx.fillStyle="rgba(9,55,55,"+Math.random()+")";
					r.gctx.fillRect(xi*TS+TS/4,yi*TS+TS/4,TS/2,TS/2);
				}else{
					r.gctx.drawImage(aa.getImage(b.sprite),b.spriteX*TS,b.spriteY*TS,TS,TS,xi*TS,yi*TS,TS,TS);
				}
			}
		}
	};
	r.draw = function(ctx){
		ctx.fillStyle="#222";
		ctx.fillRect(0,0,r.width*TS,r.height*TS);
		ctx.drawImage(r.gcanvas,0,0);
	};
};
