
var paneMgr = Components.classes["@songbirdnest.com/Songbird/DisplayPane/Manager;1"]
                        .getService(Components.interfaces.sbIDisplayPaneManager);    

paneMgr.registerContent("chrome://tangoinfo/content/tangoinfo.xul", 
                        "tangoinfo",
                        "http://wikipedia.org/favicon.ico",
                        350,
                        350,
                        "contentpane",
                        true);
