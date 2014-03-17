// Copyright (c) 2013 Kostyantyn Didenko. All rights reserved.
// This software is distributed under GNU GPL v2 licence
// For feedbacks and questions please feel free to contact me at kdidenko@gmail.com


var queryDone = false;

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
	
	this.save = function() {
		// set the key for identifying stored data
		var key = this.name;
		var tabs = JSON.stringify(this.getTabs());
		var data = {};
		data[key] = tabs;
		
		// save all session tabs into synchronized google storage
		chrome.storage.sync.set(data, function(){
			if (chrome.runtime.lastError) {
				alert(chrome.runtime.lastError.message);
		    }
		});
		
	};
};

/**
 * Main object of extension implemented via singleton notation
 */
var tabsaver = new function() {

	/**
	 * Renders the main view of extension
	 */
	this.renderView = function() {
		alert('rendering');
		//this.getTabs();
		//this.renderForm();
		// TODO: render list of saved sessions

	};

	this.storeSession = function(name) {
		session.name = name;
		// query all opened tabs
		chrome.tabs.query({'pinned': false}, function(result) {
			for (var i = 0; i < result.length; i++) {
				var tab = new Tab();
				tab.setId(result[i].id);
				tab.setTitle(result[i].title);
				tab.setUrl(result[i].url);				
				session.addTab(tab);
			}
			// save all tabs added to the session
			session.save();
			
			//tabsaver.renderView();
		});
	};

	this.getSession = function() {
		return session;
	};

};

/*
function renderForm() {
	list = document.getElementById('list');
	// TODO: add extension settings where it's possible to define:
	// 1. whenever to save all windows tabs all current window only
	// 2. whenever to save pinned tabs or not
	chrome.tabs.query({
		'pinned' : false
	}, function(result) {
		for ( var i = 0; i < result.length; i++) {
			var tab = {
				'id' : result[i].id,
				'url' : result[i].url,
				'title' : result[i].title
			};
			tabs.push(tab);
			var li = document.createElement('li');
			var chk = document.createElement('input');
			chk.type = 'checkbox';
			chk.name = 'tab[' + result[i].id + ']';
			chk.checked = 'checked';
			var span = document.createElement('span');
			// TODO: add setting whenever to trim title or not
			title = result[i].title.length > 50 ? result[i].title.substring(0,
					46)
					+ '...' : result[i].title;
			var t = document.createTextNode(title);
			li.appendChild(chk);
			li.appendChild(t);
			// TODO: add setting whenever to trim url or not
			href = result[i].url.length > 50 ? result[i].url.substring(0, 46)
					+ '...' : result[i].url;
			t = document.createTextNode(href);
			span.appendChild(t);
			li.appendChild(span);
			list.appendChild(li);
		};
	});
}

function getUserSessions() {
	chrome.storage.sync.get('myKey', function(obj) {
		console.log(obj);
		alert(obj);
	});
};
*/

function init() {
	var submit = document.getElementById('submit');
	if(submit) {
		submit.onclick = function() {
			var name = document.getElementById('name').value;
			name = (name == 'undefined' || name == '' || name == null) ? prompt("Enter the session name"): name;
			if(name == 'undefined' || name == '' || name == null) {
				alert('Session name is required!');
				return;
			}
			
			tabsaver.storeSession(name);
			
			//////////
			chrome.storage.sync.get(null, function(items) {
			    var allKeys = Object.keys(items);
			    alert(allKeys);
			});			
		};
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



