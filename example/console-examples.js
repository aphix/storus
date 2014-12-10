//Open index.html and paste one of the following snippets into console to see how a Storus can be used.

/*
* Example 1: Fibonacci Sequence
*/

testStorus.new = 1;		//Assign one new value (pushing into Storus.all)
testStorus.new = 1; 	//Assign a second new value (pushing into the storus.all
testStorus.size = 10;	//Fix the size of the Storus.all to 10 elements in size

var updateSeq = function() {
	testStorus.new = testStorus.last+testStorus.next;	// Assign the next value as a sum of the prior and current values

	setTimeout(updateSeq,1500);
};

updateSeq();

/*
* Example 2: Random Waves Sequence (Should be visible at the bottom of the page)
*/

testStorus.new = 7;
testStorus.new = 11;
testStorus.size = 50;

$('body').append('<div id="waves" style="position:relative;width:500px;height:100px;"></div>');

var updateSeq = function() {
	var newValue = Math.random() * ((testStorus.last + testStorus.next + 1) / 2) * 1.618;
	var negative = (Math.random() < .5);

	if (negative)
		newValue *= -1;

	testStorus.new = Math.floor(testStorus.current + newValue * .618);

	$('#waves').append('<div class="wave" style="float:left; padding:0; position:relative; height:'+(testStorus.new+50)+'px; margin-top:'+(50-testStorus.new)+'px;width:10px;background:blue;"></div>');

	if ($('#waves .wave').length > testStorus.size)
		$('#waves .wave').eq(0).remove();

	setTimeout(updateSeq,100);
};

updateSeq();