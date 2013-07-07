
// Manages tilesets, opens the pixel editor.
ArtManager = function(assets, gui){
	this.assets = assets;
	this.show = function(){
		this.m = this.m || gui.M();
		
	};
	this.hide = function(){
		this.m = this.m && this.m.close();
	};
};
