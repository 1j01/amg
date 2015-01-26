
/// Manages block types/* and block properties.*/
// #disposable
(function(){
	
	var propertyTypes = {};
	function typedef(O){
		propertyTypes[O.name]=function(options){
			var o = {},i;for(i in O)o[i]=O[i];
			o.$prop = document.createElement("div");
			o.$prop.className = "property "+O.name;
			o.$ = function(q){
				return o.$prop.querySelector(q);
			};
			o.init(options);
			return o;
		};
	}
	typedef({
		name: "number",
		init: function(options){
			var html = "<input type='number' value='0'";
			if(options.min) html += 'min="'+options.min+'"';
			if(options.max) html += 'max="'+options.max+'"';
			if(options.step) html += 'step="'+options.step+'"';
			html += "/>";
			this.$prop.innerHTML = html;
			//this.$prop.innerHTML = "<input type='number' min='"+(options.min)+"' max='"+(options.max)+"' step='"+(options.step)+"'/>";
			this.$input = this.$("input");
		},
		getValue: function(){
			return this.$input.value;
		},
		setValue: function(value){
			this.$input.value = value;
		}
	});
	typedef({
		name: "text",
		init: function(options){
			this.$prop.innerHTML = "<input type='text'/>";
			this.$input = this.$("input");
		},
		getValue: function(){
			return this.$input.value;
		},
		setValue: function(value){
			this.$input.value = value;
		}
	});
	
	BlockTypeEditor = function(blocktype, gui){
		var be=this;
		be.m = this.m || gui.M();
		be.m.title("Block Type Editor").position("center left-ish? idk");
		be.m.onclose=function(){
			be.m=null;
			return true;
		};
		be.update = function(){
			if(!be.m)return false;
			be.m.$c.innerHTML="";
			/*be.m.$c.style.maxHeight="80vh";
			be.m.$c.style.minHeight="200px";
			be.m.$c.style.minWidth="265px";
			be.m.$c.style.overflowY="auto";
			be.m.$c.style.overflowX="hidden";*/
			for(var i in blocktype.properties){
				//var $prop=document.createElement("div");
				
				var p=blocktype.properties[i];
				if(p.type && propertyTypes[p.type]){
					var P = propertyTypes[p.type](p);
					be.m.$c.appendChild(P.$prop);
				}else{
					console.error(p.type, "not supported");
				}
			}
		};
		be.update();
		be.close = function(){
			be.m && be.m.close();
			be.m = null;
		};
	};
	
})();