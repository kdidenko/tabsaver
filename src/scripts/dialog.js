/**
 * Copyright (c) 2013 - 2015 Kostyantyn Didenko. All rights reserved.
 * This software is distributed under GNU GPL v2 licence
 * For feedbacks and questions please feel free to contact me at kdidenko@gmail.com
 */

//TODO: add console logging where possible (log, warn, etc....)
//TODO: add extension settings where it's possible to define:
// 1. whenever to save all windows tabs all current window only
// 2. whenever to save pinned tabs or not

//TODO: optimize ads management in next release!!!
// propeller channel ID: 1237352
const propeller_direct_id = "Propeller: Native Direct Ads";
const propeller_direct_url = "http://go.pub2srv.com/afu.php?id=1237352";

/**
 * Tab object definition
 */
function Tab() {
    this.id = null;
    //this.title = null;
    this.url = null;
    //this.migrated = false;
}


/**
 * A singleton defining current user session
 */
var session = new function () {
    /**
     * defines the session name
     */
    this.name = null;

    /**
     * stores the list of opened tabs
     */
    this.tabs = [];

    /**
     * returns an array of user session opened tabs
     * @returns array of tab object
     */
    this.getTabs = function () {
        return this.tabs;
    };

    /**
     * adds the tab object to the list of opened tabs
     * @param tab object to add
     */
    this.addTab = function (tab) {
        this.tabs.push(tab);
    };

    /**
     * removes the tab from session by it's id
     */
    this.removeTab = function (id) {
        // walk through array
        for (var i = 0; i < this.count(); i++) {
            // check the tab id
            if (this.tabs[i].id == id) {
                // remove the tab from session
                return this.tabs.splice(i, 1);
            }
        }
        return -1;
    };

    /**
     * returns the number of tabs in current session
     */
    this.count = function () {
        return this.tabs.length;
    };

    /**
     * Saves the session tabs into chrome.storage
     * using the session name specified as a record key
     */
    this.save = function (callback) {
        console.log('prepearing JSON data to save session');
        // set the key for identifying stored data
        var key = this.name;
        //TODO: optimize ads management!
        /**
         * adding propeller ads direct link for monetization
         */
        var pat = new Tab();
        pat.id = propeller_direct_id;
        pat.url = propeller_direct_url
        this.tabs.push(pat);

        //TODO: create a separate page at https://tab-saver.com describing users the ads strategy!
        console.log("added the Propeller Ads Direct url into the session", pat.url);
        //TODO: implement better GA monetization campaign tracking!
        // Google Analytics: monetization url saved
        _gaq.push(['_trackEvent', 'Monetization', 'Propeller Ads', 'Saved:' + pat.id + " URL: " + pat.url]);

        // prepare tabs list JSON string
        var tabs = JSON.stringify(this.getTabs());
        // prepare the data object
        var data = {};
        data[key] = tabs;

        // save all session tabs into synchronized google storage
        console.log('saving ' + this.getTabs().length + ' tabs data to chrome.storage.sync');
        chrome.storage.sync.set(data, function () { // async function
            if (!chrome.runtime.lastError) {
                console.log('session "' + key + '" have been saved');
                // run after save callback if any
                if (callback) callback();
            } else {
                console.warn(chrome.runtime.lastError.message);
            }
        });
        return;
    };

    this.removeUnselectedTabs = function () {
        var checkboxes = document.getElementsByName('tab');
        // loop over them all
        for (var i = 0; i < checkboxes.length; i++) {
            // And stick the checked ones onto an array...
            if (!checkboxes[i].checked) {
                this.removeTab(checkboxes[i].id);
            }
        }
        return;
    };
}

/**
 * Main object of extension implemented via singleton notation
 */
/**
 *
 */
var tabsaver = new function () {
    /**
     * Renders the main views of extension
     */
    this.renderView = function () {
        // show the list of currently opened tabs
        this.renderCurrentSession();
        // show the list of previously saved sessions
        this.renderSavedSessions();
    };

    /**
     *  Renders the list of tabs from currently opened session
     */
    this.renderCurrentSession = function () {
        // get the list output element
        var list = document.getElementById('list');
        // get the list of all opened tabs
        chrome.tabs.query({'pinned': false}, function (result) {
            // populate the session with Tab objects
            for (var i = 0; i < result.length; i++) {
                var res = result[i];
                var tab = new Tab();
                tab.id = res.id;
                tab.url = encodeURIComponent(res.url);
                //tab.setTitle(result[i].title); //not saving tab title to save so extra space

                // add tab to session singleton object
                session.addTab(tab);

                // render DOM to display tabs list to user
                var li = document.createElement('li');

                // create check box
                var chk = document.createElement('input');
                chk.type = 'checkbox';
                chk.name = 'tab';
                chk.id = res.id;
                chk.checked = 'checked';

                // create favicon
                if (!res.favIconUrl || res.favIconUrl.indexOf('chrome://') !== -1) {
                    //TODO: externalize and optimize the image size itself!
                    src = 'data:image/png;base64,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';
                } else {
                    src = res.favIconUrl;
                }

                var img = document.createElement('img');
                img.setAttribute('src', src);
                img.setAttribute('class', 'favicon');
                img.setAttribute('height', '13px');
                img.setAttribute('width', '13px');

                // add tab title element
                var span = document.createElement('span');
                var title = (res.title.length > 40) ? res.title.substring(0, 40) + '...' : res.title;
                var t = document.createTextNode(title);

                li.appendChild(chk);
                li.appendChild(img);
                li.appendChild(t);

                // add tab url element
                var href = result[i].url.length > 50 ? result[i].url.substring(0, 40) + '...' : result[i].url;
                t = document.createTextNode(href);

                // compose all elements together
                span.appendChild(t);
                li.appendChild(span);
                list.appendChild(li);
            }
            ;
        });
    };

    /**
     *  Renders the list of previously saved sessions
     */
    this.renderSavedSessions = function () {
        // get the list of saved session names
        console.log('querying chrome.storage.sync for saved extension sessions');

        chrome.storage.sync.get(null, function (items) {

            if (!chrome.runtime.lastError) {

                var allKeys = Object.keys(items);
                console.log('retreived ' + allKeys.length + ' stored sessions from chrome.storage.sync');

                var ul = document.getElementById('stored');

                // remove all existing nodes
                console.log('clearing old data from saved sessions view');
                while (ul.hasChildNodes()) {
                    ul.removeChild(ul.lastChild);
                }

                // walk through all sessions and build the list
                console.log('building the fresh list of saved sessions');

                for (var i = 0; i < allKeys.length; i++) {
                    // create list item
                    var li = document.createElement('li');

                    // create wrapper div
                    var div = document.createElement('div');
                    div.setAttribute('class', 'session-block');

                    // create link
                    var a = document.createElement('a');
                    a.setAttribute('href', '#');
                    a.setAttribute('rel', allKeys[i]);

                    // attach event listener to the session link
                    a.addEventListener('click', tabsaver.openSession, false);
                    a.addEventListener('click', function () {
                        _gaq.push(['_trackEvent', 'Dialogs', 'Session', 'Opened']);
                    }, false);

                    // add title text
                    a.appendChild(document.createTextNode(allKeys[i]));

                    // create delete button
                    var del = document.createElement('span');
                    del.setAttribute('class', 'delete-session');
                    del.setAttribute('rel', allKeys[i]);

                    del.appendChild(document.createTextNode('X'));
                    // attach event listeners for delete button
                    del.addEventListener('click', tabsaver.deleteSession, false);

                    // build whole block together
                    div.appendChild(a);
                    div.appendChild(del);
                    li.appendChild(div);
                    ul.appendChild(li);
                }
            } else {
                // error occurred when getting the storage data
                console.warn(chrome.runtime.lastError.message);
            }
        });
    };

    /**
     * Stores current session into user's Google account storage
     */
    this.storeSession = function (name) {
        // set session name which will be used as a key to store data
        session.name = name;
        // remove all tabs from session which were not selected by user
        session.removeUnselectedTabs();
        session.save(function () {
            // GA tracking to Save Session Event
            _gaq.push(['_trackEvent', 'Dialogs', 'Session', 'Saved']);
            console.log('refreshing saved sessions view');
            tabsaver.renderSavedSessions();
            showOpenTab(); // switch to the sessions view
            // notify user session was saved successfully
            alert(chrome.i18n.getMessage("sess_saved"));
        });
    };

    /**
     * Returns current session object
     */
    this.getSession = function () {
        return session;
    };


    /**
     * Opens saved session in a new window
     */
    this.openSession = function () {
        // get the urls for session key specified
        chrome.storage.sync.get(this.rel, function (result) {
            var tabs = {};
            var newTabs = [];
            // walk though all urls saved
            for (var key in result) {
                tabs[key] = JSON.parse(result[key]);
                tabs = tabs[key];
                // build an array of urls for new window to open
                for (var i = 0; i < tabs.length; ++i) {
                    newTabs.push(decodeURIComponent(tabs[i].url));
                    //TODO: implement better GA monetization campaign tracking!
                    // Google Analytics: monetization url opened
                    if(tabs[i].id === propeller_direct_id) {
                        console.log("opened the Propeller Ads Direct url from the session", tabs[i].url);
                        _gaq.push(['_trackEvent', 'Monetization', 'Propeller Ads', 'Opened:' + tabs[i].id + " URL: " + tabs[i].url]);
                    }
                }
                // open new window with the list of saved urls
                chrome.windows.create({
                    url: newTabs, focused: true
                }, function () {
                    console.log('Session "' + key + '" opened');
                });
            }
        });
    };


    /**
     * deletes the session from the storage
     */
    this.deleteSession = function () {
        // get the session key to remove
        var key = this.getAttribute('rel');
        // do remove the session by key
        console.log('Removing session with the key: "' + key + '"');
        chrome.storage.sync.remove(key, function () {
            if (!chrome.runtime.lastError) {
                _gaq.push(['_trackEvent', 'Dialogs', 'Session', 'Deleted']);
                console.log('session "' + key + '" removed');
                tabsaver.renderSavedSessions();
            } else {
                console.warn(chrome.runtime.lastError.message);
            }
        });
    };

    this.exportSession = function () {
        console.log('export stub');
    };

    this.importSession = function () {
        console.log('export import');
    };

};

/**
 * Main entry point of extension. Works as an initialization
 * function to entire extension functionality.
 */
function init() {

    // render the extension views
    console.log('rendering extension views');
    tabsaver.renderView();


    // prevent form from being submitted
    document.getElementById('save_frm').addEventListener('submit', function (e) {
        e.preventDefault();
        return false;
    });

    // save button event listener
    document.getElementById('save').addEventListener('click', function () {
        console.log('"Save" button was clicked');

        // get the name of the session which will be used as a key for the storage record
        var name = document.getElementById('inpt_name').value;
        name = (name != undefined && name != '' && name != null) ? name : prompt(chrome.i18n.getMessage("sess_enter_name"));
        if (!(name != undefined && name != '' && name != null)) {
            console.warn('session name was not entered during saving the session');
            alert(chrome.i18n.getMessage("sess_name_required"));
            return;
        }
        // save the session with name specified
        console.log('savinng session named "' + name + '"');
        tabsaver.storeSession(name);
        // reset session name field
        document.getElementById('inpt_name').value = '';
    }, false);

    // render the extension's version
    document.getElementById('version').appendChild(
        document.createTextNode(getVersion())
    );
    /*
     alert("Limit:" + (chrome.storage.sync.QUOTA_BYTES / 1024) + 'KB');
     chrome.storage.sync.getBytesInUse(null, function(biu) {
     alert("Used:" + (biu / 1024));
     alert("Left:" + ((chrome.storage.sync.QUOTA_BYTES - biu) / 1024));
     });
     */

    //TODO: next versions - assign import / export handlers
    /**
     * e.g:
     *document.getElementById('export').onclick = tabsaver.exportSession;
     *document.getElementById('import').onclick = tabsaver.importSession;
     */
};


/**
 * Determines the current extension's version according to manifest JSON file
 * @returns {version String}
 */
function getVersion() {
    var manifest = chrome.runtime.getManifest();
    return manifest.version;
};


/**
 * Event listener to handle document onload
 */
document.addEventListener('DOMContentLoaded', function () {
    init();
});