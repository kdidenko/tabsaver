/**
 * opens the save session dialog to the  user
 */
function showSaveTab() {
	var open = document.getElementById('open');
	open.style.display = 'none';
	var save = document.getElementById('save');
	save.style.display = 'block';
}

/**
 * opens the list of saved sessions dialog to the  user
 */
function showOpenTab() {
	var open = document.getElementById('open');
	open.style.display = 'block';
	var save = document.getElementById('save');
	save.style.display = 'none';
}

// assign onclick event handlers to tab buttons elements
document.getElementById('open_btn').onclick = showOpenTab;
document.getElementById('save_btn').onclick = showSaveTab;