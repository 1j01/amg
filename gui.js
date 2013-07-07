
GUI = function(){
	var gui = this;
	gui.modals = [];
	gui.M = function(o, _gui){
		_gui = _gui || gui;
		var m = {
			x: 90,
			y: 90,
			w: 200,
			h: 200,
			title: "Modal",
			
			parent: _gui,
			modals:[],
			
			canvas: document.createElement("canvas"),
			drawM: function(ctx){
				ctx.save();
				
				var b = 5, th = 20;
				ctx.fillStyle="rgba(0,0,0,0.6)";
				ctx.fillRect(this.x,this.y-th,this.w,this.h+th);
				ctx.strokeStyle="rgba(255,255,255,0.6)";
				ctx.strokeRect(this.x-b,this.y-th-b,this.w+b+b,this.h+th+b+b);
				
				ctx.font = "20pt Arial";
				ctx.textBaseline = "bottom";
				ctx.fillStyle="rgba(255,255,255,0.6)";
				ctx.fillText(this.title,0,0);
				
				if(this.canvas.width!=this.w)this.canvas.width=this.w;
				if(this.canvas.height!=this.h)this.canvas.height=this.h;
				this.draw();
				ctx.drawImage(this.canvas,this.x,this.y);
				
				ctx.restore();
			},
			draw: function(){
				var x=this.ctx;
				x.clearRect(0,0,this.w,this.h);
				x.fillStyle="rgba(255,255,0,"+Math.sin(this.x/50)+")";
				x.fillRect(50,50,50,50);
				x.fillRect(0,0,50,50);
			},
			close: function(){
				if(!this.parent.modals)throw new Error("PARENT HATH NO MODALS");
				this.parent.modals.splice(this.parent.modals.indexOf(this),1);
			},
		};
		m.ctx = m.canvas.getContext("2d");
		if(o instanceof String){
			m.title=o;
		}else if(o instanceof Object){
			for(var i in o){
				m[i]=o[i];
			}
		}
		_gui.modals.push(m);
		return m;
	};
	gui.draw = function(ctx){
		for(var i=0;i<gui.modals.length;i++){
			var m=gui.modals[i];
			m.drawM(ctx);
		}
	};
};


