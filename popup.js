/**
 * opens the save session dialog to the  user
 */
function showSaveTab() {
	// switch tabs
	document.getElementById('open_tab').style.display = 'none';
	document.getElementById('save_tab').style.display = 'block';
	// highlight "save" tab
	if(document.getElementById('open_btn').getAttribute("class") == "selected")	{
		document.getElementById('open_btn').removeAttribute('class', 'selected');
	}
	document.getElementById('save_btn').setAttribute('class', 'selected');	
}

/**
 * opens the list of saved sessions dialog to the user
 */
function showOpenTab() {
	// switch tabs
	document.getElementById('open_tab').style.display = 'block';
	document.getElementById('save_tab').style.display = 'none';
	// highlight "open" tab
	document.getElementById('open_btn').setAttribute('class', 'selected');
	if(document.getElementById('save_btn').getAttribute("class") == "selected")	{
		document.getElementById('save_btn').removeAttribute('class', 'selected');
	}
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
document.getElementById('open_btn').addEventListener('click', showOpenTab, false);

/**
 * assign onclick event handler to save session tab button
 */
document.getElementById('save_btn').addEventListener('click', showSaveTab, false);

/**
 * Event listener to handle list actions: Select All, Clear Selection and Toggle Selection.
 */
document.getElementById('list-action').addEventListener('change', function() {
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
	//this.selectedIndex = 0;
}, false);


/**
 * Event listener to handle document onload
 */
document.addEventListener('DOMContentLoaded', function() {
	// initialize all external urls
	initExternalUrls();	
});