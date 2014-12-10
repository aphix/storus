var chai = require('chai');
var expect = chai.expect;

var Storus = require('../src/storus');

describe('Storus',function() {
	describe('when created with no arguments', function() {
		var storus;

		beforeEach(function() {
			storus = new Storus();
		});

		it('is an object',function() {
			expect(storus).to.be.an('object');
		});
		it('has all properties',function() {
			expect(storus).to.have.keys(['_changes','_cursor','_value','_fixedSize','_hasFixedSize']);
		});

		it('storus.all is of type array',function() {
			expect(Array.isArray(storus.all)).to.be.true;
		});

		it('storus.all is an empty array',function() {
			expect(storus.all).to.eql([]);
		});

		it('storus.reverse is of type array',function() {
			expect(Array.isArray(storus.all)).to.be.true;
		});

		it('storus.reverse is an empty array',function() {
			expect(storus.all).to.eql([]);
		});

		it('fixedSize is false',function() {
			expect(storus.fixedSize).to.equal(false);
		});

		describe('fixing size by', function() {
			describe('setting storus.size before inserting values', function() {
				var newSize = 4;

				beforeEach(function() {
					storus.size = newSize;
				});

				it('storus.size is the new array size',function() {
					expect(storus.size).to.equal(newSize);
				});

				it('storus.cursor is still 0',function() {
					expect(storus.cursor).to.equal(0);
				});

				it('fixedSize is true',function() {
					expect(storus.fixedSize).to.equal(true);
				});

				['all','reverse'].forEach(function(key) {
					describe('storus.'+key,function() {
						it('is the new array size',function() {
							expect(storus[key]).to.have.length(newSize);
						});

						it('contains an array with '+newSize+' undefined values',function() {
							expect(storus[key]).to.eql([
								undefined,
								undefined,
								undefined,
								undefined
							]);
						});
					});
				});
			});

			describe('after 1st assignment to storus.new', function(){
				beforeEach(function() {
					storus.new = 1;
					storus.size = 2;
				});

				describe('setting storus.size greater than current size', function(){
					it('fills in remaining slots with undefined',function() {
						expect(storus.all).to.eql([
							1,
							undefined,
						]);
					});

					it('cursor remains unchanged',function() {
						expect(storus.cursor).to.equal(0);
					});

					it('fixedSize is true',function() {
						expect(storus.fixedSize).to.equal(true);
					});

					describe('2nd assignment to storus.new',function() {
						beforeEach(function() {
							storus.new = 2;
						});
						it('increments cursor',function() {
							expect(storus.cursor).to.equal(1);
						});
						it('doesn\'t increase size',function() {
							expect(storus.size).to.equal(2);
						});
						it('inserts value into array',function() {
							expect(storus.all).to.eql([
								1,
								2,
							]);
						});

						describe('3nd assignment to storus.new',function() {
							beforeEach(function() {
								storus.new = 3;
							});
							it('increments cursor',function() {
								expect(storus.cursor).to.equal(0);
							});
							it('doesn\'t increase size',function() {
								expect(storus.size).to.equal(2);
							});
							it('overwrites value at index 0 (loops array forward)',function() {
								expect(storus.all).to.eql([
									3,
									2,
								]);
							});
						});
					});
				});
				describe('setting size less than current size', function(){
					var badSizeSetter = function() {
						storus.size =  0;
					};

					it('throws an error',function() {
						expect(badSizeSetter).to.throw(/Cannot set/);
					});
				});
			});
		});

		[{
			property: 'current',
			expectedValue: undefined
		},{
			property: 'new',
			expectedValue: undefined
		},{
			property: 'next',
			expectedValue: undefined
		},{
			property: 'last',
			expectedValue: undefined
		},{
			property: 'size',
			expectedValue: 0
		},{
			property: 'cursor',
			expectedValue: 0
		}].forEach(function(defaultObject){
			it('storus['+defaultObject.property+'] === '+defaultObject.expectedValue,function() {
				expect(storus[defaultObject.property]).to.equal(defaultObject.expectedValue);
			});
		});

		describe('when storus.new is first assigned', function() {
			var firstValue = 'First!';

			beforeEach(function() {
				storus.new = firstValue;
			});

			it('storus.new is new value',function() {
				expect(storus.new).to.equal(firstValue);
			});

			it('storus.cursor is still zero (initial index)',function() {
				expect(storus.cursor).to.equal(0);
			});

			it('storus.current is new value',function() {
				expect(storus.current).to.equal(firstValue);
			});

			it('storus.size increases to 1',function() {
				expect(storus.size).to.equal(1);
			});

			it('storus.all contains new value',function() {
				expect(storus.all).to.eql([firstValue]);
			});

			it('storus.reverse contains new value',function() {
				expect(storus.reverse).to.eql([firstValue]);
			});


			describe('2nd assignment to storus.new', function() {
				var secondValue = 'Second!';

				beforeEach(function() {
					storus.new = secondValue;
				});

				it('storus.new is 2nd value',function() {
					expect(storus.new).to.equal(secondValue);
				});

				it('storus.current is 2nd value',function() {
					expect(storus.current).to.equal(secondValue);
				});

				it('storus.cursor is 1 (2nd index)',function() {
					expect(storus.cursor).to.equal(1);
				});

				it('storus.size increases to 2',function() {
					expect(storus.size).to.equal(2);
				});

				it('storus.all contains both values',function() {
					expect(storus.all).to.eql([firstValue, secondValue]);
				});

				it('storus.reverse contains both values',function() {
					expect(storus.reverse).to.eql([secondValue, firstValue]);
				});
			});
		});
	});

	describe('when created with a single array argument', function() {
		var storus;
		var testArray = [1,2,3,4];

		beforeEach(function() {
			storus = new Storus(testArray);
		});

		it('storus.all is contains all values',function() {
			expect(storus.all).to.eql(testArray);
		});

		it('storus.reverse is contains all values',function() {
			expect(storus.reverse).to.eql([4,3,2,1]);
		});

		it('storus.current is 4th value in array',function() {
			expect(storus.current).to.eql(4);
		});

		it('storus.cursor is last index in array',function() {
			expect(storus.cursor).to.eql(3);
		});
	});

	describe('when created with a multiple value arguments', function() {
		var storus;

		beforeEach(function() {
			storus = new Storus(1, 2, 3, 4);
		});

		it('storus.all contains all values',function() {
			expect(storus.all).to.eql([1,2,3,4]);
		});

		it('storus.reverse contains all values',function() {
			expect(storus.reverse).to.eql([4,3,2,1]);
		});

		it('storus.current is 4th value in array',function() {
			expect(storus.current).to.equal(4);
		});

		it('storus.cursor is last index in array',function() {
			expect(storus.cursor).to.equal(3);
		});
	});

	describe('when created with a multiple array value arguments', function() {
		var storus;

		beforeEach(function() {
			storus = new Storus([1,2], [3,4], [5,6]);
		});

		it('storus.all is contains all values',function() {
			expect(storus.all).to.eql([[1,2], [3,4], [5,6]]);
		});

		it('storus.reverse is contains all values',function() {
			expect(storus.reverse).to.eql([[5,6], [3,4], [1,2]]);
		});

		it('storus.current is 4th value in array',function() {
			expect(storus.current).to.eql([5,6]);
		});

		it('storus.cursor is last index in array',function() {
			expect(storus.cursor).to.equal(2);
		});
	});

	describe('when created with a single options object', function() {
		var storus;

		describe('containing values and a cursor', function() {
			beforeEach(function() {
				storus = new Storus({values:[1,2,3],cursor:1});
			});

			it('storus.all is contains options.values',function() {
				expect(storus.all).to.eql([1,2,3]);
			});

			it('storus.cursor is specified cursor',function() {
				expect(storus.cursor).to.equal(1);
			});

			it('storus.current is value at index of options.cursor',function() {
				expect(storus.current).to.equal(2);
			});
		});

		describe('containing value, cursor, and size', function() {
			beforeEach(function() {
				storus = new Storus({values:[1,2,3],cursor:1,size:5});
			});

			it('storus.all is contains options.values',function() {
				expect(storus.all).to.eql([1,2,3,undefined,undefined]);
			});

			it('storus.cursor is specified cursor',function() {
				expect(storus.cursor).to.equal(1);
			});

			it('storus.current is value at index of options.cursor',function() {
				expect(storus.current).to.equal(2);
			});

			it('storus.size is value same as options.size',function() {
				expect(storus.size).to.equal(5);
			});
		});

		describe('cursor is outside of storus.size', function() {
			it('throws an error when greater than opts.size',function() {
				function badConstruction() {
					storus = new Storus({values:[1,1,1], cursor: 5, size: 4});
				};

				expect(badConstruction).to.throw(/cursor index/);
			});
			it('throws an error when larger than storus.size (opts.values)',function() {
				function badConstruction() {
					storus = new Storus({values:[1,1,1], cursor: 4});
				};

				expect(badConstruction).to.throw(/cursor index/);
			});
			it('throws an error when greater than storus.size (single value array)',function() {
				function badConstruction() {
					storus = new Storus({cursor: 4},[1,1,1]);
				};

				expect(badConstruction).to.throw(/cursor index/);
			});
			it('throws an error when greater than storus.size (single multi args array)',function() {
				function badConstruction() {
					storus = new Storus({cursor: 4},1,1,1);
				};

				expect(badConstruction).to.throw(/cursor index/);
			});
			it('throws an error when less than 0 (opts.values)',function() {
				function badConstruction() {
					storus = new Storus({values:[1,1,1], cursor: -2});
				};

				expect(badConstruction).to.throw(/cursor index/);
			});
			it('throws an error when less than 0 (single value array)',function() {
				function badConstruction() {
					storus = new Storus({cursor: -2},[1,1,1]);
				};

				expect(badConstruction).to.throw(/cursor index/);
			});
			it('throws an error when less than 0 (single multi args array)',function() {
				function badConstruction() {
					storus = new Storus({cursor: -2},1,1,1);
				};

				expect(badConstruction).to.throw(/cursor index/);
			});
		});

		describe('only containing values', function() {
			beforeEach(function() {
				storus = new Storus({values:[1,2,3]});
			});

			it('storus.all is contains options.values',function() {
				expect(storus.all).to.eql([1,2,3]);
			});

			it('storus.cursor is last index in values',function() {
				expect(storus.cursor).to.equal(2);
			});

			it('storus.current is value at last index of options.values',function() {
				expect(storus.current).to.equal(3);
			});
		});

		describe('only containing size and and trailing values', function() {
			beforeEach(function() {
				storus = new Storus({size:4},1,2,3);
			});

			it('storus.all is contains options.values',function() {
				expect(storus.all).to.eql([1,2,3,undefined]);
			});

			it('storus.cursor is index set to last assigned index',function() {
				expect(storus.cursor).to.equal(2);
			});

			it('storus.current is last assigned value',function() {
				expect(storus.current).to.equal(3);
			});

			it('storus.size is value set in options.size',function() {
				expect(storus.size).to.equal(4);
			});
		});

		describe('only containing cursor and and trailing values', function() {
			beforeEach(function() {
				storus = new Storus({cursor:1},1,2,3);
			});

			it('storus.all is contains options.values',function() {
				expect(storus.all).to.eql([1,2,3]);
			});

			it('storus.cursor is index set in options.cursor',function() {
				expect(storus.cursor).to.equal(1);
			});

			it('storus.current is value at index of options.cursor',function() {
				expect(storus.current).to.equal(2);
			});
		});

		describe('only containing cursor and and single trailing array', function() {
			beforeEach(function() {
				storus = new Storus({cursor:1},[1,2,3]);
			});

			it('storus.all is contains options.values',function() {
				expect(storus.all).to.eql([1,2,3]);
			});

			it('storus.cursor is index set in options.cursor',function() {
				expect(storus.cursor).to.equal(1);
			});

			it('storus.current is value at index of options.cursor',function() {
				expect(storus.current).to.equal(2);
			});
		});

		describe('only containing cursor and and multiple trailing arrays', function() {
			beforeEach(function() {
				storus = new Storus({cursor:1},[1,2,3],[4,5,6],[7,8,9]);
			});

			it('storus.all is contains options.values',function() {
				expect(storus.all).to.eql([[1,2,3],[4,5,6],[7,8,9]]);
			});

			it('storus.cursor is index set in options.cursor',function() {
				expect(storus.cursor).to.equal(1);
			});

			it('storus.current is value at index of options.cursor',function() {
				expect(storus.current).to.eql([4,5,6]);
			});
		});

		describe('containing values and trailing additional values', function() {
			it('throws an error',function() {
				function badConstruction() {
					storus = new Storus({values:[1,1,1]},[1,2,3]);
				};

				expect(badConstruction).to.throw(/assigned twice/);
			});
		});
	});

	describe('initially exists with 4 values [1,2,3,4]', function() {
		var storus;
		var testArray = [1,2,3,4];

		beforeEach(function() {
			storus = new Storus(testArray);
		});

		it('storus.cursor is 3',function() {
			expect(storus.cursor).to.equal(3);
		});

		it('storus.current is 4th value',function() {
			expect(storus.current).to.equal(4);
		});
		it('storus.next is 1st value',function() {
			expect(storus.next).to.equal(testArray[0]);
		});

		it('storus.last is 3rd value',function() {
			expect(storus.last).to.equal(3);
		});

		describe('storus.nextFew(2)',function() {
			it('returns 1st and 2nd values',function() {
				expect(storus.nextFew(2)).to.eql([1,2]);
			});
		});

		describe('storus.nextFew(8)',function() {
			it('returns inital array looped forward twice',function() {
				expect(storus.nextFew(8)).to.eql([1,2,3,4,1,2,3,4]);
			});
		});

		describe('storus.lastFew(2)',function() {
			it('returns 3rd and 2nd values',function() {
				expect(storus.lastFew(2)).to.eql([3,2]);
			});
		});

		describe('storus.lastFew(8)',function() {
			it('returns inital array looped backward twice',function() {
				expect(storus.lastFew(8)).to.eql([3,2,1,4,3,2,1,4]);
			});
		});

		describe('storus.last',function() {
			var updatedValue;
			it('called 1x returns 3rd value',function() {
				 updatedValue = storus.last;

				expect(updatedValue).to.equal(testArray[2]);
			});
			it('called 2x returns 2nd value',function() {
				updatedValue =  storus.last;
				updatedValue =  storus.last;

				expect(updatedValue).to.equal(testArray[1]);
			});
			it('called 3x returns 1st value',function() {
				updatedValue =  storus.last;
				updatedValue =  storus.last;
				updatedValue =  storus.last;

				expect(updatedValue).to.equal(testArray[0]);
			});
			it('called 4x returns 4th value',function() {
				updatedValue =  storus.last;
				updatedValue =  storus.last;
				updatedValue =  storus.last;
				updatedValue =  storus.last;

				expect(updatedValue).to.equal(testArray[3]);
			});
			it('called 5x returns 3rd value (loops array backward)',function() {
				updatedValue =  storus.last;
				updatedValue =  storus.last;
				updatedValue =  storus.last;
				updatedValue =  storus.last;
				updatedValue =  storus.last;

				expect(updatedValue).to.equal(testArray[2]);
			});
		});

		describe('storus.next',function() {
			var updatedValue;
			it('called 1x returns 1st value',function() {
				 updatedValue = storus.next;

				expect(updatedValue).to.equal(testArray[0]);
			});
			it('called 2x returns 2nd value',function() {
				updatedValue =  storus.next;
				updatedValue =  storus.next;

				expect(updatedValue).to.equal(testArray[1]);
			});
			it('called 3x returns 3rd value',function() {
				updatedValue =  storus.next;
				updatedValue =  storus.next;
				updatedValue =  storus.next;

				expect(updatedValue).to.equal(testArray[2]);
			});
			it('called 4x returns 4th value',function() {
				updatedValue =  storus.next;
				updatedValue =  storus.next;
				updatedValue =  storus.next;
				updatedValue =  storus.next;

				expect(updatedValue).to.equal(testArray[3]);
			});
			it('called 5x returns 1st value (loops array forward)',function() {
				updatedValue =  storus.next;
				updatedValue =  storus.next;
				updatedValue =  storus.next;
				updatedValue =  storus.next;
				updatedValue =  storus.next;

				expect(updatedValue).to.equal(testArray[0]);
			});
		});
	});
});