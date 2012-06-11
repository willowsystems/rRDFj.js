// .ValueFor(PredicateName, DefaultValue) method.
// Always returns an array distinct values from all objects, even when no predicate
// and no items in rRDFj object collection.. 
// DefaultValue can be an array of any shape, or anything really. Null will work.
// DefaultValue is returned back BY REFERENCE, not a copy.
// Will pass that through in only one case: No object in collection has that Predicate
// OPerates on top of a triple collection (rRDFjObj). Looks into each object in the
// collection and pulls value for each predicate.
// WARNING: Value data will be flatten'ed and distinct'ed .
var rRDFjResultSetObjectGetValueForMethod = function(PredicateName, DefaultValue){
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
var rRDFjResultSetObjectForEachMethod = function(callback){
	var data = this
	_.each(data, callback, data)
	return this
}

// .Map() Method
// Allows one to extract data from triple-set to array of custom values 
// Takes in forEach-compatible 
var rRDFjResultSetObjectMapMethod = function(callback){
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
var rRDFjResultSetObjectFilterMethod = function(filterobj){
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
			return _.indexOf(filterobj, object_id) !== -1 // found = true, not = false
		}
	} else if (typeof filterobj === 'object'){
		var wewantthese = _.keys(filterobj.data != null? filterobj.data : filterobj).sort()
		callback = function(values, object_id){
			// var data = this
			return _.indexOf(wewantthese, object_id, true) !== -1 // found = true, not = false
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
var rRDFjResultSetObjectSingleMethod = function(defaultObject){
	var keys = _.keys(this)
		// data = this 
	if (keys.length === 0){
		return (defaultObject == null)? {} : defaultObject
	} else {
		return this[keys[0]]
	}
}

API.filter = function(filterobj){ return new this.constructor(rRDFjResultSetObjectFilterMethod.call(this.data, filterobj)) }
API.each = function(callback){ rRDFjResultSetObjectForEachMethod.call(this.data, callback); return this }
API.single = function(defaultValue){ return rRDFjResultSetObjectSingleMethod.call(this.data, defaultValue)}
API.valuesfor = function(predicate){ return rRDFjResultSetObjectGetValueForMethod.call(this.data, predicate)}
API.map = function(callback){ return rRDFjResultSetObjectMapMethod.call(this.data, callback)}
