
/// Manages tilesets and sprites... opens the pixel editor.
// #disposable

ArtManager = function(aa, gui){
	var am=this;
	var timeout=0;
	am.show = function(){
		am.m = this.m || gui.M();
		am.m.title("Art Manager").position("center left-ish?");
		am.m.onclose=function(){
			am.m=null;
			return true;
		};
		am.update();
	};
	am.update = function(){
		if(!am.m)return false;
		am.m.$c.innerHTML="<label><input type='checkbox'/>Levely edit mode?</label>";
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
			var x=canvas.getContext("2d");
			x.drawImage(img,0,0);
			div.onclick=(function(iname){
				return function(e){
					new PixelEditor(gui, aa.images[iname], function(img){
						aa.images[iname]=img;
						am.update();
					}, function(img, shiftKey){
						window.open(img.src);
					});
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