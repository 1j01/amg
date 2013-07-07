
// Manages tilesets, opens the pixel editor.
//ctx.drawImage(img, sX, sY, sW, sH, X, Y, W, H);
ArtManager = function(assets, gui){
	this.assets = assets;
	this.show = function(){
		this.m = this.m || gui.M();
		
	};
	this.hide = function(){
		this.m = this.m && this.m.close();
	};
};
