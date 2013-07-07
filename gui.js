
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
			modals: [],
			
			canvas: document.createElement("canvas"),
			drawM: function(ctx){
				ctx.save();
				
				var b = 5, th = (_gui==gui?20:16);
				ctx.fillStyle="rgba(0,0,0,1)";
				ctx.fillRect(this.x,this.y-th,this.w,this.h+th);
				ctx.strokeStyle="rgba(255,255,255,0.6)";
				ctx.strokeRect(this.x-b,this.y-th-b,this.w+b+b,this.h+th+b+b);
				
				ctx.font = th-2+"px Arial";
				ctx.textBaseline = "bottom";
				ctx.fillStyle="rgba(255,255,255,0.6)";
				ctx.fillText(this.title,this.x,this.y-3);
				
				if(this.canvas.width!=this.w)this.canvas.width=this.w;
				if(this.canvas.height!=this.h)this.canvas.height=this.h;
				ctx.save();
				this.draw();
				ctx.restore();
				for(var i=0;i<this.modals.length;i++){
					var m=this.modals[i];
					m.mouse={
						x: this.mouse.x-m.x,
						y: this.mouse.y-m.y,
						d: this.mouse.d,
						prev: {
							x: m.mouse.x,
							y: m.mouse.y,
							prev: {
								x: m.mouse.prev.x,
								y: m.mouse.prev.y,
							}
						}
					};
					m.drawM(this.ctx);
					m.mouse.leftClicked=false;
				}
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
			close: function(force){
				if(!force){
					if(this.onbeforeunload){
						if(!this.onbeforeunload()){
							return;
						}
					}
				}
				if(!this.parent.modals)throw new Error("PARENT HATH NO MODALS");
				this.parent.modals.splice(this.parent.modals.indexOf(this),1);
			},
			onbeforeclose: null,
		};
		m.mouse={x:-1,y:-1};
		m.mouse.prev={x:-1,y:-1};
		m.mouse.prev.prev={x:-1,y:-1};
		m.ctx = m.canvas.getContext("2d");
		m.ctx.mozImageSmoothingEnabled=false;
		m.ctx.webkitImageSmoothingEnabled=false;
		
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
			m.mouse={
				x: gui.mouse.x-m.x,
				y: gui.mouse.y-m.y,
				left: gui.mouse.left,
				leftClicked: gui.mouse.leftClicked,
				prev: {
					x: m.mouse.x,
					y: m.mouse.y,
					prev: {
						x: m.mouse.prev.x,
						y: m.mouse.prev.y,
					}
				}
			};
			var mom = m.mouse.x>0 && m.mouse.y>0 && m.mouse.x<m.w && m.mouse.y>m.h;
			m.mouse.leftClicked &= mom;
			//gui.mouse.leftClicked &= !mom;
			m.drawM(ctx);
		}
	};
	gui.mouse={x:-1,y:-1,left:0,leftClicked:0};
	gui.mouse.prev={x:-1,y:-1,left:0,leftClicked:0};
	gui.mouse.prev.prev={x:-1,y:-1,left:0,leftClicked:0};
	addEventListener("mousemove",function(e){
		gui.mouse.x=e.clientX;
		gui.mouse.y=e.clientY;
	});
	addEventListener("mousedown",function(e){
		gui.mouse.leftClicked=1;
		gui.mouse.left=1;
	});
	addEventListener("mouseup",function(e){
		gui.mouse.leftClicked=0;
		gui.mouse.left=0;
	});
};


