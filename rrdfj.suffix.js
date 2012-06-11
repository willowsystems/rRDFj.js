
		// code defining API goes above

		var rRDFjObj = function(data){
			var prop // undefined so far
			this.data = data === prop ? {} : data
			for (prop in API){
				if (API.hasOwnProperty(prop)) {
					this[prop] = API[prop]
				}
			}
		}
		
		return function(data){return new rRDFjObj(data)}
	} // end of rRDFjInitializer definition
	
	if ( typeof define === "function" && define.amd != null) {
		// AMD-loader compatible resource declaration
		define(['underscore'], function(_){return rRDFjInitializer(_)} )
	} else {
		// global-polluting outcome.
		if(window._ == null || window._.each == null || window._.map == null || window._.filter == null) {throw new Error("rRDFj requires Underscore.js for some of its functionality. Underscore is not detected. rRDFj Failing to initialize..."); return}
		window.rRDFj = rRDFjInitializer(window._)
	}

}).call(typeof window !== 'undefined'? window : this)
