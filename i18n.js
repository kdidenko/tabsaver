
function translate(id, attribute, text) {
	var el = document.getElementById(id);
	// check if element exists
	if(el !== null && el !== 'undefined' && el !== '') {
		if(attribute !== 'innerHTML') {
			el.setAttribute(attribute, text);
		} else {
			el.innerHTML = text;
		}
	} else {
		console.log ('could not find element with id: ' + id);
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
	var inpt_name = chrome.i18n.getMessage("inpt_name"); 
	translate('inpt_name', 'placeholder', inpt_name);
	var save = chrome.i18n.getMessage("save");
	translate('save', 'value', save);
	/*** v 1.0.9 ***/
	/* removed at v 1.1.3
	var list_action_choose = chrome.i18n.getMessage("list_action_choose");
	translate('list_action_choose', 'innerHTML', list_action_choose);
	*/
	var list_action_select = chrome.i18n.getMessage("list_action_select");
	translate('list_action_select', 'innerHTML', list_action_select);
	var list_action_clear = chrome.i18n.getMessage("list_action_clear");
	translate('list_action_clear', 'innerHTML', list_action_clear);
	var list_action_toggle = chrome.i18n.getMessage("list_action_toggle");
	translate('list_action_toggle', 'innerHTML', list_action_toggle);
	/*** v 1.0.9 ***/
}

/**
 * Event listener to handle document onload
 */
document.addEventListener('DOMContentLoaded', function() {
	i18n();
});