[**TabSaver**][Project Home] **/** [Docs][Documents Home] **/** [Specs][Specifications] **/** TabSaver UI
___

# TabSaver UI
## TabSaver UI Structure

From the beginning **TabSaver** was planned as a very simple Google Chrome extension with limited set of base functionality.
At that time it used to be the *one-button* Chrome **Session Saver & Restorer** application targeted to any audience type to provide simplest but flexible way of **Saving** active Web Browsing Experience into serialized `SessionData` objects synchronized between Owner's **authorized** devices to be later **Restored**, **Updated**, **Deleted** or **Shared** *on-demand*

As the *base* application was planned to stay simple, it seemed `400x600` pixels **fixed-size** pop-up `Window` was quite enough to handle it's only **two** different content views charged with the minimal set of controls. Therefore, the *top-level* TabSaver UI structure design was made of just few **static** elements wrapped around the **dynamic** Content represented by a `TabbedElement` section

## TabSaver UI Elements
From the top look, the extension's UI layout is composed of only three main sections: Header, Content and Footer. As it was already noted, due to simplified application requirements it was possible to utilize the easiest solution focussed on lightweight, functional, **fixed-size** user interaction dialog using the pure HTML, CSS and JavaScript code. Shortly about each top-level block below:

### Header Element
Header Element is the first UI element of the TabSaver extension used to display the extension's Branding Element containing title and version, and also Social Element which provides rounded buttons to TabSaver's social networks profile

### Footer Element
As an opposite to header, the Footer Element is the last UI element of the TabSaver extension used to display less relevant information like copyrighting, some external references and occasionally some of usage statistics

### Tabbed Element
Content element is a bit more complex UI section of the TabSaver extension used to represent it's main data. As the main extension's functionality is saving and restoring browser session tabs, Content element provides two different Views to Save and to Restore tabs respectively and uses `TabbedNavigation` to switch between this Views.

<!--//TODO: describe each view type (SessionDetailsView - for current session, 
	and SessionListView - for the list of saved sessions) //-->
**TabSaverUI**
- HeaderElement
	- SocialElement
	- BrandingElement
- TabbedElement
	- TabNavElement
	- TabViewElement
		- ToolbarElement
		
		
- FooterElement
	- CopyrightElement
	- UsageStatsElement














<!-- References:-->
___

[Project Home]: https://github.com/kdidenko/tabsaver "Project Home"
[Documents Home]: https://github.com/kdidenko/tabsaver/tree/master/docs/index.md "Documents Home"
[Specifications]: https://github.com/kdidenko/tabsaver/tree/master/docs/spec/index.md "Technical Specifications"
