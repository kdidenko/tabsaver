// Copyright (c) 2013 Kostyantyn Didenko. All rights reserved.
// This software is distributed under GNU GPL v2 licence
// For feedbacks and questions please feel free to contact me at kdidenko@gmail.com

//TODO: add console logging where possible (log, warn, etc....)
//TODO: add extension settings where it's possible to define:
	// 1. whenever to save all windows tabs all current window only
	// 2. whenever to save pinned tabs or not

//TODO: add setting whenever to trim list items titles or not
//TODO: add setting whenever to trim list items urls or not

//TODO: wrap functionality below into FlowControlHandler Class BEGIN
var doAsyncWait = true;

var timeout = 500;

function asyncWaitStart() {
	asyncWait();	
}

function asyncWaitStop() {
	doAsyncWait = false;
}

function asyncWait() {
	if(doAsyncWait) {
		setTimeout(asyncWait, timeout);
	} else {
		doAsyncWait = true;
		return doAsyncWait;
	}
}
//TODO: wrap functionality below into FlowControlHandler Class END


/**
 * Tab object definition
 */
function Tab () {
	
	//this.id = null; just to save space
	
	//this.title = null; just to save space
	
	this.url = null;
	
	this.setId = function(id) {
		this.id = id;
	};
	
	this.setTitle = function(title) {
		this.title = title;
	};
	
	this.setUrl = function(url) {
		this.url = url;
	};
	
	this.getId = function() {
		return this.id;
	};
	
	this.getTitle = function() {
		return this.title;
	};
	
	this.getUrl = function() {
		return this.url;
	};
}


/**
 * A singleton defining current user session
 */
var session = new function() {
	/**
	 * defines the session name
	 */
	this.name = null;

	/**
	 * stores the list of opened tabs
	 */
	this.tabs = [];

	/**
	 * returns an array of user session opened tabs
	 * @returns array of tab object
	 */
	this.getTabs = function() {
		return this.tabs;
	};

	/**
	 * adds the tab object to the list of opened tabs
	 * @param tab object to add
	 */
	this.addTab = function(tab) {
		this.tabs.push(tab);
	};
	
	this.count = function() {
		return this.tabs.length;		
	};
	
	/**
	 * Saves the session tabs into chrome.storage 
	 * using the session name specified as a record key
	 */
	this.save = function(callback) {
		console.log('prepearing JSON data to save session');
		// set the key for identifying stored data
		var key = this.name;
		// prepare tabs list JSON string
		var tabs = JSON.stringify(this.getTabs());
		// prepare the data object
		var data = {};
		data[key] = tabs;
		
		// save all session tabs into synchronized google storage
		console.log('saving ' + this.getTabs().length + ' tabs data to chrome.storage.sync');
		chrome.storage.sync.set(data, function() { // async function
			try {
				if (chrome.runtime.lastError) {
					console.warn(chrome.runtime.lastError.message);
			    } 
			} catch (exception) {
				alert('exception.stack: ' + exception.stack);
				console.error((new Date()).toJSON(), "exception.stack:", exception.stack);
			}
			// stop waiting for chrome.storage.sync.set
			console.log('stopping waiting for asynchronous "chrome.storage.sync.set" function to finish');
			asyncWaitStop();
		});
		// let's wait for chrome.storage.sync.set async function to finish before proceeding
		console.log('waiting for asynchronous "chrome.storage.sync.set" function to finish');
		asyncWaitStart();
		callback();
	};
};

/**
 * Main object of extension implemented via singleton notation
 */
/**
 * 
 */
var tabsaver = new function() {
	
	var openedSessions = null;

	/**
	 * Renders the main views of extension
	 */
	this.renderView = function() {
		// show the list of currently opened tabs
		this.renderCurrentSession();
		// show the list of previously saved sessions
		this.renderSavedSessions();
	};
	
	/**
	 *  Renders the list of tabs from currently opened session
	 */
	this.renderCurrentSession = function() {
		// get the list output element
		list = document.getElementById('list');
		// get the list of all opened tabs
		chrome.tabs.query({'pinned' : false}, function(result) {
			// populate the session with Tab objects
			for ( var i = 0; i < result.length; i++) {
				var tab = new Tab();
				tab.setId(result[i].id);
				//tab.setTitle(result[i].title); not saving tab title to save so extra space
				tab.setUrl(result[i].url);
				// add tab to session singleton object
				session.addTab(tab);				
								
				// render DOM to display tabs list to user				
				var li = document.createElement('li');
				
				// create check box
				var chk = document.createElement('input');
				chk.type = 'checkbox';
				chk.name = 'tab[' + result[i].id + ']';
				chk.checked = 'checked';
				
				// add tab title element
				var span = document.createElement('span');
				title = result[i].title.length > 50 ? result[i].title.substring(0, 46) + '...' : result[i].title;
				var t = document.createTextNode(title);
				li.appendChild(chk);
				li.appendChild(t);
				
				// add tab url element
				href = result[i].url.length > 50 ? result[i].url.substring(0, 46) + '...' : result[i].url;
				t = document.createTextNode(href);
				
				// compose all elements together
				span.appendChild(t);
				li.appendChild(span);
				list.appendChild(li);
			};
		});
	};
	
	/**
	 *  Renders the list of previously saved sessions
	 */
	this.renderSavedSessions = function() {
		// get the list of saved session names
		console.log('queriing chrome.storage.sync for saved extension sessions');
		chrome.storage.sync.get(null, function(items) {
			try {
				if (chrome.runtime.lastError) {
					console.warn(chrome.runtime.lastError.message);
			    } 
			} catch (exception) {
				alert('exception.stack: ' + exception.stack);
				console.error((new Date()).toJSON(), "exception.stack:", exception.stack);
			}
		    var allKeys = Object.keys(items);
		    this.openedSessions = allKeys;
		    console.log('retreived ' + allKeys.length + ' stored sessions from chrome.storage.sync');
		    var ul = document.getElementById('stored');
		    // remove all existing nodes
		    console.log('clearing old data from saved sessions view');
		    while (ul.hasChildNodes()) {
		    	ul.removeChild(ul.lastChild);
		    }		    
		    // move through all sessions and build the list
		    console.log('building the fresh list of saved sessions');
		    for ( var i = 0; i < allKeys.length; i++) {
		    	// create list item
		    	var li = document.createElement('li');
		    	// create link
		    	var a = document.createElement('a');
		    	a.setAttribute('href', '#');
		    	a.setAttribute('rel', allKeys[i]);
		    	a.onclick = tabsaver.openSession;
		    	// create title text
		    	var title = document.createTextNode(allKeys[i]);
		    	a.appendChild(title);		    	
			    // append the title to list item
			    li.appendChild(a);
			    // append list item to the list
			    ul.appendChild(li);
			}
		    // stop waiting for chrome.storage.sync.get
		    console.log('stopping waiting for asynchronous "chrome.storage.sync.get" function to finish');
		    asyncWaitStop();
		});
		// let's wait for chrome.storage.sync.get async function to finish before proceeding
		console.log('waiting for asynchronous "chrome.storage.sync.get" function to finish');
		asyncWaitStart();
	};

	/**
	 * Stores current session into user's Google account storage 
	 */
	this.storeSession = function(name) {
		session.name = name;
		session.save(function(){
			console.log('refreshing saved sessions view');
			tabsaver.renderSavedSessions();
		});
	};

	/**
	 * Returns current session object
	 */
	this.getSession = function() {
		return session;
	};
	
	/**
	 * Determines if user is currently logged in to his Google account.
	 * Otherwise extension can not function properly.
	 */	
	this.isUserLogedIn = function() {
		// write code here!!!	
	};
	
	/**
	 * Opens saved session in a new window
	 */
	this.openSession = function() {
		// get the urls for session key specified
		chrome.storage.sync.get(this.rel, function(result) {
			var tabs = {};
			var newTabs = [];
			// walk though all urls saved
			for (var key in result) {
				tabs[key] = JSON.parse(result[key]);
				tabs = tabs[key];
				// build an array of urls for new window to open
				for (var i = 0; i < tabs.length; ++i) {
					newTabs.push(tabs[i].url);
				}
				// open new window with the list of saved urls
				chrome.windows.create({
					url: newTabs, focused: true
				}, function() {
					console.log('Session opened');
				});
			}
		});
	};
};

/**
 * Main entry point of extension. Works as an initialization 
 * function to entire extension functionality.
 */
function init() {
	//tabsaver.isUserLogedIn();
	//alert(chrome.identity);
	var save = document.getElementById('save');
	// assign event handler to Save button
	if(save) {
		// submit was clicked
		save.onclick = function() {
			console.log('"Save" button was clicked');
			// get the name of the session which will be used as a key for the storage record
			var name = document.getElementById('name').value;
			name = (name == 'undefined' || name == '' || name == null) ? prompt("Enter the session name"): name;
			if(name == 'undefined' || name == '' || name == null) {
				console.warn('session name was not entered during saving the session');
				alert('Session name is required!');
				return;
			}
			// save the session with session name
			console.log('savinng session named "' + name + '"');
			tabsaver.storeSession(name);
		};
		
		// render the extension views
		console.log('rendering extension views');
		tabsaver.renderView();
	}
};


/**
 * Event listener to handle document onload
 */
document.addEventListener('DOMContentLoaded', function() {
	init();
});








//The code below will log the background color for the active range
var color = SpreadsheetApp.getActiveRange().getBackgroundColor();
Logger.log(color);












