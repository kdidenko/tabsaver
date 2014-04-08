
function translate(id, attribute, text) {
	var el = document.getElementById(id);
	if(el !== null || el !== 'undefined' || el !== '') {
		if(attribute !== 'innerHTML') {
			el.setAttribute(attribute, text);
		} else {
			el.innerHTML = text;
		}
	} else {
		console.warn ('could not find element with id' + id);
	}
}


/**
 * entry point for internationalization functionality
 */
function i18n() {
	var title = chrome.i18n.getMessage("title");
	translate('title', 'innerHTML', title);
	var ext_name = chrome.i18n.getMessage("ext_name");
	translate('ext_name', 'innerHTML', ext_name);
	
	
	/*
	save_btn = save
	open_btn = open
	ssn_sess = Session; ssn_name = Name
	inpt_name (placeholder) = Enter the name to save the session
	save = Save
	*/
	
}

/**
 * Event listener to handle document onload
 */
document.addEventListener('DOMContentLoaded', function() {
	i18n();
});