
/// Handles loading and storing of images for live editing. Also uploading.
// #persistant

ArtAssets = function(mainctx, allloaded){
	var aa=this;
	aa.progress=0;
	aa.images={};
	aa.dir="content/arts/";
// splitting tilesets into tiles is unnecessary. drawImage supports clipping.
// maybe add a helper function to lookup image and draw clipped?
	
	aa.getImage=function(name){
		name=aa.dir+name;
		if(aa.images[name]){
			return aa.images[name];
		}else{
			alert("Image not loaded!");
		}
	};
	
	aa.uploadImage=function(name){
		name=aa.dir+name;
		var x=new XMLHttpRequest();
		x.onreadystatechange=function(){
			console.log(x.responseText);
		};
		x.open("POST","upload.py");
		x.send();
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
	x.open("GET","listcontent.py");
	x.send();
};
