(function(){

var testrunner = function(jQuery, _, rRDFj, testdata){

jQuery(function($){

var d = rRDFj(testdata)
module("Filter")

test('get1-form-elem', function(){
    var actual = {}
    var expected = {}
    deepEqual( actual, expected, '' )
})

}) // end of jQuery(run 

} // end testrunner def.

if ( typeof define === "function" && define.amd != null) {
    // AMD-loader compatible resource declaration
    define(['jquery', 'underscore', 'rrdfj', 'testdata'], function($, _, rRDFj, testdata){return testrunner($, _, rRDFj, testdata) } )
} else {
    // global-polluting outcome.
    var undef
    , deps = ['jQuery','test_data_object','_','rRDFj']
    for (var depid in deps ){
    	if(this[deps[depid]] === undef) throw new Error("Dependency missing: "+ deps[depid]) 
    }
    testrunner(this.jQuery, this._, this.rRDFj, this.test_data_object)
}

}).call(typeof window !== 'undefined'? window : this)