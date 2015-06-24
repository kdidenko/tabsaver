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

var gidentity = (function() {
	// define states
	var STATE_START = 1;
	var STATE_ACQUIRING_AUTHTOKEN = 2;
	var STATE_AUTHTOKEN_ACQUIRED = 3;

	// define local variables
	var state = STATE_START;
	var access_token = null;
	var userInfo = null;
	var retry = true;
	var callback = null;
	var interactive = false;

	function getToken() {
		console.log('runnning chrome.identity.getAuthToken');
		chrome.identity.getAuthToken({
			'interactive' : interactive
		}, function(token) {
			if (chrome.runtime.lastError) {
				_gaq.push(['_trackEvent', 'OAuth2', 'Get Token', chrome.runtime.lastError.message]);
				console.warn(chrome.runtime.lastError.message); // "The user is not signed in." / "OAuth2 not granted or revoked."
				callback(chrome.runtime.lastError);
				return;
			}
			_gaq.push(['_trackEvent', 'OAuth2', 'Get Token', 'Token Received']);
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
		if (this.status == 401 && retry) { // cached token is invalid. Retry once with a fresh one
			retry = false;
			
			// log to Google Analytics event
			_gaq.push(['_trackEvent', 'OAuth2', 'Get Token', 'Cached token is invalid. Retrying once with a fresh one']);
			console.log('Cached token is invalid. Retrying once with a fresh one');
			
			chrome.identity.removeCachedAuthToken({
				token : access_token
			}, getToken());
		} else {
			// user info received
			callback(null, this.status, this.response);
		}
	}

	return {
		getUserInfo : function(i, c) {
			console.log('getting user data');
			interactive = i;
			callback = c;
			getToken();
		},

		revoke : function() {
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
					_gaq.push(['_trackEvent', 'OAuth2', 'Revoke Token', 'Revoked']);
					console.log('Token revoked and removed from cache. '
							+ 'Check chrome://identity-internals to confirm.');
				} else {
					// log to Google Analytics event
					_gaq.push(['_trackEvent', 'OAuth2', 'Revoke Token', chrome.runtime.lastError.message]);
					console.warn(chrome.runtime.lastError.message); // "The user is not signed in." / "OAuth2 not granted or revoked."
				}
			});

		}

	}
})();

/**
 * Callback executed after fetching the user info
 * 
 * @param error {string} error message returned in case of failure
 * @param status {integer} XHR response status code
 * @param data {Object} XHR response data
 */
function onUserInfoFetched(error, status, data) {
	if (!error) {
		guser = JSON.parse(data);
		// log to Google Analytics event
		_gaq.push(['_trackEvent', 'OAuth2', 'UserInfo Fetched', guser.email]);
		console.log('UserInfo Fetched: id:' + guser.id + ' email: ' + guser.email);
	}
}

/**
 * Initialize the user identity
 */
gidentity.getUserInfo(true, onUserInfoFetched);

/**
 * Assigns OAuth2 token revoking handler to 'Revoke' link
 */
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('revoke').addEventListener('click',
			gidentity.revoke, false);
});