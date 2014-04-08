
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
	var save_btn = chrome.i18n.getMessage("save_btn");
	translate('save_btn', 'innerHTML', save_btn);
	var open_btn = chrome.i18n.getMessage("open_btn");
	translate('open_btn', 'innerHTML', open_btn);
	var ssn_sess = chrome.i18n.getMessage("ssn_sess");
	translate('ssn_sess', 'innerHTML', ssn_sess);
	
	/*var ssn_name = chrome.i18n.getMessage("ssn_name");  
	translate('ssn_name', 'innerHTML', ssn_name);*/
	
	var inpt_name = chrome.i18n.getMessage("inpt_name"); 
	translate('inpt_name', 'placeholder', inpt_name);
	var save = chrome.i18n.getMessage("save");
	translate('save', 'value', save);
	
	
	/*
	ssn_name = Name

	*/
	
}

/**
 * Event listener to handle document onload
 */
document.addEventListener('DOMContentLoaded', function() {
	i18n();
});