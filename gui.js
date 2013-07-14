

function Modal(_gui){
	var gui=_gui||window.gui;
	if(!gui.element || !gui.element instanceof HTMLElement){
		console.warn("gui.element not initialized. Creating the default overlay.",gui.element);
		gui.overlay();
	}
	var m=this;
	gui.modals.push(m);
	m.modals=[];
	
	m.$m=document.createElement("div"); m.$m.className="modal";
	m.$c=document.createElement("div"); m.$c.className="content";
	m.$tb=document.createElement("div"); m.$tb.className="titlebar";
	m.$t=document.createElement("span"); m.$t.className="title";
	m.$x=document.createElement("span"); m.$x.className="close-x";
	
	m.$tb.appendChild(m.$t);
	m.$tb.appendChild(m.$x);
	m.$m.appendChild(m.$tb);
	m.$m.appendChild(m.$c);
	gui.element.appendChild(m.$m);
	
	m.$m.style.zIndex=++gui.z;
	m.$m.style.opacity=0;
	setTimeout(function(){
		m.$m.style.opacity=1;
	},1);
	
	m.x=0;
	m.y=0;
	m.ox=0;
	m.oy=0;
	m.className="";
	
	m.onmove=null;
	m.onclose=null;
	
	var windowMouseMove=function(e){m.position(e.clientX-m.ox,e.clientY-m.oy);};
	var bringToFront=function(e){
		m.$m.style.zIndex=++gui.z;
		if(gui.active)gui.active.isActive=false;
		gui.active=m.onactivate?m.onactivate():m;
		gui.active.isActive=true;
	}; bringToFront();
	var prevent=function(e){
		e.preventDefault();
	};
	var xClick=function(e){
		if(e.button!==0)return;
		m.close(true);
	};
	var xMouseDown=function(e){
		m.$m.className=(m.className+" modal").trim();
		m.ox=0;
		m.oy=0;
		removeEventListener('mousemove', windowMouseMove, true);
	};
	var tbMouseDown=function(e){
		if(e.button!==0)return;
		e.preventDefault();
		m.$m.className=(m.className+" modal dragging").trim();
		m.ox=e.clientX-m.$m.offsetLeft;
		m.oy=e.clientY-m.$m.offsetTop;
		addEventListener('mousemove', windowMouseMove, true);
	};
	var mouseUp=function(e){
		m.$m.className=(m.className+" modal").trim();
		m.ox=0;
		m.oy=0;
		removeEventListener('mousemove', windowMouseMove, true);
	};
	addEventListener('mouseup', mouseUp, true);
	m.$tb.addEventListener('mousedown', tbMouseDown, true);
	m.$m.addEventListener('mousedown', bringToFront, true);
	m.$m.addEventListener('contextmenu', prevent, true);
	m.$x.addEventListener('click', xClick, true);
	m.$x.addEventListener('mousedown', xMouseDown, true);
	
	m.position=function(x,y){
		if(typeof x!=="undefined"){
			if(typeof x=="string"){
				setTimeout(function(){
					var gw=gui.element.clientWidth;
					var gh=gui.element.clientHeight;
					var mw=m.$m.scrollWidth;
					var mh=m.$m.scrollHeight;
					if(x=="random"){
						m.x=10+Math.random()*(gw-mw-20);
						m.y=10+Math.random()*(gh-mh-20);
					}else if(x=="bounds"){
						m.x=Math.min(Math.max(m.x,10),gw-mw-10);
						m.y=Math.min(Math.max(m.y,10),gh-mh-10);
					}else{
						if(x.match(/top|bottom|center/)) m.x=gw/2-mw/2;
						if(x.match(/left|right|center/)) m.y=gh/2-mh/2;
						if(x.match(/top/)) m.y=10;
						if(x.match(/bottom/)) m.y=gh-mh-10;
						if(x.match(/left/)) m.x=10;
						if(x.match(/right/)) m.x=gw-mw-10;
					}
					m.$m.style.left=(m.x-m.ox)+"px";
					m.$m.style.top=(m.y-m.oy)+"px";
					m.onmove&&m.onmove();
				},1);
			}else{
				if(x)m.x=x;
				if(y)m.y=y;
				m.x=Math.max(10,m.x);
				m.y=Math.max(10,m.y);
				m.x=Math.min(m.x,gui.element.clientWidth-70);
				m.y=Math.min(m.y,gui.element.clientHeight-25);
				m.$m.style.left=(m.x)+"px";
				m.$m.style.top=(m.y)+"px";
				m.onmove&&m.onmove();
			}
			return m;
		}
		return {x:m.x,y:m.y};
	};
	m.content=function(html){
		if(typeof html=="string"){
			m.$c.innerHTML=html;
			return m;
		}else if(html instanceof HTMLElement){
			m.$c.appendChild(html);
		}
		return m.$c.innerHTML;
	};
	m.title=function(text){
		if(typeof text=="string"){
			if(text===""){
				text="`";
			}
			m.$t.textContent=text;
			return m;
		}
		return m.$t.textContent;
	};
	m.resizable=function(bool){
		//WARNING: m method doesn't really work and does weird shit!
		if(bool===undefined)bool=true;
		//m.$c.style.resize = bool?"both":"none"; 
		//m.$c.style.overflow = bool?"auto":"default";
		m.$c.className = "content"+(bool?" resizable":"");
		
		var resizeTimer = 0;
		m.$c.onresize = function(){
			m.$m.className = "modal dragging resizing";
			if(resizeTimer)
				clearTimeout(resizeTimer);
		
			resizeTimer = setTimeout(function(){
				m.$m.className = "modal reset";
			}, 500);
		};
		return m;
	};
	m.closeable=function(bool){
		if(bool===undefined)bool=true;
		m.$x.style.display = (bool?"":"none");
		return m;
	};
	m.close=function(useEvent){
		if(useEvent && m.onclose && !m.onclose()) return;
		
		removeEventListener('mouseup', mouseUp, true);
		m.$tb.removeEventListener('mousedown', tbMouseDown, true);
		m.$m.removeEventListener('mousedown', bringToFront, true);
		m.$m.removeEventListener('contextmenu', prevent, true);
		m.$x.removeEventListener('click', xClick, true);
		m.$x.removeEventListener('mousedown', xMouseDown, true);
	
		var $m=m.$m;
		$m.classList.add("closing");
		$m.style.webkitTransition="all .3s ease-out";
		$m.style.opacity="0";
		$m.style.webkitTransform="scale(0.9)";
		
		setTimeout(function(){
			$m.parentElement&&$m.parentElement.removeChild($m);
		},5100);
		gui.modals.splice(gui.modals.indexOf(m),1);
		return $m;
	};
	/*m.style=function(css){
		m.$c.style.cssText=css;
	};*/
	m.finishAnimating=function(){
		m.$m.style.webkitTransition="none";
		m.$m.style.transition="none";
		setTimeout(function(){
			m.$m.style.webkitTransition="opacity, left, right .2s ease-in-out";
			m.$m.style.transition="opacity, left, right .2s ease-in-out";
			m.$m.style.opacity=1;
		},50);
		return m;
	};
	m.setClassName=function(cn){
		if(typeof cn=="string"){
			m.className=cn;
			return m;
		}else throw new TypeError("String");
	};
	
	m.$=function(q,f){
		q=m.$m.querySelector(q);
		if(f){
			f(q);
			return m;
		}
		return q;
	};
	m.$$=function(q,f){
		q=m.$m.querySelectorAll(q);
		if(f){
			for(i=0;i<q.length;i++){
				f(q[i]);
			}
			return m;
		}
		return q;
	};
	return m;
}

GUI = function(){
	var gui={
		element: null,
		modals: [],
		z: 1337,
		active: null,
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
			
			var mb=this.M();
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
			var mb=this.M();
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
			var mb=this.M();
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
			var mb=this.M();
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
			var mb=this.M();
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
	var gui = m;
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
				ctx.fillRect(m.x,m.y-th,m.w,m.h+th);
				ctx.strokeStyle="rgba(255,255,255,0.6)";
				ctx.strokeRect(m.x-b,m.y-th-b,m.w+b+b,m.h+th+b+b);
				
				ctx.font = th-2+"px Arial";
				ctx.textBaseline = "bottom";
				ctx.fillStyle="rgba(255,255,255,0.6)";
				ctx.fillText(m.title,m.x,m.y-3);
				
				if(m.canvas.width!=m.w)m.canvas.width=m.w;
				if(m.canvas.height!=m.h)m.canvas.height=m.h;
				ctx.save();
				m.draw();
				ctx.restore();
				for(var i=0;i<m.modals.length;i++){
					var m=m.modals[i];
					m.mouse={
						x: m.mouse.x-m.x,
						y: m.mouse.y-m.y,
						d: m.mouse.d,
						prev: {
							x: m.mouse.x,
							y: m.mouse.y,
							prev: {
								x: m.mouse.prev.x,
								y: m.mouse.prev.y,
							}
						}
					};
					m.drawM(m.ctx);
					m.mouse.leftClicked=false;
				}
				ctx.drawImage(m.canvas,m.x,m.y);
				
				ctx.restore();
			},
			draw: function(){
				var x=m.ctx;
				x.clearRect(0,0,m.w,m.h);
				x.fillStyle="rgba(255,255,0,"+Math.sin(m.x/50)+")";
				x.fillRect(50,50,50,50);
				x.fillRect(0,0,50,50);
			},
			close: function(force){
				if(!force){
					if(m.onbeforeunload){
						if(!m.onbeforeunload()){
							return;
						}
					}
				}
				if(!m.parent.modals)throw new Error("PARENT HATH NO MODALS");
				m.parent.modals.splice(m.parent.modals.indexOf(m),1);
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

