
/// Selects tiles.
// #disposable

TileSelector = function(le, aa, gui){
	var am=this;
	var timeout=0;
	am.show = function(){
		am.m = this.m || gui.M();
		am.m.title("Tile Selector").position("center left-ish-ish?");
		am.m.onclose = function(){
			am.m = null;
			return true;
		};
		am.update();
	};
	am.update = function(){
		if(!am.m)return false;
		am.m.$c.innerHTML="";
		am.m.$c.style.maxHeight="80vh";
		am.m.$c.style.minHeight="200px";
		am.m.$c.style.minWidth="265px";
		am.m.$c.style.overflowY="auto";
		am.m.$c.style.overflowX="hidden";
		for(var i in aa.images){
			var img=aa.images[i];
			var div=document.createElement("div");
			var label=document.createElement("label");
			var canvas=document.createElement("canvas");
			div.className="asset";
			label.innerText=i.replace(aa.dir,"").replace(".png","");
			canvas.width=Math.min(256,img.width);
			canvas.height=Math.min(128,img.height);
			var ctx=canvas.getContext("2d");
			ctx.drawImage(img,0,0);
			
			ctx.beginPath();
			for(var x=0.5;x<canvas.width;x+=TS){
				ctx.moveTo(x,0);
				ctx.lineTo(x,canvas.height);
			}
			for(var y=0.5;y<canvas.height;y+=TS){
				ctx.moveTo(0,y);
				ctx.lineTo(canvas.width,y);
			}
			ctx.globalCompositeOperation = "difference";
			ctx.strokeStyle = "#FFF";//what it already is
			ctx.stroke();
			
			canvas.onclick=(function(iname){
				return function(e){
					//var rect = canvas.getBoundingClientRect();
					//var mx = e.clientX - rect.left;
					//var my = e.clientY - rect.top;
					var mx = e.offsetX;
					var my = e.offsetY;
					var tx = Math.floor(mx/TS);
					var ty = Math.floor(my/TS);
					le.selected = {
						spriteX: tx,
						spriteY: ty,
						sprite: iname
					};
				};
			})(i);
			
			am.m.$c.appendChild(div);
			div.appendChild(label);
			div.appendChild(canvas);
		}
	};
	am.close = function(){
		am.m && am.m.close();
		am.m = null;
	};
};

//ctx.drawImage(img, sX, sY, sW, sH, X, Y, W, H);