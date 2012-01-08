# rRDFj.js

This JavaScript library is a helper library making it easier to work with, parse, filter, extract data from rRDFj - "Reduced RDF as JSON" data format. 

For introduction to rRDFj (rRDFj-formatted triples object) see:
*   http://dvdotsenko.blogspot.com/2011/12/rdf-by-any-other-name-is-just-database.html
*   http://dvdotsenko.blogspot.com/2011/12/rdf-triples-from-sql.html

Because of the simplicity of the data storage format, the rRDFj triples can be parsed rather easily with JavaScript's Array.prototype.forEach and Object.keys(). However, helper libraries that assist in iteration over the data points, make the job of sqeezing data out of rRDFj less mandane. Underscore.js is one of those helpful libraries, providing useful iteration methods like .map(), .each(), filter(), sort(). This library builds on top of Underscore to provide most efficient iterative structures that work reliably on all platforms Underscore supports. This library provides further comfort to parsing rRDFj by making the flow chainable, jQuery-like experience.

## API

You start by encapsulating the dataset into the rRDFj object.

    var triples_data_object : {
        'Human_US_ID000-00-1111':{
            'Name': 'Joe Shmoe'
            , 'Friend': ['Human_US_ID000-00-9999','Dog_UUID000000000011']
        }
        'Human_US_ID000-00-9999':{
            'Type':'Type_ID01'
            , 'Name': 'Sue Shmoe'
            , 'Friend': 'Human_US_ID000-00-1111'
        }
        'Type_ID01':{
            'Label':'Human Female'
            , 'Description':'The prettier one. That one that is always right.'
        }
    }
    , d = rRDFj(triples_data_object)
   
The following methods become exposed to you on top of "d":

*   .data - a property that holds the actual triples Object. At the start it will be what you folded into rRDFj object.
    As you manipulate (filter) the set, .data will contain ref to that reduced / manipulated rRDFj-formatted triples Object.
    
    Usage examples:

        d.data['Human_US_ID000-00-9999'] == triples_data_object['Human_US_ID000-00-9999']
    
*   .filter(filter_object) - Returns result set object with subset of triples matching the filter criteria described in the filterobj, which can be (a) list of IDs, (b) single id (String), (c) Object containing a set of triples, or (d) function returning truthy answer for elements to  be chosen for inclusion in the resultset.
    Object is treated like an array: Keys are extracted and become filter list. This is useful for extracting an intersection of two datasets.
    Filterobj in function form is compatible with JavaScript's forEach callback:
        function(predicate_collection_object, object_id, object_id_list){
            var dataObject = this
            predicate_collection_ojbject == dataObject[object_id]
            return true if this object is to be chosen, false if you don't want it.
        }
    In case of list, or single string - we treat those as IDs and pull the objects with those IDs

    Usage examples:
    
        var name = d.filter('Human_US_ID000-00-9999').single({'Name':'No object found'})['Name']
        name == 'Sue Shmoe'
        
        var name = d.filter(function(predicates_values_object, objectid){
            // returning true for objects we want picked.
            return predicates_values_object['Type'] == 'Type_ID01'
        }).single({'Name':'No object found'})['Name']
        name == 'Sue Shmoe'
    
*   .each(callback) - calls forEach-compatible callback on each element in the colleciton.
    'this' within the callback is the triples data Object. Returns reference to 'this' to allow chaining 
    Example callback:
    
        function(prop_vals_obj, ID, list){var data = this; prop_vals_obj.newproperty = 'newvalue'})
        
    Usage examples:
    
        var names = []
        d.each(function(predicates_values_object, objectid){
            // .each does not returns results. it returns self. 
            // we need to alter what we want to alter here, inside the callback.
            var name = predicates_values_object['Name']
            if (name != null) { names.push(name) }
        })
        // names will contain ['Sue Shmoe', 'Joe Shmoe'] order is NOT guaranteed to be same.

*   .map(callback) - Applies an "extracting" function to each element in dataset collection and returns array of returned results.
    Callback is a function similar to that one taken by .each(), but it is expected to return some value that will be added to the array of results returned at the end of .map's run.

    Usage examples:
    
        var allfriends = d.map(function(predicates_values_object, objectid){
            // we return elements that will be added to resuting array.
            // there is no way to avoid returning something. Returning 'null' will add 'null' to result array.
            return predicates_values_object['Name']
        })
        // names will contain ['Sue Shmoe', 'Joe Shmoe', undefined] order is NOT guaranteed to be same.
        // undefined came from object with ID 'Type_ID01', which does not have property 'Name'

*   .valuesfor(propertyname) - Extracts that property's values from all objects in the dataset and retuns these as array.
    Because values can be arrays of elements, and some objects may not contain the property, doing this by hand may be monotonous.
    .valuesof() iterates over all objects, gets values into array, then flattens. If there are no properties with that name, we return an empty array. This function is a safe way to expect a simple, flat array of *unique* values back at all times, even when original values are multidimensional or do not exist.

    Usage examples:
    
        var allfriends = d.faluesfor('Friend')
        // allfriends will contain ['Human_US_ID000-00-9999','Dog_UUID000000000011', 'Human_US_ID000-00-1111']
        // order is NOT guaranteed to be same. All repetition of values will be prunned to single value. Values flattened.
    
*   .single(defaultValue) - Returns first available object's data object (JavaScript Object instance where keys are Predicates, and values are Values of those predicates) or defaultValue if no object is available in the set. This is essentially same as plucking value of triples_data[ID], but makes it easy to get some / any data object in a safe way, even when there are many objects to choose from, or no objects are available.

    Usage examples:
    
        var name = d.filter('This ID is not in data set').single({'Name':'No object found'})['Name']
        name == 'No object found'

See tests for more examples.

## Adding rRDFj.js to your page

The library can be pulled into the page as regular script:

	<script src="path/to/rrdfj.js"></script>

Or as AMD-compatible module:

    require(['rrdfj'], function(rRDFj){
        var d = rRDFj(mydataobject)
        ...
    })

## License, Copyright

[MIT License](http:www.opensource.org/licenses/mit-license.php)

See source header for full and most current Copyright attributions.
