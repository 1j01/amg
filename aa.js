
/// Handles loading and storing of images for live editing. Also uploading.
// #persistant
 
ArtAssets = function(mainctx, allloaded, update){
	var aa=this;
	
	aa.images={};
	aa.dir="content/art/";
	
	aa.total=100000000;
	aa.loaded=0;
	aa.progress=0;
	aa.progress_l=0;
	aa.errored=0;
	aa.failness=0;
	aa.failness_l=0;
// splitting tilesets into tiles is unnecessary: drawImage supports clipping.
// maybe add a helper function to lookup image and draw clipped? meh that can be implemented in Block or something. maybe
	
	aa.getImage=function(name){
		return aa.images[name]
			|| aa.images[aa.dir+name]
			|| aa.images[aa.dir+name+".png"]
			|| console.error("no image '"+name+"'!");
	};
	
	//should reuse ajax code?
	aa.uploadImage=function(name){
		var img=aa.getImage(name);
		if(!img.src.match(/^data:/)){
			console.log("aa.uploadImage: image not modified.");
			return;
		}
		var form=new FormData();
		form.append("imagedata",img.src,aa.dir+name);
		form.append("fname",aa.dir+name);
		var x=new XMLHttpRequest();
		x.onreadystatechange=function(){
			console.log(x.responseText);
		};
		x.open("POST","upload.py");
		x.send(form);
	};
	aa.newImage=function(name, img){
		var form=new FormData();
		if(name.indexOf(".png")==-1)name+=".png";
		var fname=aa.dir;
		aa.images[fname]=img;
		form.append("imagedata",img.src,fname);
		form.append("fname",fname);
		var x=new XMLHttpRequest();
		x.onreadystatechange=function(){
			console.log(x.responseText);
		};
		x.open("POST","upload.py");
		x.send(form);
		return fname||name;//idk||update_later
	};
	//.replace(/content\/art\//,"")
	aa.drawProgress = function(ctx){
		//console.log(aa.progress, aa.progress_l);
		aa.progress_l+=(aa.progress-aa.progress_l)/10;
		aa.failness_l+=(aa.failness-aa.failness_l)/10;
		if(aa.progress_l<0.99999){
			var w=ctx.canvas.width;
			var h=ctx.canvas.height;
			var a = Math.max(0,Math.min((0.9-aa.progress_l)*5,1));
			//ctx.globalAlpha = a;
			ctx.fillStyle="rgba(255,255,255,"+(0.6*a)+")";
			ctx.fillRect((w-500)/2,(h-50)/2,500,50);
			ctx.fillStyle="rgba(0,0,0,"+(2.8*a)+")";
			ctx.fillRect((w-490)/2,(h-40)/2,490,40);
			ctx.fillStyle="rgba(255,255,255,"+(0.8*a)+")";
			ctx.fillRect((w-480)/2,(h-30)/2,480*aa.progress_l,30);
			ctx.fillStyle="rgba(255,0,0,"+(0.8*a*Math.random())+")";
			ctx.fillRect((w-480)/2+480*aa.progress_l+6,(h-30)/2,(480-6*2)*aa.failness_l,30);
			//ctx.globalAlpha = 1;
		}
	};
	var x=new XMLHttpRequest();
	x.onreadystatechange=function(){
		if(x.readyState===4){
			var fnames=x.responseText.split("\n");
			aa.total=0;
			for(var i=0;i<fnames.length;i++){
				var f=fnames[i];
				if(f.match(/\.png/)){
					aa.total++;
					var img=new Image();
					img.onload=imgOnLoad;
					img.onerror=imgOnError;
					img.src=f;
					//img.fname=f.replace(/content\/art\//,"");
					aa.images[f]=img;
				}
			}
		}
		function imgOnLoad(){
			aa.loaded++;
			aa.progress=aa.loaded/aa.total;
			if(aa.loaded===aa.total){
				allloaded();
			}
		}
		function imgOnError(){
			aa.errored++;
			aa.failness=aa.errored/aa.total;
		}
	};
	x.onerror = function(){
		aa.failness = 1;
	};
	//x.open("POST","upload.py");
	x.open("GET","list-content.py");
	x.send();
	
};
