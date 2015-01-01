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
 * selects all tabs in session
 */
function selectAll() {
	var checkboxes = document.getElementsByName('tab');
	// loop over them all
	for (var i=0; i<checkboxes.length; i++) {
		// and check the checkbox if not checked
		if (! checkboxes[i].checked) {
			checkboxes[i].checked = true;
		}
	}
}
/**
 * deselects all tabs in session
 */
function clearSelection() {
	var checkboxes = document.getElementsByName('tab');
	// loop over them all
	for (var i=0; i<checkboxes.length; i++) {
		// and uncheck the checkbox if not checked
		if (checkboxes[i].checked) {
			checkboxes[i].checked = false;
		}
	}
}

/**
 * toggles all tabs selection
 */
function toggleSelection() {
	var checkboxes = document.getElementsByName('tab');
	// loop over them all
	for (var i=0; i<checkboxes.length; i++) {
		// and toggle the checkbox selection
		checkboxes[i].checked = !(checkboxes[i].checked == true);
	}	
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
 * Event listener to handle list actions: Select All, Clear Selection and Toggle Selection.
 */
document.getElementById('list-action').onchange = function() {
	switch(parseInt(this.options[this.selectedIndex].value)) {
		case 1: // select all
			selectAll();
			break;
		case 2: // clear selection
			clearSelection();
			break;
		case 3: // toggle selection
			toggleSelection();
			break;
		default: break;
	}
	this.selectedIndex = 0;
}


/**
 * Event listener to handle document onload
 */
document.addEventListener('DOMContentLoaded', function() {
	// initialize all external urls
	initExternalUrls();	
});