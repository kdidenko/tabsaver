/**
 * Actual Google Analytics tracking code
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-49575781-1']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://stats.g.doubleclick.net/dc.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();


/******************* Events tracking starts here *******************/

/**
 * Check whether new version is installed or extension is updated
 * @see: http://stackoverflow.com/questions/2399389/detect-chrome-extension-first-run-update
 */
chrome.runtime.onInstalled.addListener(function (details) {
    var m;
    if (details.reason == "install") {
        m = "Version " + chrome.runtime.getManifest().version + " of Extension installed";
        console.log(m);
        _gaq.push(['_trackEvent', 'Extension', 'State', m]);
    } else if (details.reason == "update") {
        m = "Extension updated from v" + details.previousVersion + " to v" + chrome.runtime.getManifest().version;
        console.log(m);
        _gaq.push(['_trackEvent', 'Extension', 'State', m]);
    }
});


/**
 * Event listener to handle document onload
 */
document.addEventListener('DOMContentLoaded', function () {
    // add on dialog opened event
    _gaq.push(['_trackEvent', 'Dialogs', 'Main View', 'Opened']);
});