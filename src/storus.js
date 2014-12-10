;(function(){
	function Storus() {
		var _this = this;

		_this._value = undefined;
		_this._fixedSize = undefined;
		_this._hasFixedSize = false;
		_this._changes = [];
		_this._cursor = 0;

		var args = Array.prototype.slice.call(arguments, 0);

		function assignValues(values) {
			values.forEach(function(val){
				_this.new = val;
			});
		}

		function removeOptionsArgument() {
			args = args.slice(1);
			removeOptionsArgument = function() {}; // Make sure this can't be called twice by assiging to a noop.
		}

		var setCursor = function() {};
		var setSize = function() {};

		if (objectTypes[typeof args[0]] && !Array.isArray(args[0])) {
			var options = args[0];

			if (options.hasOwnProperty('values')) {
				assignValues(options.values);
				removeOptionsArgument();
				if (args.length > 0) {
					throw new Error('Values cannot be assigned twice (options and trailing args).');
				}
			}
			if (options.hasOwnProperty('cursor')) {
				setCursor = function() {
					_this.cursor = options.cursor;
				};

				removeOptionsArgument();
			}
			if (options.hasOwnProperty('size')) {
				setSize = function() {
					_this.size = options.size;
				};
				removeOptionsArgument();
			}
		}

		if (!!args[0] && Array.isArray(args[0]) && args.length === 1) {
			assignValues(args[0]);
		} else if (!!args && args.length) {
			assignValues(args);
		}

		setSize();
		setCursor();
	};

	var decrement = function(self) {
		if (self.size === 0)
			return 0;

		self._cursor = (self._cursor > 0) ? self._cursor - 1 : self.size - 1;

		return self._cursor;
	};

	var increment = function(self) {
		if (self.size === 0)
			return 0;

		self._cursor = (self._cursor >= self.size - 1) ? 0 : self._cursor + 1;

		return self._cursor;
	};

	Storus.prototype = {
		get new() {
			return this._value;
		},
		set new(val) {
			if (this._hasFixedSize) {
				if (this.hasEmptyPosition) {
					this._changes[this.firstEmptyPosition] = val;
					increment(this);
				} else {
					this._changes[increment(this)] = val;
				}
			} else {
				this._changes.push(val);
				//TODO: Only increment when cursor is at tail
				increment(this);
			}


			this._value = val;
		},
		get cursor() {
			return this._cursor;
		},
		set cursor(index) {
			if (index === undefined || (index !== 0 && index > this.size-1) || index < 0)
				throw new Error('Invalid cursor index ('+index+'). Must be between 0 and '+this.size+' (current size).');

			this._cursor = index;
		},
		get all() {
			return this._changes;
		},
		get reverse() {
			return this.all.reverse();
		},
		get current() {
			return this.all[this.cursor];
		},
		get next() {
			return this.all[increment(this)];
		},
		get last() {
			return this.all[decrement(this)];
		},
		get firstEmptyPosition() {
			return this._changes.indexOf(undefined);
		},
		get hasEmptyPosition() {
			return (this.firstEmptyPosition > -1);
		},
		get fixedSize() {
			return this._hasFixedSize;
		},
		get size() {
			return this.all.length;
		},
		set size(newSize) {
			if (newSize < this.size)
				throw new Error('Cannot set fixed size ('+newSize+') less than current size ('+this.size+').');

			this._hasFixedSize = true;
			this._fixedSize = newSize;

			var emptySlots = this._fixedSize - this.size;
			var newValues = zeroes(emptySlots).map(function() { return undefined; });

			this._changes = this._changes.concat(newValues);
		}
	};

	function zeroes(size, value) {
		var array = [];

		for (var i=0; i<size; i++)
			array.push(0);

		return array.map(function() { return value });
	}

	Storus.prototype.nextFew = function(count) {
		var self = this;

		return zeroes(count).map(function() { return self.next });
	};

	Storus.prototype.lastFew = function(count) {
		var self = this;

		return zeroes(count).map(function() { return self.last });
	};

	var objectTypes = {
		'boolean': false,
		'function': true,
		'object': true,
		'number': false,
		'string': false,
		'undefined': false
	};

	var root = (objectTypes[typeof window] && window) || this;

	if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
		root.Storus = Storus;		//AMD/Require.js
		define(function() {
			return Storus;
		});
	} else if (objectTypes[typeof module] && module && module.exports) {
		module.exports = Storus;	//NodeJS
	} else {
		root.Storus = Storus;		//Browsers
	}

}.call(this));