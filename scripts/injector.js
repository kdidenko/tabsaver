/**
 * @file: ${PREFIX}/scripts/propellerads.js
 * @description: Injects an IFRAME into the `activeTab` with some of PropellerAds
 * code for the better monetization performace which used to help in improving
 * the entire extension
 *
 * @see: https://developer.chrome.com/extensions/content_scripts#functionality
 * @see: https://publishers.propellerads.com/#/pub/sites/site/535875/zone/2382013/tag
 * @sice: v 1.2.1
 * @date: 02/09/2019
 */
'use strict';

/**
 * @const with the PropellerAds push notification script
 * {@url: //pushqwer.com/ntfc.php?p=2382013} 
 */
const propellerAdsURL = "//pushqwer.com/ntfc.php?p=2382013";

/**
 * @class Injector's Singleton IIF
 * @description: a singleton object for injecting Ads powered IFRAME
 */
const Injector = (function Injector () {
 	/** @private some private code section */
 	const instance = null;

 	/**
 	 * Creates new or returns existin instance of {Injector} singleton
 	 * @return {Injector}
 	 */
 	function createInstance () {
 		return instance === null ? new Injector() : instance;
 	}

 	/** @public public section begins */
 	return {
 		/**
 		 * Main singleton method for instantiating an instance of the class
 		 * @returns {Injector} instance
 		 */
  		getInstance: () => {
 			//TODO: log to Google Analytics account
 			return createInstance();
 		},
 		/**
 		 * Injects the PropellerAds push notifications script into a separate IFRAME
 		 * @returns {HTMLDocument} updated with the PropellerAds <script>
 		 */
 		injectAds: () => {
 			// loading push notification script'
 			console.log('loading push notification script');

 			const script = document.createElement('script');
 			document.head.appendChild(script);
 			
 			script.src = propellerAdsURL;
 			script.setAttribute('data-cfasync', 'false');
 			script.setAttribute('async', 'async');
 			
 			//TODO: log to Google Analytics account
 			console.log('finished injecting ads into activeTab');
 			console.log('PropellerAds PushNotification Injected');

 			return document;
 		}

 	}
 })();

console.log('injecting PropellerAds');
Injector.getInstance().injectAds();
