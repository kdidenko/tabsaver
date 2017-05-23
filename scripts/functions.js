/**
 * Common functions library
 * Version 1.0
 * Copyright (c) 2015 Kostyantyn Didenko. All rights reserved.
 * This software is distributed under GNU GPL v2 licence
 * For feedbacks and questions please feel free to contact me at kdidenko@gmail.com
 */

/**
 * An alias to test the variables and objects
 */
function isset(v) {	return (v != 'undefined' && v != '' && v != null); }


/**
 * Timer object for managing the flow when using asynchronous calls
 * @deprecated
 */
var timer = (function () {
	/**
	 * private flag to manage the flow - wait or continue
	 */
	var _wait = true;
	/**
	 * private default timeout for flow to wait = 5 seconds
	 */
	var _timeout = 5000;
	/**
	 * private flag to determine if timer is running or not
	 */
	var _running = false;
	/**
	 * return the timer object instance itself
	 */
	return {
		/**
		 * wait() for milliseconds specified
		 * @param timeout
		 * @return time waiting
		 */
		wait: function (timeout) {
			// set the timeout value
			_timeout = isset(timeout) && (timeout % 1 === 0) && (timeout > 0) ? timeout : _timeout;
			// rememebr when started
			var start = new Date().getTime();
			// set timer's state as running
			_running = true; 
			// wait until stopped or timout is reached 
			while (((new Date().getTime() - start) < _timeout) && _wait) { continue }
			// set timer's states as stopped
			_running = false;
			_wait = true;
			// return how much time waited
			alert('stopped in : ' + (new Date().getTime() - start) + 'ms.');
			return new Date().getTime() - start;
		},
		/**
		 * stop() waiting
		 */		
		stop: function () {
			if(_running) { alert('stopping'); _wait = false }
		}
	};
})();
