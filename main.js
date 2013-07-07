//(function _(_){
	var canvas = document.querySelector("canvas");
	var mainctx = canvas.getContext("2d");
	addEventListener('contextmenu',function(e){return!!e.preventDefault()});
	addEventListener('mousedown',function(e){return!!e.preventDefault()});
	
	var editing = true;
	var gui = new GUI();
	
	var arts = new ArtAssets(mainctx,assetsLoaded);
	var arte = new ArtManager(arts, gui);
	
	var u = new Universe();
	var r = new Room();
	u.addRoom(r);
	
	var le = new LevelEditor(u);
	var game = new Game(u);
	
	function assetsLoaded(){
		
	}
	
	if(window.requestAnimationFrame){
		requestAnimationFrame(function animate(){
			requestAnimationFrame(animate);
			update();
		});
	}else{
		setTimeout(update,10);
	}
	
	function update(){
		if(canvas.width !=innerWidth ) canvas.width = innerWidth;
		if(canvas.height!=innerHeight) canvas.height= innerHeight;
		mainctx.clearRect(0,0,canvas.width,canvas.height);
		
		if(arts.progress<1){
			var w=canvas.width;
			var h=canvas.height;
			mainctx.fillStyle="rgba(255,255,255,0.6)";
			mainctx.fillRect((w-500)/2,(h-50)/2,500,50);
			mainctx.fillStyle="rgba(0,0,0,0.8)";
			mainctx.fillRect((w-490)/2,(h-40)/2,490,40);
			mainctx.fillStyle="rgba(255,255,255,0.8)";
			mainctx.fillRect((w-480)/2,(h-30)/2,480*arts.progress,30);
		}
		
		gui.draw(mainctx);
		/*
		le.update(editing);
		game.update(editing);
		*/
	}
	
//})();

var px = new PixelEditor(0, gui);
