
/// It's a pixel editor.
// #disposable
PixelEditor = function(gui, img, update){
	var pe = this;
	
	pe.tilesetmode = false;
	pe.tool = "Paint";
	pe.color = "rgb(255,255,255)";
	
	pe.undos = [];
	pe.redos = [];
	pe.undoable = function(){
		console.log("Creating undoable state.");
		pe.undos.push(pe.ocanvas.toDataURL("image/png"));
		pe.redos=[];
	};
	pe.undo = function(){
		console.log("Undo.");
		if(pe.undos.length<1)return false;
		pe.redos.push(pe.ocanvas.toDataURL("image/png"));
		var img=new Image();
		img.onload=function(){
			pe.img=img;
			pe.octx.clearRect(0,0,img.naturalWidth,img.naturalHeight);
			pe.octx.drawImage(img,0,0);
			pe.redraw();
			update(img);
		};
		img.src=pe.undos.pop();
		return true;
	};
	pe.redo = function(){
		console.log("Redo.");
		if(pe.redos.length<1)return false;
		pe.undos.push(pe.ocanvas.toDataURL("image/png"));
		var img=new Image();
		img.onload=function(){
			pe.octx.clearRect(0,0,img.naturalWidth,img.naturalHeight);
			pe.octx.drawImage(img,0,0);
			pe.redraw();
			update(img);
		};
		img.src=pe.redos.pop();
		return true;
	};
	
	pe.ocanvas = document.createElement("canvas");
	pe.canvas = document.createElement("canvas");
	if(!img){
		pe.img = document.createElement("img");
		pe.img.width = 128;
		pe.img.height = 128;
	}else{
		pe.img = img;
	}
	pe.view = {
		scale: 2,
		x: pe.img.width/2,
		y: pe.img.height/2,
	};
	pe.ocanvas.width = pe.img.width;
	pe.ocanvas.height = pe.img.height;
	pe.canvas.width = pe.img.width * 3;
	pe.canvas.height = pe.img.height * 3;
	
	pe.ctx=pe.canvas.getContext("2d");
	pe.octx=pe.ocanvas.getContext("2d");
	
	pe.ctx.imageSmoothingEnabled=false;
	pe.ctx.webkitImageSmoothingEnabled=false;
	pe.ctx.mozImageSmoothingEnabled=false;
	
	pe.octx.drawImage(pe.img,0,0);
	
	//pe.ctx.drawImage(pe.img,0,0,pe.canvas.width,pe.canvas.height);
	pe.canvas.style.width=pe.ocanvas.width*pe.view.scale+"px";
	pe.canvas.style.height=pe.ocanvas.height*pe.view.scale+"px";
	
	(pe.redraw=function(){
		pe.ctx.clearRect(0,0,pe.canvas.width,pe.canvas.height);
		pe.ctx.drawImage(pe.ocanvas,0,0,pe.canvas.width,pe.canvas.height);
	})();
	
	pe.m = gui.M();
	pe.m.title("Pixel Editor");
	//pe.m.$c.style.width=128*4+"px";
	//pe.m.$c.style.height=128*4+"px";
	//pe.m.$c.style.overflow="hidden";
	pe.m.$m.style.maxWidth="80vw";
	pe.m.$m.style.maxWidth="80vw";
	pe.m.$c.style.maxHeight="80vh";
	pe.m.$c.style.overflowY="auto";
	pe.m.$c.style.overflowX="auto";
	pe.m.position("center-top");
	pe.m.$c.appendChild(pe.canvas);
	pe.m.mouse={
		x:0,y:0,
		left:false,right:false,
	};
	pe.m.mouse.prev={
		x:0,y:0,
		left:false,right:false,
	};
	pe.m.mouse.prev.prev={
		x:0,y:0,
		left:false,right:false,
	};
	pe.mousedown = function(e){
		
		var rect=pe.canvas.getBoundingClientRect();
		pe.m.mouse.x=((e.clientX-rect.left)/pe.view.scale)|0;
		pe.m.mouse.y=((e.clientY-rect.top)/pe.view.scale)|0;
		pe.undoable();
		if(e.button){
			pe.m.mouse.right=true;
		}else{
			pe.m.mouse.left=true;
			if(pe.tool==="Paint"){
				pe.octx.fillStyle=pe.color;
				pe.octx.fillRect(pe.m.mouse.x,pe.m.mouse.y,1,1);
				
				pe.ctx.clearRect(0,0,pe.canvas.width,pe.canvas.height);
				pe.ctx.drawImage(pe.ocanvas,0,0,pe.canvas.width,pe.canvas.height);
			}else if(pe.tool==="Fill"){
				var _x=pe.m.mouse.x,_y=pe.m.mouse.y;
				var id=pe.octx.getImageData(0,0,pe.canvas.width,pe.canvas.height);
				var rgb=pe.color.match(/rgb\((\d+),(\d+),(\d+)\)/),
					r=Number(rgb[1]),
					g=Number(rgb[2]),
					b=Number(rgb[3]);
				fill(_x,_y,r,g,b,255);
				pe.octx.putImageData(id,0,0);
				
				pe.ctx.clearRect(0,0,pe.canvas.width,pe.canvas.height);
				pe.ctx.drawImage(pe.ocanvas,0,0,pe.canvas.width,pe.canvas.height);
				
				function fill(x,y, r,g,b,a, wr,wg,wb,wa, life){
					if(x<0||y<0||x>=id.width||y>=id.height)return;
					var i=(x%id.width+y*id.width)*4;
					
					if(wr===undefined){
						var wr=id.data[i+0],wg=id.data[i+1],wb=id.data[i+2],wa=id.data[i+3];
						console.log("fill within color",wr,wg,wb);
						console.log("fill with color",r,g,b);
						if(r==wr&&g==wg&&b==wb&&a==wa){
							console.log("Already that color.");
							return false;
						}
						var life=650;
					}
					
					if(id.data[i+3]==wa
					&& id.data[i+0]==wr
					&& id.data[i+1]==wg
					&& id.data[i+2]==wb){
					   id.data[i+0]=r;
					   id.data[i+1]=g;
					   id.data[i+2]=b;
					   id.data[i+3]=a;
					}else return;
					
					if(--life){
						if(x<id.width)fill(x+1,y, r,g,b,a, wr,wg,wb,wa, life);
						if(y<id.height)fill(x,y+1, r,g,b,a, wr,wg,wb,wa, life);
						if(x>0)fill(x-1,y, r,g,b,a, wr,wg,wb,wa, life);
						if(y>0)fill(x,y-1, r,g,b,a, wr,wg,wb,wa, life);
					}
				}
			}else if(pe.tool==="Replace Color"){
				var _x=pe.m.mouse.x,_y=pe.m.mouse.y;
				var id=pe.octx.getImageData(0,0,pe.canvas.width,pe.canvas.height);
				var rgb=pe.color.match(/rgb\((\d+),(\d+),(\d+)\)/),
					r=Number(rgb[1]),
					g=Number(rgb[2]),
					b=Number(rgb[3]);
				replaceColor(_x,_y,r,g,b,255);
				pe.octx.putImageData(id,0,0);
				
				pe.ctx.clearRect(0,0,pe.canvas.width,pe.canvas.height);
				pe.ctx.drawImage(pe.ocanvas,0,0,pe.canvas.width,pe.canvas.height);
				
				function replaceColor(x,y, r,g,b,a){
					if(x<0||y<0||x>=id.width||y>=id.height)return;
					var i=(x%id.width+y*id.width)*4;
					var wr=id.data[i+0],wg=id.data[i+1],wb=id.data[i+2],wa=id.data[i+3];
					
					console.log("replace all",[wr,wg,wb,wa],"with",[r,g,b,a]);
					
					for(var i=0;i<id.data.length;i+=4){
						if(id.data[i+3]==wa
						&& id.data[i+0]==wr
						&& id.data[i+1]==wg
						&& id.data[i+2]==wb){
						   id.data[i+0]=r;
						   id.data[i+1]=g;
						   id.data[i+2]=b;
						   id.data[i+3]=a;
						}
					}
				}
			}
			
		}
	};
	pe.mouseup = function(e){
		if(e.button){
			pe.m.mouse.right=false;
		}else{
			if(pe.m.mouse.left){
				setTimeout(function(){
					pe.img=new Image();
					pe.img.onload=function(){
						update(pe.img);
					};
					pe.img.src=pe.ocanvas.toDataURL("image/png");
				},1);
			}
			pe.m.mouse.left=false;
		}
	};
	pe.mousemove = function(e){
		//setTimeout(function(){
			
			pe.m.mouse.prev={
				x:pe.m.mouse.x,
				y:pe.m.mouse.y,
				left:!!pe.m.mouse.prev.left,
				right:!!pe.m.mouse.prev.right,
				prev:{
					x:pe.m.mouse.prev.x,
					y:pe.m.mouse.prev.y,
				}
			};
			
			var rect=pe.canvas.getBoundingClientRect();
			pe.m.mouse.x=((e.clientX-rect.left)/pe.view.scale)|0;
			pe.m.mouse.y=((e.clientY-rect.top)/pe.view.scale)|0;
			
			if(pe.m.mouse.left){
				var x=pe.octx;
				if(pe.tool==="Paint"){
					x.fillStyle=pe.color;
					var mx1=pe.m.mouse.prev.x,my1=pe.m.mouse.prev.y;
					var mx2=pe.m.mouse.x,my2=pe.m.mouse.y;
					//console.log(mx2,my2);
					//var dir=Math.atan2()
					//var speed=Math.sqrt((mx1-mx2)*(mx1-mx2)+(my1-my2)*(my1-my2));
					var vx=(mx1-mx2)/5;
					var vy=(my1-my2)/5;
					
					for(
						var _x=mx1, _y=my1;
						
						Math.abs(_x-mx2)>0 ||
						Math.abs(_y-my2)>0;
						
						_x+=Math.max(-1,Math.min(1,mx2-_x)),
						_y+=Math.max(-1,Math.min(1,my2-_y))
					){
							x.fillRect(_x|0,_y|0,1,1);
					}
					//x.fillRect(_x|0,_y|0,1,1);
					//x.fillRect(mx2|0,my2|0,1,1);
				
				}else if(pe.tool==="45"){
					x.fillStyle=pe.color;
					var mx1=pe.m.mouse.prev.x,my1=pe.m.mouse.prev.y;
					var mx2=pe.m.mouse.x,my2=pe.m.mouse.y;
					for(
						var _x=mx1, _y=my1;
						
						Math.abs(_x-mx2)>0 ||
						Math.abs(_y-my2)>0;
						
						_x+=Math.max(-1,Math.min(1,mx2-_x)),
						_y+=Math.max(-1,Math.min(1,my2-_y))
					){
							x.fillRect(_x|0,_y|0,1,1);
					}
				}else if(pe.tool==="Spray"){
					x.fillStyle=pe.color;
					var mx1=pe.m.mouse.prev.x,my1=pe.m.mouse.prev.y;
					var mx2=pe.m.mouse.x,my2=pe.m.mouse.y;
					for(
						var _x=mx1, _y=my1, _i=-100;
						
						(	Math.abs(_x-mx2)>1 ||
							Math.abs(_y-my2)>1
						)	&& (i++);
						
						_x+=Math.max(-1,Math.min(1,mx2-_x)),
						_y+=Math.max(-1,Math.min(1,my2-_y))
					){
							x.fillRect((Math.random()*10-5+_x)|0,(Math.random()*10-5+_y)|0,1,1);
					}
				}
			
				pe.ctx.clearRect(0,0,pe.canvas.width,pe.canvas.height);
				pe.ctx.drawImage(pe.ocanvas,0,0,pe.canvas.width,pe.canvas.height);
				if(pe.view.scale>4){
					pe.ctx.strokeStyle="#FFF";
					pe.ctx.globalCompositeOperation="xor";
					pe.ctx.beginPath();
					var s=pe.view.scale/Math.sqrt(pe.view.scale);
					pe.ctx.moveTo(0,pe.m.mouse.y*s);
					pe.ctx.lineTo(pe.canvas.width,pe.m.mouse.y*s);
					pe.ctx.moveTo(pe.m.mouse.x*s,0);
					pe.ctx.lineTo(pe.m.mouse.x*s,pe.canvas.height);
					pe.ctx.stroke();
					pe.ctx.globalCompositeOperation="source-over";
				}
			}
			
			pe.m.mouse.prev.left=pe.m.mouse.left;
			pe.m.mouse.prev.right=pe.m.mouse.right;
		//},1);
	};
	pe.keydown = function(e){
		//if(!keys[e.keyCode]){
			console.log(String.fromCharCode(e.keyCode)+": ",e.keyCode);
			switch(String.fromCharCode(e.keyCode).toUpperCase()){
				case "Z"://undo (+shift=redo)
					e.shiftKey? pe.redo():pe.undo();
				break;
				case "Y"://redo
					pe.redo();
				break;
				case "A"://select all
					//pe.selectAll();
					e.preventDefault();
				break;
				case "D"://deselect all
					pe.selection=null;
				break;
				case "C"://copy selection
					console.log(e);
				break;
				case "V"://pasta
					pe.undoable();
					console.log(e.clipboard,e);
				break;
			}
		//}
		//keys[e.keyCode]=true;
		if(String.fromCharCode(e.keyCode).toUpperCase()==="A"){
			return false;
		}
	};
	pe.mousewheel = function(e){
		if(e){
			if(e.wheelDelta>0){
				pe.view.scale++;
			}else{
				pe.view.scale--;
			}
		}
		pe.view.scale=Math.min(20,Math.max(1,pe.view.scale));
		pe.canvas.style.width=pe.ocanvas.width*pe.view.scale+"px";
		pe.canvas.style.height=pe.ocanvas.height*pe.view.scale+"px";
		/*pe.canvas.style.transform="scale("+pe.view.scale+")";
		pe.canvas.style.oTransform="scale("+pe.view.scale+")";
		pe.canvas.style.mozTransform="scale("+pe.view.scale+")";
		pe.canvas.style.webkitTransform="scale("+pe.view.scale+")";*/
	};
	addEventListener('keydown', pe.keydown);
	addEventListener("mousemove",pe.mousemove);
	addEventListener("mouseup",pe.mouseup);
	pe.m.$c.addEventListener("mousedown",pe.mousedown);
	pe.m.$c.addEventListener("mousewheel",pe.mousewheel);
	
	var resizer=null;
	
	pe.tb=gui.M()
	.title("Tools")
	.position("right")
	.closeable(false)
	.content("<button id='resize-canvas'>Resize Canvas</button>")
	.$('#resize-canvas',function(btn){btn.onclick=function(){
		if(!resizer){
			resizer=gui.M()
			.title("Resize Canvas")
			.position("center")
			.content(
				"<input type='number' min=0 max=1024 id='width' value='"+pe.ocanvas.width+"'/> x "+
				"<input type='number' min=0 max=1024 id='height' value='"+pe.ocanvas.height+"'/>"+
				"<input type='submit' min=0 max=1024 id='submit'/>"
			).$("#width",function(winput){
				winput.onchange=function(){
					resizer.$("#height").value=this.value;
				};
			}).$("#submit",function(submit){
				submit.onclick=function(){
					pe.ocanvas.width=resizer.$("#width").value;
					pe.ocanvas.height=resizer.$("#height").value;
					pe.canvas.width=pe.ocanvas.width*3;
					pe.canvas.height=pe.ocanvas.height*3;
					//pe.octc.drawImage(pe.img,0,0);
					//pe.ctc.drawImage(pe.ocanvas,0,0,pe.canvas.width,pe.canvas.height);
					pe.redraw();
					pe.mousewheel();
					resizer.close();
					resizer=null;
				};
			});
		}
	};});
	pe.tools=["Paint","45","Spray","Fill","Replace Color","Select","Tile"];
	var toolOnClick=function(){
		pe.tool=this.tool;
		if(pe.tb.$tool){
			pe.tb.$tool.className="tool";
		}else{
			throw new Error("Tool name incorrect...");
		}
		pe.tb.$tool=this;
		pe.tb.$tool.className="tool selected";
	};
	for(var i=0;i<pe.tools.length;i++){
		var c=pe.tools[i];
		var $tool = document.createElement("div");
		$tool.className="tool";
		pe.tb.$c.appendChild($tool);
		$tool.tool=c;
		if(pe.tool===$tool.tool){
			if(pe.tb.$tool)
				pe.tb.$tool.className="tool";
			pe.tb.$tool=$tool;
			pe.tb.$tool.className="tool selected";
		}
		$tool.innerText=c;
		//$tool.style.width="30px";
		//$tool.style.height="30px";
		$tool.style.display="block";
		$tool.style.padding="5px";
		$tool.onclick=toolOnClick;
	}
	pe.pal=gui.M();
	pe.pal.title("Palette");
	pe.pal.position("bottom right");
	pe.pal.closeable(false);
	pe.colors=[
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
	for(var i=0;i<pe.colors.length;i++){
		var c=pe.colors[i];
		var $color = document.createElement("color");
		pe.pal.$c.appendChild($color);
		$color.color=c;
		$color.className="color";
		if(pe.color===$color.color){
			pe.pal.$color=$color;
			pe.pal.$color.className="color selected";
		}
		$color.style.backgroundColor=c;
		$color.style.width="30px";
		$color.style.height="30px";
		$color.style.display="inline-block";
		$color.onclick=function(){
			pe.color=this.color;
			pe.pal.$color.className="color";
			pe.pal.$color=this;
			pe.pal.$color.className="color selected";
		};
	}
	pe.close = function(){
		pe.m.close(true);
	};
	pe.m.onclose = function(){
		pe.tb.close();
		pe.pal.close();
		removeEventListener('keydown', pe.keydown);
		removeEventListener("mousemove",pe.mousemove);
		removeEventListener("mouseup",pe.mouseup);
		pe.m.$c.removeEventListener("mousedown",pe.mousedown);
		pe.m.$c.removeEventListener("mousewheel",pe.mousewheel);
		if(resizer){
			resizer.close();
			resizer=null;
		}
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


