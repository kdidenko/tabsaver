# <img src="https://github.com/kdidenko/tabsaver/blob/master/icons/icon-48.png?raw=true" alt="TabSaver"> TabSaver Development Docs

## Chrome Extension Content Script

In order to embedd the content script for always be loading during each user pageview,
the following snippet will be required:


````json
	/**
	 * @file: manifest.json
	 */	
	"content_scripts": [
	    {
	      "matches": ["<all_urls>"],
	      "js": ["scripts/injector.js"],
	      "run_at": "document_end"
	    }
 	],
````

## Appending Ads `<IFrame>`

Next method used to be implemented within the `Injector` singleton object located at `scripts/injector.js`:

````javascript
	 /**
	  * Injects the IFRAME element intp the bottotom of the `activeTab`
	  * @returns: {Error|HTMLDocument}
	  */
	function appendIFRAME () {
		//TODO: log to Google Analytics account
		// creating <iframe> element
		const iframe = document.createElement('iframe');
		document.body.appendChild(iframe);
		console.log("injecting iframe into the activeTab");

		// hack to avoid same domain policy
		iframe.src = 'javascript:void((function(){var script = document.createElement(\'script\');' +
	    'script.innerHTML = "(function() {' +
	    'document.open();document.domain=\'' + document.domain +
	    '\';document.close();})();";' +
	    'document.write("<head>" + script.outerHTML + "</head><body></body>");})())';
	    console.log('IFRAME has been injected');

		// return the element to continue building the doc
		return iframe.contentWindow.document;
	}
```` 	