/* @license
Copyright (c) 2012 WIllow Systems Corporation (www DOT willow-systems DOT com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function(){
	var window = this // don't expect window to be global.
	
	var rRDFjInitializer = function(Underscore){
	
		var _ = Underscore
		// .ValueFor(PredicateName, DefaultValue) method.
		// Always returns an array distinct values from all objects, even when no predicate
		// and no items in rRDFj object collection.. 
		// DefaultValue can be an array of any shape, or anything really. Null will work.
		// DefaultValue is returned back BY REFERENCE, not a copy.
		// Will pass that through in only one case: No object in collection has that Predicate
		// OPerates on top of a triple collection (rRDFjObj). Looks into each object in the
		// collection and pulls value for each predicate.
		// WARNING: Value data will be flatten'ed and distinct'ed .
		, rRDFjResultSetObjectGetValueForMethod = function(PredicateName, DefaultValue){
			var data = this
			, answer = []
			, tmp
			// get array of values 
			// flatten, distinct
			_.each(
				data
				, function(value, id){
					tmp = this[id][PredicateName]
					
					if (tmp !== null) {
						answer.push(tmp)
					}
				}
				, data)
			if (answer.length === 0){
				return DefaultValue
			} else {
				return _(answer).chain().flatten().uniq().value()
			}
		}
		// .ForEach() Method
		// It calls forEach-compatible callback for each element in the colleciton.
		// 'this' within the callback is the triples data Object
		// Example callback:
		//   function(prop_vals_obj, ID, list){var data = this; prop_vals_obj.newproperty = 'newvalue'})
		// always return reference to 'this' to allow chaining 
		, rRDFjResultSetObjectForEachMethod = function(callback){
			var data = this
			_.each(data, callback, data)
			return this
		}
		
		// .Map() Method
		// Allows one to extract data from triple-set to array of custom values 
		// Takes in forEach-compatible 
		, rRDFjResultSetObjectMapMethod = function(callback){
			var data = this
			return _.map(data, callback, data)
		}
		
		// returns result set object with subset of triples matching the filter criteria
        // described in the filterobj, which can be (a) list of IDs, (b) single id (String), (c) Object
		// containing a set of triples, or (d) function returning truthy answer for elements to 
        // be chosen for inclusion in the resultset (format is similar to 
		// Object is treated like an array: Keys are extracted and become filter list. 
        // This is useful for extracting an intersection of two datasets.
		// filterobj in function form is compatible with JavaScript's forEach callback
		// function(predicate_collection_object, object_id, object_id_list){
		//   var dataObject = this
		//   // predicate_collection_ojbject == dataObject[object_id]
		//   return true if this object is to be chosen, false if you don't want it.
		// }
        // In case of list, or single string - we treat those as IDs and pull the objects with those IDs
		, rRDFjResultSetObjectFilterMethod = function(filterobj){
			var data = this 
			, output = {}
			, callback
			
			if(filterobj == null){
				return output
			} else if (typeof filterobj === 'function'){
				callback = filterobj
			} else if (_.isArray(filterobj)){
				callback = function(values, object_id){
					// var data = this
					return _.indexOf(filterobj, object_id) > -1 // found = true, not = false
				}
			} else if (typeof filterobj === 'object'){
				var wewantthese = _.keys(filterobj).sort()
				callback = function(values, object_id){
					// var data = this
					return _.indexOf(wewantthese, object_id, true) > -1 // found = true, not = false
				}
			} else {
				// we don't know what filterobj is, let's try brute force:
				var tmp = this[filterobj]
				if(tmp === null){
					return {}
				} else {
					output[filterobj] = tmp
					return output
				}
			}

			_.each(data, function(value, id, list){
				if ( callback.call(this, value, id, list) ) {
					output[id] = this[id]
				}
			}, data)
			return output
		}

		// .Single() method.
		, rRDFjResultSetObjectSingleMethod = function(defaultObject){
			var keys = _.keys(this)
				// data = this 
			if (keys.length === 0){
				return (defaultObject == null)? {} : defaultObject
			} else {
				return this[keys[0]]
			}
		}

		, rRDFjObj = function(data){
			var me = this
			, classconstructor = this.constructor
			
			this.data = data
			this.filter = function(filterobj){ return new classconstructor(rRDFjResultSetObjectFilterMethod.call(me.data, filterobj)) }
			this.each = function(callback){ rRDFjResultSetObjectForEachMethod.call(me.data, callback); return me }
			this.single = function(defaultValue){ return rRDFjResultSetObjectSingleMethod.call(me.data, defaultValue)}
			this.valuesfor = function(predicate){ return rRDFjResultSetObjectGetValueForMethod.call(me.data, predicate)} 
			this.map = function(callback){ return rRDFjResultSetObjectMapMethod.call(me.data, callback)} 
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
