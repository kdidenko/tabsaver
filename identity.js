/**
 * Copyright (c) 2015 Kostyantyn Didenko. All rights reserved. This software is
 * distributed under GNU GPL v2 licence For feedbacks and questions please feel
 * free to contact me at kdidenko@gmail.com
 * 
 * @author Kostyantyn Didenko
 * @since v 1.1.4
 * @see https://developer.chrome.com/apps/app_identity
 */

var userInfoUrl = 'https://www.googleapis.com/userinfo/v2/me';

//var migrationUrl = 'http://tab-saver.appspot.com/migration.html';
var migrationUrl = 'http://localhost:9080/migration.html';

var userId, migrated = null;

/**
 * User object as returned from Google user info
 */
var guser = null;

// let's define states. CRAP! chrome.runtime do not return any error codes,
// only string messages we have to use:
/**
 * @constant defines the user state as not signed in yet
 */
var IS_NOT_SIGNED_IN = 'The user is not signed in.';

/**
 * @constant defines the state when OAuth was not granted or revoked
 */
var IS_NOT_GRANTED_OAUTH2 = 'OAuth2 not granted or revoked.';

/**
 * @constant defines the state when user rejected extension permissions for
 *           OAuth2
 */
var IS_REJECTED_OAUTH2 = 'OAuth2 was rejected by user!';

/**
 * @constant defines the state when user was successfully signed in and accepted
 *           extension's permissions for OAuth2
 */
var IS_ACTIVE = 'Is signed in and active';

var OAuthState = false;

/**
 * @class gidentity 
 * main Google identity singleton class implementation for TabSaver extension required
 * OAuth2 functionality
 */
var gidentity = (function() {
	// define local variables
	var access_token = null;
	var userInfo = null;
	var retry = true;
	var callback = null;
	var interactive = false;

	function getToken() {
		console.log('runnning chrome.identity.getAuthToken');
		chrome.identity.getAuthToken({
							'interactive' : interactive
						},
						function(token) {
							if (chrome.runtime.lastError) { // something happend
								if (chrome.runtime.lastError.message == IS_NOT_SIGNED_IN) {
									// maybe he do not have any Google's accounts at all
									OAuthState = IS_NOT_SIGNED_IN; 
								} else if (chrome.runtime.lastError.message == IS_NOT_GRANTED_OAUTH2) {
									if (interactive) {
										// he rejected our access permissions!
										OAuthState = IS_REJECTED_OAUTH2; 
									} else {
										// our extension have no permissions (yet)
										OAuthState = IS_NOT_GRANTED_OAUTH2;
										// now try it interactive, to show user the application authorization dialog
										gidentity.getUserInfo(true, onUserInfoFetched);
										return
									}
								}
								// "The user is not signed in." / "OAuth2 not granted or revoked."
								_gaq.push([ '_trackEvent', 'OAuth2', 'Get Token', OAuthState ]);
								console.warn(chrome.runtime.lastError.message); 
								callback(chrome.runtime.lastError.message);
								return;
							}
							// he is signed in, and accepted our permissions!
							OAuthState = IS_ACTIVE; 
							_gaq.push([ '_trackEvent', 'OAuth2', 'Get Token', 'Token Received' ]);
							console.log('token received: ' + token);
							access_token = token;
							infoRequestStart();
						});
	}

	function infoRequestStart() {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', userInfoUrl, true);
		xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
		xhr.onload = infoRequestComplete;
		xhr.send();
	}

	function infoRequestComplete() {
		if (this.status == 401 && retry) { // cached token is invalid. Retry
			// once with a fresh one
			retry = false;
			// log to Google Analytics event
			var m = 'Cached token is invalid. Retrying once with a fresh one';
			_gaq.push([ '_trackEvent', 'OAuth2', 'Get Token', m ]);
			console.log(m);
			// remove cached OAuth2 token
			chrome.identity.removeCachedAuthToken({
				token : access_token
			}, getToken());
		} else {
			// user info received
			callback(null, this.status, this.response);
		}
	}

	return {
		getUserInfo: function(i, c) {
			console.log('getting user data');
			interactive = i;
			callback = c;
			getToken();
		},
		revoke: function(callback) {
			chrome.identity.getAuthToken({
				'interactive' : false
			}, function(current_token) {
				if (!chrome.runtime.lastError) {
					// Remove the local cached token
					chrome.identity.removeCachedAuthToken({
						token : current_token
					}, function() {
					});
					// Make a request to revoke token in the server
					var xhr = new XMLHttpRequest();
					xhr.open('GET',
							'https://accounts.google.com/o/oauth2/revoke?token='
									+ current_token);
					xhr.send();
					// log to Google Analytics event
					_gaq.push([ '_trackEvent', 'OAuth2', 'Revoke Token',
							'Revoked' ]);
					console.log('Token revoked and removed from cache. '
							+ 'Check chrome://identity-internals to confirm.');
					if(callback) {
						callback();
					}
				} else {
					// "The user is not signed in." / "OAuth2 not granted or revoked."
					// log this to Google Analytics event
					_gaq.push([ '_trackEvent', 'OAuth2', 'Revoke Token',
							chrome.runtime.lastError.message ]);
					// and to console as well
					console.warn(chrome.runtime.lastError.message);
				}
			});

		}

	}
})();

/**
* Generates the random token used to identify current Chrome user instance
*/
function getRandomToken() {
    // E.g. 8 * 32 = 256 bits token
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
	console.log('random token generated: ' + hex);
    // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
    return hex;
}

function updateUserData(userId, migrated) {
	var userdata = {
		'userId': userId,
		'migrated': migrated
	};			
	chrome.storage.sync.set({'userdata': userdata}, function() {
		console.log('user state  data updated. userID: ' + userId + ' migrated: ' + migrated);
	});
}

function migrate(data, callback) {
	console.log('migrating all user sessions to http://tab-saver.appspot.com');
	var xhr = new XMLHttpRequest();
	xhr.open('POST', migrationUrl, true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.onload = function(e) {
		if(this.status == 200 || this.status == 500) {
			alert(xhr.response);
		}
	};
	xhr.send('userdata=' + JSON.stringify(guser) + '&sessions=' + JSON.stringify(data));
	if(isset(callback)) {
		callback();
	}
	return true;
}

function checkMigration() {
	console.log('checking if user data have been already migrated');
	// get data from storage
	chrome.storage.sync.get('userdata', function(items) {
		if(!chrome.runtime.lastError) {
			console.log('user state data received : ' + JSON.stringify(items));
			if(isset(items.userdata)) {
				userId = isset(items.userdata.iserId) ? items.userdata.iserId : getRandomToken(); 
				migrated = isset(items.userdata.migrated) ? items.userdata.migrated : false; 
			}
			if(guser == null) {
				guser = {'id': userId, 'migrated': migrated};
			} else {
				guser.migrated = migrated;
			}
			guser.migrated = false;
			// migrate user data if not migrated yet
			if(!guser.migrated) {
				// get all saved sessions and run migration	
				chrome.storage.sync.get(null, function(items) {
					if(!chrome.runtime.lastError) {
						$sessions = {};
						for (var key in items) {
							var arr = JSON.parse(items[key]);
							for (var i = 0; i < arr.length; i++) {
								arr[i].url = encodeURIComponent(arr[i].url);
							}
							$sessions[key] = arr;
						}
						/*
						migrate($sessions, function(error){
							if(!isset(error)) {
								migrated = true;
								console.log('all user session were successfully migrated')
								// update chrome.storage userdata after data migrated callback
								//updateUserData(userId, migrated);						
							} else {
								console.warn('Error occured during data submit for migration');
							}// end if	
						}); // end migrate
						*/
					} else {
						console.warn(chrome.runtime.lastError.message);
					}
				}); // end chrome.storage.sync.get
			} // end if
			
			// update chrome.storage userdata before data migrated callback
			//updateUserData(userId, migrated);
			
		} else {
			alert('Error occured when getting userdata: ' + chrome.runtime.lastError.messae);
			console.warn('Error occured when getting userdata: ' + chrome.runtime.lastError.messae);
		}
	});

	return true;
}


/**
 * Callback method executed after fetching the user info
 * 
 * @param error {string} error message returned in case of failure
 * @param status {integer} XHR response status code
 * @param data {Object} XHR response data
 */
function onUserInfoFetched(error, status, data) {
	if (!error) {
		guser = JSON.parse(data);
		// log to Google Analytics event
		_gaq.push([ '_trackEvent', 'OAuth2', 'UserInfo Fetched', guser.email ]);
		console.log('UserInfo Fetched: id:' + guser.id + ' email: ' + guser.email);
		if(OAuthState == IS_ACTIVE) {
			document.getElementById('revoke').style.display = "inline";
		}
	}	
	checkMigration();
}


/**
 * Assigns OAuth2 token revoking handler to 'Revoke' link
 */
document.addEventListener('DOMContentLoaded', function() {
	
	// Initialize the user identity
	gidentity.getUserInfo(false, onUserInfoFetched);
	
	document.getElementById('revoke').addEventListener('click', function() {
		gidentity.revoke(function() {
			document.getElementById('revoke').style.display = "none";
		});
	}, false);
});