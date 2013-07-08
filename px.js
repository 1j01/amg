
// It's a pixel editor.
PixelEditor = function(img, gui){
	var ed = this;
	ed.tilesetmode = false;
	ed.tool = "Paint";
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
	ed.ctx=ed.canvas.getContext("2d");
	ed.ctx.drawImage(ed.img,0,0);
	ed.view = {
		scale: 1,
		x: ed.canvas.width/2,
		y: ed.canvas.height/2,
	};
	
	ed.m = gui.M();
	ed.m.title("Pixel Editor");
	ed.m.$c.style.width=128*4+"px";
	ed.m.$c.style.height=128*4+"px";
	ed.m.position("center-top");
	/*
		draw: function(){
			var x=ed.ctx;
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
					ed.img.src=ed.canvas.toDataURL("image/png");
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
	});*/
	
	ed.tb=gui.M();
	ed.tb.title("Tools");
	ed.tb.position("left");
	ed.tb.closeable(false);
	ed.tools=[
		"Paint",
		"Fill",
		"Select",
	];
	for(var i=0;i<ed.tools.length;i++){
		var c=ed.tools[i];
		var $tool = document.createElement("tool");
		ed.tb.$c.appendChild($tool);
		$tool.tool=c;
		if(ed.tool===$tool.tool){
			ed.tb.$tool=$tool;
			ed.tb.$tool.style.boxShadow="0 0 2px 1px black inset, 0 0 1px 3px white inset";
		}
		$tool.innerText=c;
		//$tool.style.width="30px";
		//$tool.style.height="30px";
		$tool.style.display="block";
		$tool.style.padding="5px";
		$tool.onclick=function(){
			ed.tool=this.tool;
			if(ed.tb.$tool){
				ed.tb.$tool.style.boxShadow="";
			}else{
				throw new Error("Tool name incorrect...");
			}
			ed.tb.$tool=this;
			ed.tb.$tool.style.boxShadow="0 0 2px 1px black inset, 0 0 1px 3px white inset";
		};
	}
	ed.pal=gui.M();
	ed.pal.title("Palette");
	ed.pal.position("bottom left");
	ed.pal.closeable(false);
	ed.colors=[
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
	];
	for(var i=0;i<ed.colors.length;i++){
		var c=ed.colors[i];
		var $color = document.createElement("color");
		ed.pal.$c.appendChild($color);
		$color.color=c;
		if(ed.color===$color.color){
			ed.pal.$color=$color;
			ed.pal.$color.style.boxShadow="0 0 2px 1px black inset, 0 0 1px 3px white inset";
		}
		$color.style.backgroundColor=c;
		$color.style.width="30px";
		$color.style.height="30px";
		$color.style.display="inline-block";
		$color.onclick=function(){
			ed.color=this.color;
			ed.pal.$color.style.boxShadow="";
			ed.pal.$color=this;
			ed.pal.$color.style.boxShadow="0 0 2px 1px black inset, 0 0 1px 3px white inset";
		};
	}
	ed.m.$c.addEventListener("mousewheel",function(e){
		if(e.wheelDelta>0){
			ed.view.scale++;
		}else{
			ed.view.scale--;
		}
		ed.view.scale=Math.min(10,Math.max(1,ed.view.scale));
	});
	ed.close = function(){
		ed.m = ed.m && ed.m.close();
	};
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


