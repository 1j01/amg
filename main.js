
TS = 32;

//(function(_main_){
	var canvas = document.querySelector("canvas");
	var mainctx = canvas.getContext("2d");
	addEventListener('contextmenu',function(e){return!!e.preventDefault()});
	//addEventListener('mousedown',function(e){return!!e.preventDefault()});
	var editing = true;
	
	var gui = new GUI();
	
	var u, le, game;
	
	var aa = new ArtAssets(mainctx, whenceBeAssetsLoaded, whenceAnUpdateDothForsooth);
	var am = new ArtManager(aa, gui);
	var tileselector;
	
	function whenceAnUpdateDothForsooth(){
		am.update();
	}
	function whenceBeAssetsLoaded(){
		console.log("Assets loaded.");
		am.update();
		try{
			u = new Universe(mainctx);
			var room = new Room("starting area",2,2,38/2,24/2,aa);
			room.rows[6][5]={
				sprite: "platformertiles",
				spriteX: 3, spriteY:0
			};
			u.addRoom(room);
			var room2 = new Room("small area",48/2,14/2,10/2,20/2,aa);
			u.addRoom(room2);
			le = new LevelEditor(u, mainctx);
			game = new Game(u, mainctx);
			tileselector = new TileSelector(le, aa, gui);
		}catch(e){
			gui.M().title("Something didn't work!").content(e.message).position("bottom");
		}
	}
	var req = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
	if(req){
		var animate = function(){
			req(animate);
			step();
		};
		req(animate);
	}else{
		setInterval(step,1000/60);
	}
	
	function step(){
		if(canvas.width !=innerWidth ) canvas.width = innerWidth;
		if(canvas.height!=innerHeight) canvas.height= innerHeight;
		mainctx.clearRect(0,0,canvas.width,canvas.height);
		
		
		if(u)u.update(mainctx);
		if(le)le.update(editing);
		//game.update(editing);
		
		aa.drawProgress(mainctx);
	}
	
	var mainScreen = null;
	var mainScreenTurnOn = function(){
		mainScreen = gui.M()
		.title("Controls")
		.position("center")
		.content(
			"<button id='show-art-manager'>Show Art Asset Manager</button>"+
		"<br><button id='show-tile-selector'>Show Tile Selector</button>"+
		"<br><button id='open-pixel-editor'>Open Pixel Editor</button>"+
		"<br><button id='about'>About</button>"
		).$("#show-art-manager",function($e){
			$e.onclick = function(e){
				am.show();
			};
		}).$("#show-tile-selector",function($e){
			$e.onclick = function(e){
				if(tileselector){
					tileselector.show();
				}else{
					gui.msg("Loading","Wait for it...");
				}
			};
		}).$("#open-pixel-editor",function($e){
			$e.onclick = function(e){
				new PixelEditor(gui,null,function(img){
					console.log("window.unsaved = img.src;");
					window.unsaved = img.src;
				},function(img, shiftKey){
					window.open(img.src);
				});
			};
		}).$("#about",function($e){
			$e.onclick = function(e){
				var m=gui.M().title("About").position("center").content(
					"<p>This is an abstracted modular game framework with integrated pixel editor and realtime asset manager and a level editor with dynamic block type definitions and a skeletal character animator and inverse kinematics and a game.</p>"
					+"<p>Well, so far just a pixel editor and realtime asset manager...</p>"
					+"<p>...</p>"
					+"<p><a href='https://github.com/1j01/amg'>It's on github.</a></p>"
				);
				m.$m.style.width="500px";
				m.$m.style.maxWidth="80vw";
				m.$c.style.maxHeight="80vh";
				m.$c.style.overflowY="auto";
				m.$c.style.overflowX="auto";
			};
		});
		mainScreen.onclose = function(){
			mainScreen=false;
			return true;
		};
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
	//var pe = new PixelEditor(gui,..?);
	mainScreenTurnOn();
//})();

