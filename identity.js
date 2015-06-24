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
		chrome.identity
				.getAuthToken(
						{
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
								_gaq.push([ '_trackEvent', 'OAuth2',
										'Get Token', OAuthState ]);
								console.warn(chrome.runtime.lastError.message); 
								callback(chrome.runtime.lastError);
								return;
							}
							// he is signed in, and accepted our permissions!
							OAuthState = IS_ACTIVE; 
							_gaq.push([ '_trackEvent', 'OAuth2', 'Get Token',
									'Token Received' ]);
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
			_gaq.push([ '_trackEvent', 'OAuth2', 'Get Token',
							'Cached token is invalid. Retrying once with a fresh one' ]);
			console.log('Cached token is invalid. Retrying once with a fresh one');
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
 * Callback method executed after fetching the user info
 * 
 * @param error
 *            {string} error message returned in case of failure
 * @param status
 *            {integer} XHR response status code
 * @param data
 *            {Object} XHR response data
 */
function onUserInfoFetched(error, status, data) {
	if (!error) {
		guser = JSON.parse(data);
		// log to Google Analytics event
		_gaq.push([ '_trackEvent', 'OAuth2', 'UserInfo Fetched', guser.email ]);
		console.log('UserInfo Fetched: id:' + guser.id + ' email: '
				+ guser.email);
		if(OAuthState == IS_ACTIVE) {
			document.getElementById('revoke').style.display = "inline";
		}
	}
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