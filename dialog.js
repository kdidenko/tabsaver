/**
* Copyright (c) 2013 - 2015 Kostyantyn Didenko. All rights reserved.
* This software is distributed under GNU GPL v2 licence
* For feedbacks and questions please feel free to contact me at kdidenko@gmail.com
*/

//TODO: add console logging where possible (log, warn, etc....)
//TODO: add extension settings where it's possible to define:
	// 1. whenever to save all windows tabs all current window only
	// 2. whenever to save pinned tabs or not


function isset(v) {	return (v != undefined && v != '' && v != null); }

/**
 * Tab object definition
 */
function Tab () {
	this.id = null;
	//this.title = null;
	this.url = null;
	//this.migrated = false;
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
	
	/**
	 * removes the tab from session by it's id
	 */
	this.removeTab = function(id) {
		// walk through array
		for(var i = 0; i < this.count(); i++) {
			// check the tab id
			if(this.tabs[i].id == id ){
				// remove the tab from session
				return this.tabs.splice(i, 1);
			}
		}
		return -1;
	};
	
	/**
	 * returns the number of tabs in current session
	 */
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
			if(!chrome.runtime.lastError) {
				console.log('session "' + key + '" have been saved');
				if(isset(callback)) {
					callback();
				}
			} else {
				console.warn(chrome.runtime.lastError.message);
			}
		});
		return;
	};
	
	this.removeUnselectedTabs = function() {
		var checkboxes = document.getElementsByName('tab');
		// loop over them all
		for (var i=0; i<checkboxes.length; i++) {
			// And stick the checked ones onto an array...
			if (! checkboxes[i].checked) {
				this.removeTab(checkboxes[i].id);
			}
		}
		return;
	};
}

/**
 * Main object of extension implemented via singleton notation
 */
/**
 * 
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
		var list = document.getElementById('list');
		// get the list of all opened tabs
		chrome.tabs.query({'pinned': false}, function(result) {
			// populate the session with Tab objects
			for (var i = 0; i < result.length; i++) {
				var res = result[i];
				var tab = new Tab();
				tab.id = res.id;
				tab.url = encodeURIComponent(res.url);
				//tab.setTitle(result[i].title); //not saving tab title to save so extra space

				// add tab to session singleton object
				session.addTab(tab);				
								
				// render DOM to display tabs list to user				
				var li = document.createElement('li');
				
				// create check box
				var chk = document.createElement('input');
				chk.type = 'checkbox';
				chk.name = 'tab';
				chk.id = res.id;
				chk.checked = 'checked';
				
				// create favicon
				if( !isset(res.favIconUrl) || res.favIconUrl.indexOf('chrome://') !== -1 ) {
					src = 'http://www.tab-saver.com/images/tab-saver/chrome-favicon.png';
				} else {
					src = res.favIconUrl;
				}
				
				var img = document.createElement('img');
				img.setAttribute('src', src);
				img.setAttribute('class', 'favicon');
				img.setAttribute('height', '13px');
				img.setAttribute('width', '13px');
				
				// add tab title element
				var span = document.createElement('span');
				var title = (res.title.length > 40) ? res.title.substring(0, 40) + '...' : res.title;
				var t = document.createTextNode(title);

				li.appendChild(chk);
				li.appendChild(img);
				li.appendChild(t);
				
				// add tab url element
				var href = result[i].url.length > 50 ? result[i].url.substring(0, 40) + '...' : result[i].url;
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
		console.log('querying chrome.storage.sync for saved extension sessions');
		
		chrome.storage.sync.get(null, function(items) {
			
			if(!chrome.runtime.lastError) {
			
				var allKeys = Object.keys(items);
			    console.log('retreived ' + allKeys.length + ' stored sessions from chrome.storage.sync');
			    
			    var ul = document.getElementById('stored');
			    
			    // remove all existing nodes
			    console.log('clearing old data from saved sessions view');
			    while (ul.hasChildNodes()) {
			    	ul.removeChild(ul.lastChild);
			    }
			    
			    // walk through all sessions and build the list
			    console.log('building the fresh list of saved sessions');
			    
			    for (var i = 0; i < allKeys.length; i++) {
			    	// create list item
			    	var li = document.createElement('li');
			    	
			    	// create wrapper div
			    	var div = document.createElement('div');
			    	div.setAttribute('class', 'session-block');		    	
			    	
			    	// create link
			    	var a = document.createElement('a');
			    	a.setAttribute('href', '#');
			    	a.setAttribute('rel', allKeys[i]);
			    	
			    	// attach event listener to the session link
			    	a.addEventListener('click', tabsaver.openSession, false);
			    	a.addEventListener('click', function() {
						_gaq.push(['_trackEvent', 'Dialogs', 'Session', 'Opened']);
					}, false);
	
			    	// add title text
			    	a.appendChild(document.createTextNode(allKeys[i]));		    	
			    	
			    	// create delete button
			    	var del = document.createElement('span');
			    	del.setAttribute('class', 'delete-session');
			    	del.setAttribute('rel', allKeys[i]);
			    	
			    	del.appendChild(document.createTextNode('X'));
			    	// attach event listeners for delete button
			    	del.addEventListener('click', tabsaver.deleteSession, false);
	
			    	// build whole block together
			    	div.appendChild(a);
			    	div.appendChild(del);
				    li.appendChild(div);
				    ul.appendChild(li);
				}
			} else {
				// error occurred when getting the storage data 
				console.warn(chrome.runtime.lastError.message);
			}
		});
	};

	/**
	 * Stores current session into user's Google account storage 
	 */
	this.storeSession = function(name) {
		// set session name which will be used as a key to store data
		session.name = name; 
		// remove all tabs from session which were not selected by user
		session.removeUnselectedTabs();
		session.save(function(){
			// GA tracking to Save Session Event
			_gaq.push(['_trackEvent', 'Dialogs', 'Session', 'Saved']);
			console.log('refreshing saved sessions view');
			tabsaver.renderSavedSessions();
			showOpenTab(); // switch to the sessions view
			// notify user session was saved successfully
			alert(chrome.i18n.getMessage("sess_saved"));
		});
	};

	/**
	 * Returns current session object
	 */
	this.getSession = function() {
		return session;
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
					newTabs.push(decodeURIComponent(tabs[i].url));
				}
				// open new window with the list of saved urls
				chrome.windows.create({
					url: newTabs, focused: true
				}, function() {
					console.log('Session "' + key + '" opened');
				});
			}
		});
	};
	
	
	/**
	 * deletes the session from the storage
	 */
	this.deleteSession = function() {
		// get the session key to remove
		var key = this.getAttribute('rel');
		// do remove the session by key
		console.log('Removing session with the key: "' + key + '"');
		chrome.storage.sync.remove(key, function(){
			if(!chrome.runtime.lastError) {
				_gaq.push(['_trackEvent', 'Dialogs', 'Session', 'Deleted']);
				console.log('session "' + key + '" removed');
				tabsaver.renderSavedSessions();
			} else {
				console.warn(chrome.runtime.lastError.message);
			}
		});
	};
	
	this.exportSession = function() {
		console.log('export stub');
	};
	
	this.importSession = function() {
		console.log('export import');
	};	
	
};

/**
 * Main entry point of extension. Works as an initialization 
 * function to entire extension functionality.
 */
function init() {

	// render the extension views
	console.log('rendering extension views');
	tabsaver.renderView();
	
	
	// prevent form from being submitted
	document.getElementById('save_frm').addEventListener('submit', function(e) {
		e.preventDefault();
		return false;
	});
	
	// save button event listener
	document.getElementById('save').addEventListener('click', function() {
		console.log('"Save" button was clicked');
		
		// get the name of the session which will be used as a key for the storage record
		var name = document.getElementById('inpt_name').value;
		name = (!isset(name)) ? prompt(chrome.i18n.getMessage("sess_enter_name")): name;
		if(!isset(name)) {
			console.warn('session name was not entered during saving the session');
			alert(chrome.i18n.getMessage("sess_name_required"));
			return;
		}
		// save the session with name specified
		console.log('savinng session named "' + name + '"');
		tabsaver.storeSession(name);
		// reset session name field
		document.getElementById('inpt_name').value = '';
	}, false);
	
	// render the extension's version
	document.getElementById('version').appendChild(
		document.createTextNode(getVersion())
	);
	/*
	alert("Limit:" + (chrome.storage.sync.QUOTA_BYTES / 1024) + 'KB');
	chrome.storage.sync.getBytesInUse(null, function(biu) {
		alert("Used:" + (biu / 1024));
		alert("Left:" + ((chrome.storage.sync.QUOTA_BYTES - biu) / 1024));
	});
	*/
	
	//TODO: next versions - assign import / export handlers
	/**
	 * e.g:
	 *document.getElementById('export').onclick = tabsaver.exportSession;
	 *document.getElementById('import').onclick = tabsaver.importSession; 
	 */
};


/**
 * Determines the current extension's version according to manifest JSON file
 * @returns {version String}
 */
function getVersion() {
	var manifest = chrome.runtime.getManifest(); 
    return manifest.version;
};


/**
 * Event listener to handle document onload
 */
document.addEventListener('DOMContentLoaded', function() {
	init();
});