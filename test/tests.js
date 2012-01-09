(function(){

var testrunner = function(jQuery, _, rRDFj, testdata){

jQuery(function($){

var d = rRDFj(testdata)

module("Filter")

// Need to test:
// 1. Single ID string
// 2. List of IDs
// 3. Object (intersection)
// 4. Function
// 5. Null (we get nothing)

test('Filter - Single ID', function(){
    var actual = d.filter('DenominationType.DenominationTypeID.3').data
    var expected = {'DenominationType.DenominationTypeID.3': testdata['DenominationType.DenominationTypeID.3'] }
    deepEqual( actual, expected, '' )
})
test('Filter - List of IDs', function(){
    var actual = d.filter(['DenominationType.DenominationTypeID.3','Merchant.Merchant_ID.100001']).data
    var expected = {
    	'DenominationType.DenominationTypeID.3': testdata['DenominationType.DenominationTypeID.3']
    	, 'Merchant.Merchant_ID.100001': testdata['Merchant.Merchant_ID.100001']
    }
    deepEqual( actual, expected, '' )
})
test('Filter - rRDFj object intersection', function(){
    var a = d.filter(['DenominationType.DenominationTypeID.3','Merchant.Merchant_ID.100001'])
    var b = d.filter(['DenominationType.DenominationTypeID.1','Merchant.Merchant_ID.100001'])
    var actual = a.filter(b).data
    var expected = {
    	'Merchant.Merchant_ID.100001': testdata['Merchant.Merchant_ID.100001']
    }
    deepEqual( actual, expected, '' )
})
test('Filter - fn', function(){
    var actual = d.filter(function(pvo, oid){return (pvo.Type == "FeeType" && pvo.FeeCategory == "VERIFY")}).data
    var expected = {
    	'FeeType.FeeTypeGUID.00000000-0000-0000-0000-0000A43BA5ED': testdata['FeeType.FeeTypeGUID.00000000-0000-0000-0000-0000A43BA5ED']
    	, 'FeeType.FeeTypeGUID.00000000-0000-0000-0000-00000000A046': testdata['FeeType.FeeTypeGUID.00000000-0000-0000-0000-00000000A046']
    }
    deepEqual( actual, expected, '' )
})

module("Each")

test('Each', function(){
 var actual = {}  
 d.each(function(pvo, oid){
	 if (pvo.Type === 'MerchantType') actual[oid] = pvo
 })
 var expected = {'Merchant.Merchant_ID.100001': testdata['Merchant.Merchant_ID.100001']}
 deepEqual( actual, expected, '' )
})

module("Map")

test('Map', function(){
 var actual = d.filter(function(pvo, oid){
	 return pvo.Type == 'DenominationType'
 }).map(function(pvo, oid){
	 return pvo.Label
 })
 var expected = ['USD','Ratio','Percent']
 deepEqual( actual, expected, '' )
})

module("Valuesfor")

test('valuesfor', function(){
 var actual = d.filter(function(pvo, oid){
	 return pvo.Type == 'DenominationType'
 }).valuesfor('Label')
 var expected = ['USD','Ratio','Percent']
 deepEqual( actual, expected, '' )
})

module("Single")

test('single - value present', function(){
 var actual = d.filter(function(pvo, oid){
	 return pvo.Type == 'DenominationType'
 }).single({'Label':'None found'}).Label
 var expected = ['USD','Ratio','Percent']
 ok( (_.indexOf(expected, actual) !== -1), '' )
})

test('single - value absent', function(){
 var actual = d.filter(function(pvo, oid){
	 return pvo.Type == 'Does not exist here'
 }).single({'Label':'None found'}).Label
 var expected = ['None found']
 equal( actual, expected, '' )
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