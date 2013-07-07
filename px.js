
// It's a pixel editor.
PixelEditor = function(img, gui){
	var ed = this;
	ed.tilesetmode = false;
	ed.tool = "paint";
	ed.color = "rgb(203,219,252)";
	ed.canvas = document.createElement("canvas");
	
	if(!img){
		ed.img = document.createElement("img");
		ed.img.width = 128;
		ed.img.height = 128;
	}else{
		ed.img = img;
	}
	ed.canvas.width = ed.img.width;
	ed.canvas.height = ed.img.height;
	ed.view = {
		scale: 2,
		x: ed.canvas.width/2,
		y: ed.canvas.height/2,
	};
	ed.show = function(){
		ed.m = ed.m || gui.M({
			title: "Pixel Editor",
			resizable: true,
			x: 20, y: 50,
			w: 128*4+40, h: 128*4+40,
			/*onbeforeunload: function(){
				
			},*/
			draw: function(){
				var x=ed.canvas.getContext("2d");
				if(ed.tool==="paint"){
					if(ed.m.mouse.left){
						x.beginPath();
						var mx1=cx(ed.m.mouse.prev.x),my1=cy(ed.m.mouse.prev.y);
						var mx2=cx(ed.m.mouse.x),my2=cy(ed.m.mouse.y);
						console.log(mx2,my2);
						//var seded=
						x.moveTo(mx1,my1);
						x.lineTo(mx2,my2);
						x.lineWidth=1;
						x.strokeStyle=ed.color;
						x.stroke();
					}
				}
				function cx(mx){
					//return (mx+ed.m.w)/ed.view.scale-ed.view.x;
					return (mx-ed.m.w/4)/ed.view.scale;
					//return (mx-ed.m.w+ed.view.x/4)/ed.view.scale;
				}
				function cy(my){
					//return (my+ed.m.h)/ed.view.scale-ed.view.y;
					return (my-ed.m.h/4)/ed.view.scale;
					//return (my-ed.m.h+ed.view.y/4)/ed.view.scale;
				}
				
				x=this.ctx;
				x.save();
				x.clearRect(0,0,this.w,this.h);
				x.fillStyle="rgba(255,255,255,0.1)";
				x.fillRect(0,0,this.w,this.h);
				x.fillStyle="#rgba(255,255,255,1)";
				x.textBaseline="bottom";
				x.textAlign="right";
				x.fillText(ed.view.scale*100+"%",ed.m.w,ed.m.h);
				x.translate(ed.m.w/2,ed.m.h/2);
				x.scale(ed.view.scale, ed.view.scale);
				x.translate(-ed.view.x,-ed.view.y);
				x.strokeStyle="rgba(255,255,255,0.2)";
				x.strokeRect(-2,-2,ed.canvas.width+4,ed.canvas.height+4);
				x.drawImage(ed.canvas,0,0);
				x.restore();
				
			},
		});
		ed.tb=gui.M({
			title:"Tools",
			x:90,y:30,
			w:50,
			h:200,
			tools:[
				"paint",
				"fill",
				"select",
			],
			draw:function(){
				var x=this.ctx;
				x.clearRect(0,0,this.w,this.h);
				for(var i=0;i<this.tools.length;i++){
					var t=this.tools[i];
					x.beginPath();
					x.rect(0,i*20,50,18);
					if(ed.tool==t){
						x.fillStyle="#F0F";
					}else if(x.isPointInPath(this.mouse.x,this.mouse.y)){
						x.fillStyle="#555";
						if(ed.tb.mouse.leftClicked){
							ed.tool=t;
						}
					}else{
						x.fillStyle="#000";
					}
					x.fill();
					x.fillStyle="#FFF";
					x.textBaseline="top";
					x.fillText(t,0,i*20);
				}
			}
		}, ed.m);
		ed.pal=gui.M({
			title:"Palette",
			x:5,y:30,
			w:70,
			h:200,
			colors:[
				"rgb(0,0,0)",
				"rgb(34,32,52)",
				"rgb(69,40,60)",
				"rgb(102,57,49)",
				"rgb(143,86,59)",
				"rgb(223,113,38)",
				"rgb(217,160,102)",
				"rgb(238,195,154)",
				"rgb(251,242,54)",
				"rgb(153,229,80)",
				"rgb(106,190,48)",
				"rgb(55,148,110)",
				"rgb(75,105,47)",
				"rgb(82,75,36)",
				"rgb(50,60,57)",
				"rgb(63,63,116)",
				"rgb(48,96,130)",
				"rgb(91,110,225)",
				"rgb(99,155,255)",
				"rgb(95,205,228)",
				"rgb(203,219,252)",
				"rgb(255,255,255)",
				"rgb(155,173,183)",
				"rgb(132,126,135)",
				"rgb(105,106,106)",
				"rgb(89,86,82)",
				"rgb(118,66,138)",
				"rgb(172,50,50)",
				"rgb(217,87,99)",
				"rgb(215,123,186)",
				"rgb(143,151,74)",
				"rgb(138,111,48)"
			],
			draw:function(){
				var x=this.ctx;
				x.clearRect(0,0,this.w,this.h);
				var ix=0,iy=0,ps=Math.round(ed.pal.w/3);
				for(var i=0;i<this.colors.length;i++){
					var c=this.colors[i], b=3;
					x.beginPath();
					x.fillStyle=c;
					x.rect(ix,iy,ps,ps);
					var pip=x.isPointInPath(this.mouse.x,this.mouse.y);
					x.fill();
					if(ed.color==c){
						x.strokeStyle="#FFF";
						x.strokeRect(ix+1,iy+1,ps-2,ps-2);
						x.strokeStyle="rgba(0,0,0,0.7)";
						x.strokeRect(ix+2,iy+2,ps-4,ps-4);
					}else if(pip){
						x.strokeStyle="rgba(255,255,255,0.5)";
						x.strokeRect(ix+1,iy+1,ps-2,ps-2);
						x.strokeStyle="rgba(0,0,0,0.5)";
						x.strokeRect(ix+2,iy+2,ps-4,ps-4);
						if(gui.mouse.leftClicked){
							ed.color=c;
						}
					}
					ix+=ps;
					if(ix>ed.pal.w){
						ix=0;
						iy+=ps;
					}
				}
			}
		}, ed.m);
		addEventListener("mousewheel",function(e){
			if(ed.m.mouse.x<0)return;
			if(ed.m.mouse.y<0)return;
			if(ed.m.mouse.x>ed.m.w)return;
			if(ed.m.mouse.y>ed.m.h)return;
			if(e.wheelDelta>0){
				ed.view.scale*=2;
			}else{
				ed.view.scale/=2;
			}
		});
	};
	ed.hide = function(){
		ed.m = ed.m && ed.m.close();
	};
	ed.show();
};

/*
Switch between tabs in koding...
Tab: Insert tab character
Shift-Tab: Tab out
Ctrl-Tab: Switches tabs in chrome
Ctrl-Shift-Tab: Switches tabs in chrome
Ctrl-Win-Tab: Switches tabs in chrome
Ctrl-Win-Shift-Tab: Switches tabs in chrome
Alt-Tab: window switcher in windows
Alt-Shift-Tab: window switcher in windows
Ctrl-Alt-Tab: window switcher in windows
Ctrl-Alt-Shift-Tab: window switcher in windows
Win-Alt-Tab: window switcher in windows
Win-Alt-Shift-Tab: window switcher in windows
Win-Tab: 3d window switcher in windows
Win-Shift-Tab: 3d window switcher in windows
Ctrl-Win-Alt-Tab: Aha! Not mapped!
Ctrl-Win-Alt-Shift-Tab: Not mapoed!
*/


