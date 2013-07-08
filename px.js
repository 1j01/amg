
// It's a pixel editor.
PixelEditor = function(gui, img){
	//var 
	PE = this;
	PE.tilesetmode = false;
	PE.tool = "Paint";
	PE.color = "rgb(203,219,252)";
	PE.ocanvas = document.createElement("canvas");
	PE.canvas = document.createElement("canvas");
	
	if(!img){
		PE.img = document.createElement("img");
		PE.img.width = 128;
		PE.img.height = 128;
	}else{
		PE.img = img;
	}
	PE.ocanvas.width = PE.img.width;
	PE.ocanvas.height = PE.img.height;
	PE.canvas.width = PE.img.width * 10;
	PE.canvas.height = PE.img.height * 10;
	PE.ctx=PE.canvas.getContext("2d");
	PE.octx=PE.ocanvas.getContext("2d");
	PE.ctx.imageSmoothingEnabled=false;
	PE.ctx.webkitImageSmoothingEnabled=false;
	PE.ctx.mozImageSmoothingEnabled=false;
	PE.octx.drawImage(PE.img,0,0);
	//PE.ctx.drawImage(PE.img,0,0,PE.canvas.width,PE.canvas.height);
	PE.view = {
		scale: 1,
		x: PE.canvas.width/2,
		y: PE.canvas.height/2,
	};
	PE.canvas.style.width=PE.ocanvas.width*PE.view.scale+"px";
	PE.canvas.style.height=PE.ocanvas.height*PE.view.scale+"px";
	
	PE.m = gui.M();
	PE.m.title("Pixel Editor");
	PE.m.$c.style.width=128*4+"px";
	PE.m.$c.style.height=128*4+"px";
	PE.m.$c.style.overflow="hidden";
	PE.m.position("center-top");
	PE.m.$c.appendChild(PE.canvas);
	PE.m.mouse={
		left:false,right:false,
	};
	PE.m.$c.addEventListener("mousedown",function(e){
		if(e.button){
			PE.m.mouse.right=true;
		}else{
			PE.m.mouse.left=true;
		}
	});
	addEventListener("mouseup",function(e){
		if(e.button){
			PE.m.mouse.right=false;
		}else{
			PE.m.mouse.left=false;
		}
	});
	addEventListener("mousemove",function(e){
		PE.m.mouse.prev={x:PE.m.mouse.x,y:PE.m.mouse.y,left:PE.m.mouse.left,right:PE.m.mouse.right};
		var rect=PE.canvas.getBoundingClientRect();
		PE.m.mouse.x=e.clientX-rect.left;
		PE.m.mouse.y=e.clientY-rect.top;
		
		var x=PE.octx;
		if(PE.tool==="Paint"){
			if(PE.m.mouse.left){
				x.beginPath();
				var mx1=cx(PE.m.mouse.prev.x),my1=cy(PE.m.mouse.prev.y);
				var mx2=cx(PE.m.mouse.x),my2=cy(PE.m.mouse.y);
				console.log(mx2,my2);
				//var seded=
				x.moveTo(mx1,my1);
				x.lineTo(mx2,my2);
				//x.lineWidth=2;
				x.strokeStyle=PE.color;
				x.stroke();
				PE.img.src=PE.canvas.toDataURL("image/png");
			}
		}
		PE.ctx.clearRect(0,0,PE.canvas.width,PE.canvas.height);
		PE.ctx.drawImage(PE.ocanvas,0,0,PE.canvas.width,PE.canvas.height);
	});
	function cx(mx){
		return mx/PE.view.scale;
	}
	function cy(my){
		return my/PE.view.scale;
	}
	
	PE.tb=gui.M();
	PE.tb.title("Tools");
	PE.tb.position("left");
	PE.tb.closeable(false);
	PE.tools=[
		"Paint",
		"Fill",
		"Select",
		"Tile",
	];
	for(var i=0;i<PE.tools.length;i++){
		var c=PE.tools[i];
		var $tool = document.createElement("tool");
		PE.tb.$c.appendChild($tool);
		$tool.tool=c;
		if(PE.tool===$tool.tool){
			PE.tb.$tool=$tool;
			PE.tb.$tool.style.boxShadow="0 0 2px 1px black inset, 0 0 1px 3px white inset";
		}
		$tool.innerText=c;
		//$tool.style.width="30px";
		//$tool.style.height="30px";
		$tool.style.display="block";
		$tool.style.padding="5px";
		$tool.onclick=function(){
			PE.tool=this.tool;
			if(PE.tb.$tool){
				PE.tb.$tool.style.boxShadow="";
			}else{
				throw new Error("Tool name incorrect...");
			}
			PE.tb.$tool=this;
			PE.tb.$tool.style.boxShadow="0 0 2px 1px black inset, 0 0 1px 3px white inset";
		};
	}
	PE.pal=gui.M();
	PE.pal.title("Palette");
	PE.pal.position("bottom left");
	PE.pal.closeable(false);
	PE.colors=[
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
	for(var i=0;i<PE.colors.length;i++){
		var c=PE.colors[i];
		var $color = document.createElement("color");
		PE.pal.$c.appendChild($color);
		$color.color=c;
		if(PE.color===$color.color){
			PE.pal.$color=$color;
			PE.pal.$color.style.boxShadow="0 0 2px 1px black inset, 0 0 1px 3px white inset";
		}
		$color.style.backgroundColor=c;
		$color.style.width="30px";
		$color.style.height="30px";
		$color.style.display="inline-block";
		$color.onclick=function(){
			PE.color=this.color;
			PE.pal.$color.style.boxShadow="";
			PE.pal.$color=this;
			PE.pal.$color.style.boxShadow="0 0 2px 1px black inset, 0 0 1px 3px white inset";
		};
	}
	PE.m.$c.addEventListener("mousewheel",function(e){
		if(e.wheelDelta>0){
			PE.view.scale++;
		}else{
			PE.view.scale--;
		}
		PE.view.scale=Math.min(10,Math.max(1,PE.view.scale));
		PE.canvas.style.width=PE.ocanvas.width*PE.view.scale+"px";
		PE.canvas.style.height=PE.ocanvas.height*PE.view.scale+"px";
		/*PE.canvas.style.transform="scale("+PE.view.scale+")";
		PE.canvas.style.oTransform="scale("+PE.view.scale+")";
		PE.canvas.style.mozTransform="scale("+PE.view.scale+")";
		PE.canvas.style.webkitTransform="scale("+PE.view.scale+")";*/
	});
	PE.close = function(){
		PE.m.close(true);
	};
	PE.m.onclose = function(){
		PE.tb.close();
		PE.pal.close();
		return true;
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


