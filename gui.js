

function Modal(_gui){
	var gui=_gui||window.gui;
	if(!gui.element || !gui.element instanceof HTMLElement){
		console.warn("gui.element not initialized. Creating the default overlay.",gui.element);
		gui.overlay();
	}
	var that=this;
	gui.modals.push(this);
	this.modals=[];
	
	this.$m=document.createElement("div"); this.$m.className="modal";
	this.$c=document.createElement("div"); this.$c.className="content";
	this.$tb=document.createElement("div"); this.$tb.className="titlebar";
	this.$t=document.createElement("span"); this.$t.className="title";
	this.$x=document.createElement("span"); this.$x.className="close-x";
	
	this.$tb.appendChild(this.$t);
	this.$tb.appendChild(this.$x);
	this.$m.appendChild(this.$tb);
	this.$m.appendChild(this.$c);
	gui.element.appendChild(this.$m);
	
	this.$m.style.zIndex=++gui.z;
	this.$m.style.opacity=0;
	setTimeout(function(){
		that.$m.style.opacity=1;
	},1);
	
	this.x=0;
	this.y=0;
	this.ox=0;
	this.oy=0;
	this.className="";
	
	this.onmove=null;
	this.onclose=null;
	
	var windowMouseMove=function(e){that.position(e.clientX-that.ox,e.clientY-that.oy);};
	var bringToFront=function(e){
		that.$m.style.zIndex=++gui.z;
	};
	var prevent=function(e){
		e.preventDefault();
	};
	var xClick=function(e){
		if(e.button!==0)return;
		that.close(true);
	};
	var xMouseDown=function(e){
		that.$m.className=(that.className+" modal").trim();
		that.ox=0;
		that.oy=0;
		removeEventListener('mousemove', windowMouseMove, true);
	};
	var tbMouseDown=function(e){
		if(e.button!==0)return;
		e.preventDefault();
		that.$m.className=(that.className+" modal dragging").trim();
		that.ox=e.clientX-that.$m.offsetLeft;
		that.oy=e.clientY-that.$m.offsetTop;
		addEventListener('mousemove', windowMouseMove, true);
	};
	var mouseUp=function(e){
		that.$m.className=(that.className+" modal").trim();
		that.ox=0;
		that.oy=0;
		removeEventListener('mousemove', windowMouseMove, true);
	};
	addEventListener('mouseup', mouseUp, true);
	this.$tb.addEventListener('mousedown', tbMouseDown, true);
	this.$m.addEventListener('mousedown', bringToFront, true);
	this.$m.addEventListener('contextmenu', prevent, true);
	this.$x.addEventListener('click', xClick, true);
	this.$x.addEventListener('mousedown', xMouseDown, true);
	
	this.position=function(x,y){
		if(typeof x!=="undefined"){
			if(typeof x=="string"){
				var thoust=this;
				setTimeout(function(){
					var gw=gui.element.clientWidth;
					var gh=gui.element.clientHeight;
					var mw=thoust.$m.scrollWidth;
					var mh=thoust.$m.scrollHeight;
					if(x=="random"){
						thoust.x=10+Math.random()*(gw-mw-20);
						thoust.y=10+Math.random()*(gh-mh-20);
					}else if(x=="bounds"){
						thoust.x=Math.min(Math.max(thoust.x,10),gw-mw-10);
						thoust.y=Math.min(Math.max(thoust.y,10),gh-mh-10);
					}else{
						if(x.match(/top|bottom|center/)) thoust.x=gw/2-mw/2;
						if(x.match(/left|right|center/)) thoust.y=gh/2-mh/2;
						if(x.match(/top/)) thoust.y=10;
						if(x.match(/bottom/)) thoust.y=gh-mh-10;
						if(x.match(/left/)) thoust.x=10;
						if(x.match(/right/)) thoust.x=gw-mw-10;
					}
					thoust.$m.style.left=(thoust.x-thoust.ox)+"px";
					thoust.$m.style.top=(thoust.y-thoust.oy)+"px";
					this.onmove&&this.onmove();
				},1);
			}else{
				if(x)this.x=x;
				if(y)this.y=y;
				this.$m.style.left=(this.x)+"px";
				this.$m.style.top=(this.y)+"px";
				this.onmove&&this.onmove();
			}


			return this;
		}
		return {x:this.x,y:this.y};
	};
	this.content=function(html){
		if(typeof html=="string"){
			this.$c.innerHTML=html;
			return this;
		}else if(html instanceof HTMLElement){
			this.$c.appendChild(html);
		}
		return this.$c.innerHTML;
	};
	this.title=function(text){
		if(typeof text=="string"){
			if(text===""){
				text="`";
			}
			this.$t.textContent=text;
			return this;
		}
		return this.$t.textContent;
	};
	this.resizable=function(bool){
		//WARNING: this method doesn't really work and does weird shit!
		if(bool===undefined)bool=true;
		//this.$c.style.resize = bool?"both":"none"; 
		//this.$c.style.overflow = bool?"auto":"default";
		this.$c.className = "content"+(bool?" resizable":"");
		
		var resizeTimer = 0;
		this.$c.onresize = function(){
			this.$m.className = "modal dragging resizing";
			if(resizeTimer)
				clearTimeout(resizeTimer);
		
			resizeTimer = setTimeout(function(){
				this.$m.className = "modal reset";
			}, 500);
		};
		return bool;
	};
	this.closeable=function(bool){
		if(bool===undefined)bool=true;
		this.$x.style.display = (bool?"":"none");
		
		return bool;
	};
	this.close=function(useEvent){
		if(useEvent && this.onclose && !this.onclose()) return;
		
		removeEventListener('mouseup', mouseUp, true);
		this.$tb.removeEventListener('mousedown', tbMouseDown, true);
		this.$m.removeEventListener('mousedown', bringToFront, true);
		this.$m.removeEventListener('contextmenu', prevent, true);
		this.$x.removeEventListener('click', xClick, true);
		this.$x.removeEventListener('mousedown', xMouseDown, true);
	
		var $m=this.$m;
		$m.classList.add("closing");
		$m.style.webkitTransition="all .3s ease-out";
		$m.style.opacity="0";
		$m.style.webkitTransform="scale(0.9)";
		
		setTimeout(function(){
			$m.parentElement&&$m.parentElement.removeChild($m);
		},5100);
		gui.modals.splice(gui.modals.indexOf(this),1);
		return $m;
	};
	/*this.style=function(css){
		this.$c.style.cssText=css;
	};*/
	this.finishAnimating=function(){
		this.$m.style.webkitTransition="none";
		this.$m.style.transition="none";
		var thoust=this;
		setTimeout(function(){
			thoust.$m.style.webkitTransition="opacity, left, right .2s ease-in-out";
			thoust.$m.style.transition="opacity, left, right .2s ease-in-out";
			thoust.$m.style.opacity=1;
		},50);
		return this;
	};
	this.setClassName=function(cn){
		if(typeof cn=="string"){
			this.className=cn;
			return this;
		}else throw new TypeError("String");
	};
	
	this.$=function(q,f){
		q=this.$m.querySelector(q);
		if(f){
			f(q);
			return this;
		}
		return q;
	};
	this.$$=function(q,f){
		q=this.$m.querySelectorAll(q);
		if(f){
			for(i=0;i<q.length;i++){
				f(q[i]);
			}
			return this;
		}
		return q;
	};
	return this;
}

GUI = function(){
	var gui={
		element: null,
		modals: [],
		z: 1337,
		overlay: function(){
			this.element = document.createElement("div");
			document.body.appendChild(this.element);
			this.element.id = "gui-overlay";
		},
		err: function(err, _url, _line){
			/*eg:
			try{foo();bar("baz");}catch(e){gui.err(e);}
			window.onerror=function(err,url,line){gui.err(err,url,line);};
			*/
			if(!err){
				err = new Error("Error, no error, :(?idk!:.");
			}
			var lineNumber = _line || err.lineNumber;
			var fileName = _url || err.fileName;
			var name = err.name || "Error";
			var message = err.message || err;
			if(typeof message !== "string"){
				message = "Additionally, an error occured when trying to display the error. idfk";
			}
			
			var mb=new Modal();
			mb.position("center");
			if(lineNumber && fileName){
				mb.title(name+" in "+fileName+" on line "+lineNumber);
			}else{
				mb.title(name);
			}
			mb.content(message.toString().replace("\n","<br>")+"<br><button class='ok'>OK</button><button class='not-ok'>NOT OK</button>");
			mb.$(".ok").focus();
			mb.$(".ok").onclick=function(){
				mb.close();
			};
			mb.$(".not-ok").onclick=function(){
				mb.close();
			};
			return mb;
		},
		msg: function(title,content,_callback){
			if(!content){
				content=title;
				title="Message";
			}
			content=content.toString().replace("\n","<br>");
			var mb=new Modal();
			mb.position("center");
			mb.title(title);
			mb.content(content+"<br><button class='ok'>OK</button>");
			mb.$(".ok").focus();
			mb.$(".ok").onclick=function(){
				mb.close();
				if(_callback)_callback();
			};
			return mb;
		},
		yn: function(title,content,callback){
			if(!content){
				content=title;
				title="Question";
			}
			content=content.toString().replace("\n","<br>");
			var mb=new Modal();
			mb.position("center");
			mb.title(title);
			mb.content(content+"<br><button class='yes'>Yes</button><button class='no'>No</button>");
			mb.$(".yes").focus();
			mb.$(".yes").onclick=function(){
				mb.close();
				callback(true);
			};
			mb.$(".no").onclick=function(){
				mb.close();
				callback(false);
			};
			return mb;
		},
		confirm: function(title,content,callback){
			if(!callback){
				callback=content;
				content=title;
				title="Confirm";
			}
			content=content.toString().replace("\n","<br>");
			var mb=new Modal();
			mb.position("center");
			mb.title(title);
			mb.content(content+"<br><button class='ok'>OK</button><button class='cancel'>Cancel</button>");
			mb.$(".ok").focus();
			mb.$(".ok").onclick=function(){
				mb.close();
				callback(true);
			};
			mb.$(".cancel").onclick=function(){
				mb.close();
				//callback(false);
			};
			return mb;
		},
		prompt: function(title,defaultString,callback){
			var mb=new Modal();
			mb.position("center");
			mb.title(title);
			mb.content("<input type=text value='"+defaultString+"'><br><button class='ok'>OK</button>");
			mb.$("input").focus();
			mb.$("input").onkeypress=function(e){
				var val=mb.$("input").value;
	
				if(e.keyCode===13){
					mb.close();
					callback(val);
				}
			};
			mb.$(".ok").onclick=function(){
				var val=mb.$("input").value;
	
				mb.close();
				callback(val);
			};
			return mb;
		}
	};
	gui.overlay();
	gui.M = function(o){
		var m=new Modal(gui);
		return m;
	};
	return gui;
};
/*

GUI = function(){
	var gui = this;
	gui.modals = [];
	gui.M = function(o, _gui){
		_gui = _gui || gui;
		var m = {
			x: 90,
			y: 90,
			w: 200,
			h: 200,
			title: "Modal",
			
			parent: _gui,
			modals: [],
			
			canvas: document.createElement("canvas"),
			drawM: function(ctx){
				ctx.save();
				
				var b = 5, th = (_gui==gui?20:16);
				ctx.fillStyle="rgba(0,0,0,1)";
				ctx.fillRect(this.x,this.y-th,this.w,this.h+th);
				ctx.strokeStyle="rgba(255,255,255,0.6)";
				ctx.strokeRect(this.x-b,this.y-th-b,this.w+b+b,this.h+th+b+b);
				
				ctx.font = th-2+"px Arial";
				ctx.textBaseline = "bottom";
				ctx.fillStyle="rgba(255,255,255,0.6)";
				ctx.fillText(this.title,this.x,this.y-3);
				
				if(this.canvas.width!=this.w)this.canvas.width=this.w;
				if(this.canvas.height!=this.h)this.canvas.height=this.h;
				ctx.save();
				this.draw();
				ctx.restore();
				for(var i=0;i<this.modals.length;i++){
					var m=this.modals[i];
					m.mouse={
						x: this.mouse.x-m.x,
						y: this.mouse.y-m.y,
						d: this.mouse.d,
						prev: {
							x: m.mouse.x,
							y: m.mouse.y,
							prev: {
								x: m.mouse.prev.x,
								y: m.mouse.prev.y,
							}
						}
					};
					m.drawM(this.ctx);
					m.mouse.leftClicked=false;
				}
				ctx.drawImage(this.canvas,this.x,this.y);
				
				ctx.restore();
			},
			draw: function(){
				var x=this.ctx;
				x.clearRect(0,0,this.w,this.h);
				x.fillStyle="rgba(255,255,0,"+Math.sin(this.x/50)+")";
				x.fillRect(50,50,50,50);
				x.fillRect(0,0,50,50);
			},
			close: function(force){
				if(!force){
					if(this.onbeforeunload){
						if(!this.onbeforeunload()){
							return;
						}
					}
				}
				if(!this.parent.modals)throw new Error("PARENT HATH NO MODALS");
				this.parent.modals.splice(this.parent.modals.indexOf(this),1);
			},
			onbeforeclose: null,
		};
		m.mouse={x:-1,y:-1};
		m.mouse.prev={x:-1,y:-1};
		m.mouse.prev.prev={x:-1,y:-1};
		m.ctx = m.canvas.getContext("2d");
		m.ctx.mozImageSmoothingEnabled=false;
		m.ctx.webkitImageSmoothingEnabled=false;
		
		if(o instanceof String){
			m.title=o;
		}else if(o instanceof Object){
			for(var i in o){
				m[i]=o[i];
			}
		}
		_gui.modals.push(m);
		return m;
	};
	gui.draw = function(ctx){
		for(var i=0;i<gui.modals.length;i++){
			var m=gui.modals[i];
			m.mouse={
				x: gui.mouse.x-m.x,
				y: gui.mouse.y-m.y,
				left: gui.mouse.left,
				leftClicked: gui.mouse.leftClicked,
				prev: {
					x: m.mouse.x,
					y: m.mouse.y,
					prev: {
						x: m.mouse.prev.x,
						y: m.mouse.prev.y,
					}
				}
			};
			var mom = m.mouse.x>0 && m.mouse.y>0 && m.mouse.x<m.w && m.mouse.y>m.h;
			m.mouse.leftClicked &= mom;
			//gui.mouse.leftClicked &= !mom;
			m.drawM(ctx);
		}
	};
	gui.mouse={x:-1,y:-1,left:0,leftClicked:0};
	gui.mouse.prev={x:-1,y:-1,left:0,leftClicked:0};
	gui.mouse.prev.prev={x:-1,y:-1,left:0,leftClicked:0};
	addEventListener("mousemove",function(e){
		gui.mouse.x=e.clientX;
		gui.mouse.y=e.clientY;
	});
	addEventListener("mousedown",function(e){
		gui.mouse.leftClicked=1;
		gui.mouse.left=1;
	});
	addEventListener("mouseup",function(e){
		gui.mouse.leftClicked=0;
		gui.mouse.left=0;
	});
};
*/

