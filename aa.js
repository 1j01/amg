
// Handles loading and caching of images, for live editing.
//I think splitting tilesets into tiles is unnecessary.
ArtAssets = function(mainctx, allloaded){
	var arts=this;
	arts.progress=0;
	
	var iid=setInterval(fakey);
	function fakey(){
		if(Math.random()<0.1)arts.progress+=Math.random()/30;
		if(arts.progress>1){
			allloaded();
			clearInterval(iid);
		}
	}
};
