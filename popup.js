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
 * opens the list of saved sessions dialog to the  user
 */
function showOpenTab() {
	var open = document.getElementById('open_tab');
	open.style.display = 'block';
	var save = document.getElementById('save_tab');
	save.style.display = 'none';
}

// assign onclick event handlers to tab buttons elements
//document.getElementById('open_btn').onclick = showOpenTab;
//document.getElementById('save_btn').onclick = showSaveTab;



	
/*
document.getElementById('save_btn').onclick = function() {
	document.getElementById('save_btn').setAttribute('class', 'selected'); 
};
*/


document.getElementById('open_btn').onclick = function() {
	document.getElementById('open_btn').setAttribute('class', 'selected'); 
	if(document.getElementById('save_btn').getAttribute("class") == "selected")	{
		document.getElementById('save_btn').removeAttribute('class', 'selected'); 
	}
	showOpenTab();
};

document.getElementById('save_btn').onclick = function() {
	document.getElementById('save_btn').setAttribute('class', 'selected'); 
	if(document.getElementById('open_btn').getAttribute("class") == "selected")	{
		document.getElementById('open_btn').removeAttribute('class', 'selected'); 
	}
	showSaveTab();
};








