/**
 * Actual Google Analytics tracking code
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-49575781-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  //ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


/******************* Events tracking starts here *******************/

/**
 * Event listener to handle document onload
 */
document.addEventListener('DOMContentLoaded', function() {
	// add on dialog opened event
	_gaq.push(['_trackEvent', 'Dialogs', 'Main View', 'Opened']);
});