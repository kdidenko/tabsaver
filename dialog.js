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
	
	this.id = null;
	
	this.title = null;
	
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
		// set the key for identifying stored data
		var key = this.name;
		// prepare tabs list JSON string
		var tabs = JSON.stringify(this.getTabs());
		// prepare the data object
		var data = {};
		data[key] = tabs;
		
		// save all session tabs into synchronized google storage
		chrome.storage.sync.set(data, function() { // async function
			if (chrome.runtime.lastError) {
				console.log(chrome.runtime.lastError.message);
		    }
			// stop waiting for chrome.storage.sync.set
			asyncWaitStop();
		});
		// let's wait for chrome.storage.sync.set async function to finish before proceeding
		asyncWaitStart();
		callback();
	};
};

/**
 * Main object of extension implemented via singleton notation
 */
var tabsaver = new function() {

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
				tab.setTitle(result[i].title);
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
		    var ul = document.getElementById('stored');
		    // remove all existing nodes
		    while (ul.hasChildNodes()) {
		    	ul.removeChild(ul.lastChild);
		    }		    
		    // move through all sessions and build the list
		    for ( var i = 0; i < allKeys.length; i++) {
		    	// create list item
		    	var li = document.createElement('li');
		    	// create title text
			    var title = document.createTextNode(allKeys[i]);
			    // append the title to list item
			    li.appendChild(title);
			    // append list item to the list
			    ul.appendChild(li);
			}
		    // stop waiting for chrome.storage.sync.get
		    asyncWaitStop();
		});
		// let's wait for chrome.storage.sync.get async function to finish before proceeding
		asyncWaitStart();
	};

	this.storeSession = function(name) {
		session.name = name;
		session.save(function(){
			tabsaver.renderSavedSessions();
		});
	};

	this.getSession = function() {
		return session;
	};

};

function init() {
	var save = document.getElementById('save');
	// assign event handler to Save button
	if(save) {
		// submit was clicked
		save.onclick = function() {
			// get the name of the session which will be used as a key for the storage record
			var name = document.getElementById('name').value;
			name = (name == 'undefined' || name == '' || name == null) ? prompt("Enter the session name"): name;
			if(name == 'undefined' || name == '' || name == null) {
				alert('Session name is required!');
				return;
			}
			// save the session with session name
			tabsaver.storeSession(name);
		};
		
		tabsaver.renderView();
		
	}
};

function doNothing() {
	alert('doing nothing');
	return true;
}


/**
 * Event listener to handle document onload
 */
document.addEventListener('DOMContentLoaded', function() {
	init();
});



