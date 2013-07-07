
// It's a pixel editor. 
// If this for some reason becomes really good, it can be extracted easily because of the modularity.
PixelEditor = function(assets, gui){
	this.assets = assets;
	this.show = function(){
		this.m = this.m || gui.M();
		
	};
	this.hide = function(){
		this.m = this.m && this.m.close();
	};
};
