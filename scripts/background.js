/**
 * Executes the content script injecting the programmatically in order to display
 * 	some more Ads on user's activeTab
 * @see: https://developer.chrome.com/extensions/content_scripts#functionality
 * @see: https://publishers.propellerads.com/
 */
const injectAds = (() => {
	//TODO: replace hardcoded filename with the short variable and string template
	console.log('[background.js]: assigning handler to inject monetization ads into the active tab');
	return () => {
		console.log('[background.js]: injecting monetization ads through the active tab\'s content script');
    	chrome.tabs.executeScript(null, {file: "scripts/injector.js"});
   	}
})();

this.injectAds = injectAds;
