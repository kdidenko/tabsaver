/**
 * opens the save session dialog to the  user
 */
function showSaveTab() {
	var open = document.getElementById('open_tab');
	open.style.display = 'none';
	var save = document.getElementById('save_tab');
	save.style.display = 'block';
}

/**
 * opens the list of saved sessions dialog to the user
 */
function showOpenTab() {
	var open = document.getElementById('open_tab');
	open.style.display = 'block';
	var save = document.getElementById('save_tab');
	save.style.display = 'none';
}

/**
 * assign onclick event handler to open session tab button
 */
document.getElementById('open_btn').onclick = function() {
	document.getElementById('open_btn').setAttribute('class', 'selected'); 
	if(document.getElementById('save_btn').getAttribute("class") == "selected")	{
		document.getElementById('save_btn').removeAttribute('class', 'selected'); 
	}
	showOpenTab();
};

/**
 * assign onclick event handler to save session tab button
 */
document.getElementById('save_btn').onclick = function() {
	document.getElementById('save_btn').setAttribute('class', 'selected'); 
	if(document.getElementById('open_btn').getAttribute("class") == "selected")	{
		document.getElementById('open_btn').removeAttribute('class', 'selected'); 
	}
	showSaveTab();
};

/**
 * adds an event listener to open an external url within the current 
 * window where extension dialog was opened
 */
function initExternalUrls() {
	var urls = document.getElementsByClassName('extUrl');
	for(var i = 0; i < urls.length; i++ ) {
		console.log('URL #' + i + ' = ' + urls[i].href);
		urls[i].addEventListener('click', function() {
			_gaq.push(['_trackEvent', 'URLs', 'Opened', this.href]);
			chrome.tabs.create({ url: this.href }, function(tab){});
		}, false);
	}
};


/**
 * Event listener to handle document onload
 */
document.addEventListener('DOMContentLoaded', function() {
	// initialize all external urls
	initExternalUrls();	
});
