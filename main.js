//(function _(_){
	var canvas = document.querySelector("canvas");
	var mainctx = canvas.getContext("2d");
	addEventListener('contextmenu',function(e){return!!e.preventDefault()});
	addEventListener('mousedown',function(e){return!!e.preventDefault()});
	
	var editing = true;
	var gui = new GUI();
	
	var aa = new ArtAssets(mainctx, whenceBeAssetsLoaded);
	var am = new ArtManager(aa, gui);
	
	var u = new Universe();
	var room = new Room("starting area");
	u.addRoom(room);
	
	var le = new LevelEditor(u);
	var game = new Game(u);
	
	function whenceBeAssetsLoaded(){
		
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
		
		if(aa.progress<1){
			var w=canvas.width;
			var h=canvas.height;
			mainctx.fillStyle="rgba(255,255,255,0.6)";
			mainctx.fillRect((w-500)/2,(h-50)/2,500,50);
			mainctx.fillStyle="rgba(0,0,0,0.8)";
			mainctx.fillRect((w-490)/2,(h-40)/2,490,40);
			mainctx.fillStyle="rgba(255,255,255,0.8)";
			mainctx.fillRect((w-480)/2,(h-30)/2,480*aa.progress,30);
		}
		
		//gui.draw(mainctx);
		/*
		le.update(editing);
		game.update(editing);
		*/
	}
	
	var mainScreen = null;
	var mainScreenTurnOn = function(){
		mainScreen = gui.M()
			.title("Controls")
			.position("center")
			.content(
				"<button id='open-assets-manager'>open-assets-manager</button>"+
			"<br><button id='open-pixel-editor'>open-pixel-editor</button>"
			).$("#open-assets-manager",function($e){
				$e.onclick = function(e){
					am.show();
				};
			}).$("#open-pixel-editor",function($e){
				$e.onclick = function(e){
					new PixelEditor(gui);
				};
			});
	};
	var mainScreenTurnOff = function(){
		mainScreen.close();
		mainScreen=false;
	};
	addEventListener('keydown',function(e){
		if(e.keyCode===27){
			if(mainScreen){
				mainScreenTurnOff();
			}else{
				mainScreenTurnOn();
			}
		}
	});
//})();

//var px = new PixelEditor(gui);
