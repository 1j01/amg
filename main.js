//(function(_main_){
	var canvas = document.querySelector("canvas");
	var mainctx = canvas.getContext("2d");
	addEventListener('contextmenu',function(e){return!!e.preventDefault()});
	//addEventListener('mousedown',function(e){return!!e.preventDefault()});
	
	var editing = true;
	var gui = new GUI();
	
	var aa = new ArtAssets(mainctx, whenceBeAssetsLoaded, whenceAnUpdateDothForsooth);
	var am = new ArtManager(aa, gui);
	
	var u = new Universe(mainctx);
	var room = new Room("starting area");
	u.addRoom(room);
	
	var le = new LevelEditor(u, mainctx);
	var game = new Game(u, mainctx);
	
	function whenceBeAssetsLoaded(){
		console.log("Assets loaded.");
		am.update();
	}
	function whenceAnUpdateDothForsooth(){
		am.update();
	}
	
	if(window.requestAnimationFrame){
		requestAnimationFrame(function animate(){
			requestAnimationFrame(animate);
			step();
		});
	}else{
		setTimeout(step,10);
	}
	
	function step(){
		if(canvas.width !=innerWidth ) canvas.width = innerWidth;
		if(canvas.height!=innerHeight) canvas.height= innerHeight;
		mainctx.clearRect(0,0,canvas.width,canvas.height);
		
		
		u.update(mainctx);
		/*
		le.update(editing);
		game.update(editing);
		*/
		
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
	}
	
	var mainScreen = null;
	var mainScreenTurnOn = function(){
		mainScreen = gui.M()
			.title("Controls")
			.position("center")
			.content(
				"<button id='show-art-manager'>Show Art Asset Manager</button>"+
			"<br><button id='open-pixel-editor'>Open Pixel Editor</button>"+
			"<br><button id='about'>About</button>"
			).$("#show-art-manager",function($e){
				$e.onclick = function(e){
					am.show();
				};
			}).$("#open-pixel-editor",function($e){
				$e.onclick = function(e){
					new PixelEditor(gui,null,function(){
						console.log("THIS ITS DEAD");
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
	//var pe = new PixelEditor(gui);
	mainScreenTurnOn();
//})();

