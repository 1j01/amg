
/// Handles loading and storing of images for live editing. Also uploading.
// #persistant
 
ArtAssets = function(mainctx, allloaded, update){
	var aa=this;
	aa.progress=0;
	aa.progress_l=0;
	aa.images={};
	aa.dir="content/art/";
// splitting tilesets into tiles is unnecessary. drawImage supports clipping.
// maybe add a helper function to lookup image and draw clipped?
	
	aa.getImage=function(name){
		name=aa.dir+name;
		if(aa.images[name]){
			return aa.images[name];
		}else{
			console.error("no image!");
		}
	};
	
	//should reuse ajax code
	aa.uploadImage=function(name){
		var img=aa.getImage(name);
		if(!img.src.match(/^data:/)){
			console.log("uploadImage: image not modified.");
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
	
	aa.loaded=0;
	aa.nImages=100000000;
	var x=new XMLHttpRequest();
	x.onreadystatechange=function(){
		if(x.readyState===4){
			var contents=x.responseText.split("\n");
			aa.nImages=0;
			for(var i=0;i<contents.length;i++){
				var c=contents[i];
				if(c.match(/\.png/)){
					aa.nImages++;
					var img=new Image();
					img.onload=imgOnLoad;
					img.onerror=imgOnError;
					img.src=c;
					img.fname=c.replace(/content\/art\//,"");
					aa.images[c]=img;
				}
			}
		}
		function imgOnLoad(){
			aa.loaded++;
			aa.progress=aa.loaded/aa.nImages;
			if(aa.loaded===aa.nImages){
				allloaded();
			}
		}
		function imgOnError(){
			console.error(this.src,"failed to load.");
		}
	};
	//x.open("POST","upload.py");
	x.open("GET","list-content.py");
	x.send();
	
};
