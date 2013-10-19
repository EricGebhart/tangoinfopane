
// Make a namespace.
if (typeof extension == 'undefined') {
  var extension = {};
};



// Shorthand
if (typeof(Cc) == "undefined")
  var Cc = Components.classes;
if (typeof(Ci) == "undefined")
  var Ci = Components.interfaces;
if (typeof(Cu) == "undefined")
  var Cu = Components.utils;
if (typeof(Cr) == "undefined")
  var Cr = Components.results;
if (typeof(gMM) == "undefined")
    var gMM = Cc["@songbirdnest.com/Songbird/Mediacore/Manager;1"]
             .getService(Ci.sbIMediacoreManager);

Cu.import("resource://app/jsmodules/sbProperties.jsm");
Cu.import("resource://app/jsmodules/sbLibraryUtils.jsm")
Cu.import("resource://app/jsmodules/sbMetadataUtils.jsm");

var re_canta = new RegExp("[\[( ]+[Cc][Aa][Nn][Tt][Aa] +");
var re_with = new RegExp( "[\[( ][wW][Ii][Tt][Hh]");
var re_con = new RegExp( "[\[( ]+[Cc][Oo][Nn] +");
var re_featuring = new RegExp( "[\[( ][Ff][Ee][Aa][Tt][Uu][Rr][Ee][Ii][Nn][Gg]");
var re_feat = new RegExp( "[\[( ][Ff][Ee][Aa][Tt]\.");
var re_voc = new RegExp( "[\[( ][Vv][Oo][Cc]\.");




// displaypane menu.
function onDisplayPaneMenuPopup(commandString, menupopup, documentElement) {
  switch (commandString) {
    case "create":

      extension._menupopup = menupopup;

      var _strings = document.getElementById("tangoinfo-songbird-stringlink");

      // Submenu of show 'selected' or show 'playing'
      var submenu1 = documentElement.createElement("menu");
      submenu1.setAttribute("label", "Track");
      menupopup.appendChild(submenu1);

      var menu1 = documentElement.createElement("menupopup");
      submenu1.appendChild(menu1);

      var menuitem1 = documentElement.createElement("menuitem");
      menuitem1.setAttribute("label", "show selected");
      menuitem1.setAttribute("type", "radio");
      menuitem1.addEventListener("command", function(){extension.Controller.switchSelected();}, false);
      menu1.appendChild(menuitem1);

      var menuitem2 = documentElement.createElement("menuitem");
      menuitem2.setAttribute("label", "show playing");
      menuitem2.setAttribute("type", "radio");
      menuitem2.addEventListener("command", function(){extension.Controller.switchPlaying();}, false);
      menu1.appendChild(menuitem2);

      // Initialise our checked state based on the extension's saved pref
      if (extension.currentMode == "selected")
        menuitem1.setAttribute("checked", "true");
      else
        menuitem2.setAttribute("checked", "true");

      // Submenu for data source: Tango.info, todotango or wikipedia
      var submenu2 = documentElement.createElement("menu");
      submenu2.setAttribute("label", "Source");
      menupopup.appendChild(submenu2);

      var menu2 = documentElement.createElement("menupopup");
      submenu2.appendChild(menu2);

      // Radio buttons for content. Either todo tango, tango.info or wikipedia
      // Todo Tango Radio Button
      var menuitem3 = documentElement.createElement("menuitem");
      menuitem3.setAttribute("label", "Todo Tango");
      menuitem3.setAttribute("type", "radio");
      menuitem3.addEventListener("command", function(){extension.controller.switchtodotango();}, false);
      menu2.appendchild(menuitem3);

      // tango info radio button
      var menuitem4 = documentelement.createelement("menuitem");
      menuitem4.setattribute("label", "tango info");
      menuitem4.setattribute("type", "radio");
      menuitem4.addeventlistener("command", function(){extension.controller.switchtangoinfo();}, false);
      menu2.appendChild(menuitem4);

      // Wikipedia Radio Button
      var menuitem5 = documentElement.createElement("menuitem");
      menuitem5.setAttribute("label", "Wikipedia");
      menuitem5.setAttribute("type", "radio");
      menuitem5.addEventListener("command", function(){extension.Controller.switchwiki();}, false);

      menu2.appendChild(menuitem5);

      // Initialise our checked state based on the extension's saved pref
      // We are going to show todotango or tangoinfo or wikipedia. Wikipedia happens
      // if the genre isn't tango, vals or milonga or if it is checked.
      if (extension.currentInfoMode == "todotango")
        menuitem3.setAttribute("checked", "true");
      else if (extension.currentInfoMode == "tangoinfo")
        menuitem4.setAttribute("checked", "true");
      else
        menuitem5.setAttribute("checked", "true");

      break;

    case "destroy":
          // menus get destroyed and recreated each time we use them.
          // if they aren't getting destroyed completely then there is an error
          // in one of the extensions with sub-menus.
          if (extension._menupopup){
              while(extension._menupopup.hasChildNodes()){
                extension._menupopup.removeChild(extension._menupopup.firstChild);
              }
          }
      break;

    default:
      break;
  }
}



  extension.currentMode=null;

  extension.Listener = {

      _propertyManager: Cc["@songbirdnest.com/Songbird/Properties/PropertyManager;1"]
                      .getService(Ci.sbIPropertyManager),
          _mediaListView: null,
          _gBrowser: null,
          _DateFormat: null,
          last_url: "",

         xlate : [
            {key:192, char:"A"},
            {key:193, char:"A"},
            {key:194, char:"A"},
            {key:195, char:"A"},
            {key:196, char:"A"},
            {key:197, char:"A"},
            {key:198, char:"A"},
            {key:199, char:"C"},
            {key:200, char:"E"},
            {key:201, char:"E"},
            {key:202, char:"E"},
            {key:203, char:"E"},
            {key:204, char:"I"},
            {key:205, char:"I"},
            {key:206, char:"I"},
            {key:207, char:"I"},
            {key:208, char:"D"},
            {key:209, char:"N"},
            {key:210, char:"O"},
            {key:211, char:"O"},
            {key:212, char:"O"},
            {key:213, char:"O"},
            {key:214, char:"O"},
            {key:215, char:"x"},
            {key:216, char:"0"},
            {key:217, char:"U"},
            {key:218, char:"U"},
            {key:219, char:"U"},
            {key:220, char:"U"},
            {key:224, char:"a"},
            {key:225, char:"a"},
            {key:226, char:"a"},
            {key:227, char:"a"},
            {key:228, char:"a"},
            {key:229, char:"a"},
            {key:231, char:"c"},
            {key:232, char:"e"},
            {key:233, char:"e"},
            {key:234, char:"e"},
            {key:235, char:"e"},
            {key:236, char:"i"},
            {key:237, char:"i"},
            {key:238, char:"i"},
            {key:239, char:"i"},
            {key:241, char:"n"},
            {key:242, char:"o"},
            {key:243, char:"o"},
            {key:244, char:"o"},
            {key:245, char:"o"},
            {key:246, char:"o"},
            {key:249, char:"u"},
            {key:250, char:"u"},
            {key:251, char:"u"},
            {key:252, char:"u"}
          ],

      set_search_keyword: function(){
          this.search = this.album_artist;
          if (document.getElementById("TI-AA").checked == true)
              this.search = this.album_artist;
          if (document.getElementById("TI-A").checked == true)
              this.search = this.artist;
          if (document.getElementById("TI-C").checked == true)
              this.search = this.composer;
          if (document.getElementById("TI-TN").checked == true)
              this.search = this.trackname;

      },

      get_current_item: function(item){
        this.search="";
        if (item){
            this.genre = item.getProperty(SBProperties.genre);

            this.album_artist = item.getProperty(SBProperties.albumArtistName);
            this.artist = item.getProperty(SBProperties.artistName);
            this.trackname = item.getProperty(SBProperties.trackName);
            this.composer = item.getProperty(SBProperties.composerName);
            if (this.album_artist == "") {
                this.album_artist = this.artist;
            }

            this.albumName = item.getProperty(SBProperties.albumName);

            this.set_search_keyword();

        }
      },

      setSelectedDeck:function(){
        var item = null;
        if(this._mediaListView)
           item = this._mediaListView.selection.currentMediaItem;

        this.get_current_item(item);

        this.loadArtist();
      },

      setPlayingDeck:function(){
        if ((gMM.status.state == Ci.sbIMediacoreStatus.STATUS_PLAYING) ||
            (gMM.status.state == Ci.sbIMediacoreStatus.STATUS_PAUSED) ||
            (gMM.status.state == Ci.sbIMediacoreStatus.STATUS_BUFFERING))
        {
            var item = gMM.sequencer.currentItem;

            this.get_current_item(item);

            this.loadArtist();
        }
      },

      load_current: function(){
        if (extension.currentMode=="playing"){
          this.setPlayingDeck();
        }
        if (extension.currentMode=="selected"){
          this.setSelectedDeck();
        }
      },

      onPlaybackChanged:function(){
        if (extension.currentMode=="playing"){
          this.setPlayingDeck();
        }

        var view = gMM.sequencer.view;
        if (view) {
            var item = view.getItemByIndex(gMM.sequencer.viewPosition);
            this._commitMediaItem(item, "extension-playing-label-");
        }
      },

      onPlaylistSelectionChanged: function() {
        if (extension.currentMode=="selected"){
          this.setSelectedDeck();
        }

        var item = this._mediaListView.selection.currentMediaItem;

        this._commitMediaItem(item, "extension-label-");
      },

      _commitMediaItem:function(item, prefix){

      },

      tabchangefunction:function(){
          if (extension)
              if (extension.Listener)
                  if (extension.Listener.onTabContentChange)
                      extension.Listener.onTabContentChange()
      },

      init: function() {
        //Listener
        this.browser = document.getElementById("tangoinfo.browser");

        var windowMediator = Cc["@mozilla.org/appshell/window-mediator;1"]
                              .getService(Ci.nsIWindowMediator);

        var windowMediator = Cc["@mozilla.org/appshell/window-mediator;1"]
                              .getService(Ci.nsIWindowMediator);

        var songbirdWindow = windowMediator.getMostRecentWindow("Songbird:Main");
        this._gBrowser = songbirdWindow.gBrowser;

        // Add listener for tab change.
        extension.Listener._gBrowser.addEventListener(
          'TabContentChange',
          this.tabchangefunction,
          false
        );

        //Add/remove listener to/from current/last media list.
        extension.Listener.onTabContentChange();

        //Listener for Played Item
        gMM.addListener(this);


        // load something if we can.
        //extension.Listener.onPlaybackChanged();
        //extension.Listener.onPlaylistSelectionChanged();

      },

      onUnLoad:function(){
        gMM.removeListener(this);
        extension.Listener._gBrowser.removeEventListener(
          'TabContentChange',
          this.tabchangefunction,
          false
        );
      },

      onMediacoreEvent: function(ev) {
        switch (ev.type) {
          case Ci.sbIMediacoreEvent.TRACK_CHANGE:
          case Ci.sbIMediacoreEvent.STREAM_STOP:
          case Ci.sbIMediacoreEvent.STREAM_END:
            this.onPlaybackChanged();
            break;
          default:
            break;
        }
      },

      onBeforeTrackChange: function() {},
      onViewChange: function() {},
      onBeforeViewChange: function() {},
      onTrackIndexChange: function() {},

      //Add/remove listener to/from current/last media list.
      onTabContentChange: function() {
        if(this._mediaListView) {
          this._mediaListView.selection.removeListener(this);
        }
        this._mediaListView = this._gBrowser.currentMediaListView;
        if (this._mediaListView != null) {
          this._mediaListView.selection.addListener(this);

          this.onSelectionChanged();
        }
      },

      onSelectionChanged: function() {
        this.onPlaylistSelectionChanged();
      },

      onCurrentIndexChanged: function() {
        //NOTHING
      },

    clean_string: function(string){
        var words = string.split(" ");
        var dobreak = false;
        var keyword = "";
        for (var i=0;!dobreak && i<words.length;i++) {
          var word = words[i];
          var subwords = word.split("_");
          for (var j=0;!dobreak && j<subwords.length;j++) {
            var subword = subwords[j];
            if (subword.charAt(subword.length-1) == '.') subword = subword.slice(0, subword.length-1); // remove final '.'
            if (subword.charAt(subword.length-1) == '-') subword = subword.slice(0, subword.length-1); // remove final '-'
            var e = this.excludedChars(subword);
            if (e > -1) {
              subword = subword.substr(0, e);
              dobreak = true;
              if (e == 0) break;
            }
            if (keyword != "") keyword += "+";
            keyword += subword.slice(0, 1).toUpperCase() + subword.slice(1);
        // Original was: "keyword += subword.slice(0, 1).toUpperCase() + subword.slice(1).toLowerCase();"
          }
        }
    return(keyword);
    },

  loadArtist: function() {
    var url;
    //var artist = artistdataremote.stringValue;
    if (!this.search)
        this.search = "";
    if (!this.genre)
        this.genre = "";
    var clean_search="";

    // replace accent characters with english ones. :-(  blech. But it works.
    for (var k=0; k < this.search.length; k++)
        clean_search = clean_search.concat(this.fix_chars(this.search.charAt(k)));

    this.keyword = this.clean_string(clean_search);
    this.genre = this.genre.toLowerCase();

    var url = this.build_url();

    if (url == this.lasturl) return;

    this.lasturl = url;

    // something is wrong here...
    // alert(url);
    this.browser = document.getElementById("tangoinfo.browser");
    extension.browser.loadURI(url, null, null);
  },

   build_url: function() {
    var url = "";
    url = "http://www.tango.info/eng"

    if (extension.currentInfoMode == "wikipedia"){
        // we are going to wikipedia.
        url = "http://en.wikipedia.org/w/index.php?title=" + escape(this.keyword) + "&printable=yes";

    } else {

        // Just go to the top of the site instead of search if the genre doesn't match
        if (!(this.genre == "tango" || this.genre == "vals" || this.genre == "milonga") )
            this.keyword = "";

        if (extension.currentInfoMode == "tangoinfo"){
            // tangoinfo
            if (this.keyword == ""){
                url = "http://www.tango.info/eng"
            } else {
                url = "http://tango.info/?q=" + escape(this.keyword);
            }
        }

        if (extension.currentInfoMode == "todotango"){
            // todotango
            if (this.keyword == ""){
                url = "http://www.todotango.com/english/creadores/default.asp"
            } else {
                url = "http://www.todotango.com/english/Buscador_resultados.aspx?cx=001934125180297279526%3Ahgopipygwny&cof=FORID%3A10&ie=UTF-8&q=" + escape(this.keyword) + "&sa=Buscar"
                //url = "http://www.google.com/search?btnI=I%27m+Feeling+Lucky" +
                 //     "&ie=UTF-8&oe=UTF-8&q=" + "site:todotango.com " + escape(this.keyword);
            }
        }
    }
    return url;
   },

   fix_chars: function (match) {
       code = match.charCodeAt(0);
       if (code < 128)
           return(match);

      for(var i=0; i< this.xlate.length; i++)
          if (this.xlate[i].key == code)
              return (this.xlate[i].char);
      return(match);

    },

  excludedChars: function (str) {
    for (var i=0;i<str.length;i++) {
      var c = str.charCodeAt(i);
      if (c == 0x21) continue; // allow '!'
      if (c == 0x2D) continue; // allow '-'
      if (c == 0x27) continue; // allow "'"
      if (c >= 0x30 && c <= 0x93) continue; // allow 0 to 9
      // disallow non characters
      if (c < 0x41) return i;
      if (c > 0x5A && c < 0x61) return i;
      if (c > 0x7A && c < 0xC0) return i;
    }
    return -1;
  },


};

extension.SBtrackview = {
    rowCount : 1,

    init: function(dialog, track){
        this.tracksDialog = Dialog;
        this.track = track;
    },

    setView: function(){
        //alert("Dialog SetView: " + this.tracksDialog.document.getElementById('SBtrackstree'));
        this.tracksDialog.document.getElementById('SBtrackstree').view = this;
    },

    getCellText : function(row,column){
       return(this.track.getProperty(SBProperties[column.id]));
    },

    setTree: function(treebox){ this.treebox = treebox; },
    isContainer: function(row){ return false; },
    isSeparator: function(row){ return false; },
    isSorted: function(){ return false; },
    getLevel: function(row){ return 0; },
    getImageSrc: function(row,col){ return null; },
    getRowProperties: function(row,props){},
    getCellProperties: function(row,col,props){},
    getColumnProperties: function(colid,col,props){},
};

extension.TItrackview = {
    rowCount : 1,

    init: function(dialog, track){
        this.tracksDialog = Dialog;
        this.track = track;
    },

    setView: function(){
        //alert("Dialog SetView: " + this.tracksDialog.document.getElementById('TItrackstree'));
        this.tracksDialog.document.getElementById('TItrackstree').view = this;
    },

    getCellText : function(row,column){
        return (this.track[column.id.slice(2)]);
    },

    setTree: function(treebox){ this.treebox = treebox; },
    isContainer: function(row){ return false; },
    isSeparator: function(row){ return false; },
    isSorted: function(){ return false; },
    getLevel: function(row){ return 0; },
    getImageSrc: function(row,col){ return null; },
    getRowProperties: function(row,props){},
    getCellProperties: function(row,col,props){},
    getColumnProperties: function(colid,col,props){},
};

String.prototype.splitCSV = function(sep) {
  for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
    if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
      } else if (x) {
        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
      } else foo = foo.shift().split(sep).concat(foo);
    } else foo[x].replace(/""/g, '"');
  } return foo;
};

extension.tracks = {

    fields : {
        "in_count" : 0,
        "tinp" : 1,
        "album" : 2,
        "album-artist" : 3,
        "discnumber" : 4,
        "tracknumber" : 5,
        "tiwc" : 6,
        "title" : 7,
        "artist" : 8,
        "genre" : 9,
        "date" : 10,
        "iso-639-3" : 11,
        "album-collection" : 12,
        "tinp-replacement" : 13
    },

    // this is a temporary holder for any track values we update.
    SBTrack : {
        "album" : null,
        "albumArtist" : null,
        "discNumber" : null,
        "trackNumber" : null,
        "trackName" : null,
        "artistName" : null,
        "genre" : null,
        "year" : null,
        "comment" : null,
        "description" : null
    },

    init: function(){
    },


    load: function(tracks){
        array=tracks.split('\n');
        this.rowCount = array.length;

        this.tracks=[];
        for (var i=0;i < array.length; i++) {
            this.tracks[i] = array[i].splitCSV(';');
        }
        //alert(this.tracks);
        //this.test_getfields();
    },

    open_confirm_tracks_dialog: function(){

        this.do_track_update = true;

        this.confirmtracksDialog = window.openDialog(
            'chrome://tangoinfo/content/track_confirm.xul','showtracks',
            'resizable=yes,scrollbars=yes,width=1000,height=800,chrome=yes');

        extension.SBtrackview.init(this.confirmtracksDialog, this.current_item);
        extension.TItrackview.init(this.confirmtracksDialog, this.SBTrack);

        this.confirmtracksDialog.ondialogcancel = this.cancel_track_update();

        this.confirmtracksDialog.addEventListener("DOMContentLoaded",
          function() { extension.TItrackview.setView(); }, true);
        this.confirmtracksDialog.addEventListener("DOMContentLoaded",
          function() { extension.SBtrackview.setView(); }, true);

    },

    open_showtracks_dialog: function(){
        //alert("show tracks");
        this.tracksDialog = window.open(
        //this.tracksDialog = window.openDialog(
            'chrome://tangoinfo/content/tracks.xul','showtracks',
            'resizable=yes,scrollbars=yes,width=1000,height=800,chrome=yes');

        this.tracksDialog.addEventListener("DOMContentLoaded",
          function() { extension.tracks.dialog_setView(); }, true);
    },

    showtracks: function(){
        //this.open_showtracks_dialog();
        var trackstree = document.getElementById("trackstree");
        trackstree.view = this;
    },

    dialog_setView: function(){
        //alert("Dialog SetView: " + this.tracksDialog.document.getElementById('trackstree'));
        this.tracksDialog.document.getElementById('trackstree').view = this;
    },

    test_getfields: function(){
        for ( var property in this.fields){
            alert(property + ": " + this.tracks[0][this.fields[property]]);
        }
    },

    getCellText : function(row,column){
        return (this.tracks[row][this.fields[column.id]]);
    },

    setTree: function(treebox){ this.treebox = treebox; },
    isContainer: function(row){ return false; },
    isSeparator: function(row){ return false; },
    isSorted: function(){ return false; },
    getLevel: function(row){ return 0; },
    getImageSrc: function(row,col){ return null; },
    getRowProperties: function(row,props){},
    getCellProperties: function(row,col,props){},
    getColumnProperties: function(colid,col,props){},

  get_checkboxes: function(){
    this.checkboxes = {}
    this.checkboxes.ti_AA = document.getElementById("TI_AArtist");
    this.checkboxes.ti_A = document.getElementById("TI_Artist");
    this.checkboxes.ti_extract_from_A = document.getElementById("TI_AA_A");
    //this.checkboxes.ti_A_instrumental = document.getElementById("TI_A_instrumental");
    this.checkboxes.ti_trackname = document.getElementById("TI_trackname");
    this.checkboxes.ti_album_title = document.getElementById("TI_album-title");
    //this.checkboxes.ti_discnumber = document.getElementById("TI_disc-number");
    this.checkboxes.ti_genre = document.getElementById("TI_genre");
    this.checkboxes.ti_year = document.getElementById("TI_year");
    this.checkboxes.ti_tinp = document.getElementById("TI_tinp");
    this.checkboxes.ti_collection = document.getElementById("TI_Collection");
    this.checkboxes.ti_perfDate = document.getElementById("TI_perfDate");
    this.checkboxes.ti_onlyempty = document.getElementById("TI_onlyEmpty");
    this.checkboxes.ti_comment = document.getElementById("TI_comment");
    this.checkboxes.ti_description = document.getElementById("TI_description");
    this.checkboxes.ti_append = document.getElementById("TI_append");
    this.checkboxes.ti_update = document.getElementById("TI_update");
    this.checkboxes.ti_prepend = document.getElementById("TI_prepend");
  },

  clear: function(){
       this.get_checkboxes();
       this.checkboxes.ti_AA.setAttribute("checked", "false");
       this.checkboxes.ti_A.setAttribute("checked", "false");
       this.checkboxes.ti_extract_from_A.setAttribute("checked", "false");
       //this.checkboxes.ti_A_instrumental.setAttribute("checked", "false");
       this.checkboxes.ti_trackname.setAttribute("checked", "false");
       this.checkboxes.ti_album_title.setAttribute("checked", "false");
       //this.checkboxes.ti_discnumber.setAttribute("checked", "false");
       this.checkboxes.ti_genre.setAttribute("checked", "false");
       this.checkboxes.ti_year.setAttribute("checked", "false");
       this.checkboxes.ti_tinp.setAttribute("checked", "false");
       this.checkboxes.ti_collection.setAttribute("checked", "false");
       this.checkboxes.ti_perfDate.setAttribute("checked", "false");
       this.checkboxes.ti_onlyempty.setAttribute("checked", "false");
  },

  select_all: function(){
       this.get_checkboxes();
       this.checkboxes.ti_AA.setAttribute("checked", "true");
       this.checkboxes.ti_A.setAttribute("checked", "true");
       this.checkboxes.ti_extract_from_A.setAttribute("checked", "true");
       //this.checkboxes.ti_A_instrumental.setAttribute("checked", "true");
       this.checkboxes.ti_trackname.setAttribute("checked", "true");
       this.checkboxes.ti_album_title.setAttribute("checked", "true");
       //this.checkboxes.ti_discnumber.setAttribute("checked", "true");
       this.checkboxes.ti_genre.setAttribute("checked", "true");
       this.checkboxes.ti_year.setAttribute("checked", "true");
       this.checkboxes.ti_tinp.setAttribute("checked", "true");
       this.checkboxes.ti_collection.setAttribute("checked", "true");
       this.checkboxes.ti_perfDate.setAttribute("checked", "true");
       this.checkboxes.ti_onlyempty.setAttribute("checked", "true");
  },

  doit: function() {
    this.get_checkboxes();

    this.onlyempty = this.checkboxes.ti_onlyempty.getAttribute("checked");

    this._mainWindow = top; // if we are a sidebar?
    // loop over selected tracks, process each one.
    this.mediaListView = this._mainWindow.gBrowser.currentMediaListView;
    var selection = this.mediaListView.selection;
    var count = selection.count;
    this.selected_tracks = selection.selectedMediaItems;
    // keep track of what we changed.
    this.tracks_we_changed = [];
    // we have to keep track of the properties we need to write.
    this.writeProperties = [];

    //alert("About to process: " + count + " Records.");
    for (var i=0;i<count;i++) {

        if (count > this.rowCount)
            break;
        this.current_item = this.selected_tracks.getNext();
        // find the matching track and discnumber and use that record.
        this.matching_ti_track = this.find_track_by_number();

        if (this.matching_ti_track == null)
            continue;

        // Pop a confirm dialog here if so desired, one per track.
        // Showing the current item and the matching track from tango.info


        // get field values to update.
        this.process_track();

        this.do_track_update = true;

        //alert(this.updatefields);
        //this.print_SBTrack();

        //this.open_confirm_tracks_dialog();

        //if dialog approved else blank SBTrack.
        if (this.do_track_update == true){

            this.apply_track_update();

        } else {
            this.cancel_track_update();
        }
    }

    // tell songbird what we changed so it can update the media and the database.
    if (this.tracks_we_changed.length > 0 && this.writeProperties.length > 0) {
        sbMetadataUtils.writeMetadata(this.tracks_we_changed,
                                      this.writeProperties,
                                      window,
                                      this.mediaListView.mediaList);
    }

  },

  cancel_track_update: function(){
      this.do_track_update = true;
      this.blank_properties();
  },

  apply_track_update: function(){
       this.update_properties();
       this.tracks_we_changed.push(this.current_item);
  },

  // go checkbox by checkbox and set the fields.
  process_track: function(){

    this.updatefields=[];

    // Parse Artist for Album artist and artist.
    if(this.checkboxes.ti_extract_from_A.getAttribute("checked") == "true"){
        this.Split_artist_into_artist_and_album_artist();

    } else { // just set artist and album artist as is.

        if(this.checkboxes.ti_AA.getAttribute("checked") == "true"){
            this.set_SBTrack('albumArtistName', 'album-artist');
        }

        if(this.checkboxes.ti_A.getAttribute("checked") == "true"){
            this.set_SBTrack('artistName', 'artist');
        }

    }


    if(this.checkboxes.ti_album_title.getAttribute("checked") == "true"){
        this.set_SBTrack('albumName', 'album');
    }

    if(this.checkboxes.ti_genre.getAttribute("checked") == "true"){
        this.set_SBTrack('genre', 'genre');
    }

    //if(this.checkboxes.ti_discnumber.getAttribute("checked") == "true"){
    //    this.set_SBTrack('discNumber', 'discnumber');
    //}

    if(this.checkboxes.ti_trackname.getAttribute("checked") == "true"){
        this.set_SBTrack('trackName', 'title');
    }

    // Clear artist if artist and album artist match
    //if(this.checkboxes.ti_A_instrumental.getAttribute("checked") == "true"){
    //    this.clear_artist_if_album_artist_matches();
    //}

    // get year from performance date
    if(this.checkboxes.ti_year.getAttribute("checked") == "true"){
        this.SBTrack['year'] = this.get_year_from_perf_date();
    }

    this.build_comment();

  },

  set_SBTrack: function(SBname, ti_name){
    this.SBTrack[SBname] = this.get_ti_field(ti_name);
    this.updatefields.push(SBname);
  },

  build_comment: function(){

    if(this.checkboxes.ti_comment.selected == true)
        var property = 'comment';
    else
        var property = 'description';

    var comment = this.current_item.getProperty(SBProperties[property]);

    if (comment == null)
        comment = "";

    var addon=[];

    if(this.checkboxes.ti_collection.getAttribute("checked") == "true"){
        if (this.get_ti_field('album-collection').length > 0)
            addon.push("Collection: " + this.get_ti_field('album-collection'));
    }

    if(this.checkboxes.ti_perfDate.getAttribute("checked") == "true")
        if (this.get_ti_field('date').length > 0)
            addon.push("Performance: " + this.get_ti_field('date'));

    if(this.checkboxes.ti_tinp.getAttribute("checked") == "true")
        addon.push("TINP: " + this.get_ti_field('tinp'));

    // save it if it changed.
    var new_comment = "";
    if (addon.length > 0){

        for (part in addon){
            if (new_comment.length > 0)
                new_comment = new_comment.concat("  ");
            new_comment = new_comment.concat(addon[part]);
        }


        if(this.checkboxes.ti_append.selected == true)
            comment = comment.concat(new_comment);
        if(this.checkboxes.ti_update.selected == true)
            comment = new_comment;
        if(this.checkboxes.ti_prepend.selected == true)
            comment = new_comment.concat(comment);


        this.updatefields.push(property);
        this.SBTrack[property] = comment;
    }
  },

  print_SBTrack: function(){
      for (var i=0; i < this.updatefields.length; i++){

        alert(this.SBTrack[this.updatefields[i]]);
      }
  },

  update_properties: function(){
      for (var i=0; i < this.updatefields.length; i++){

        field = this.updatefields[i];

        this.set_property(SBProperties[field], this.SBTrack[field]);
        this.SBTrack[field] = null;
      }
  },

  blank_properties: function(){
      for (field in this.updatefields){
        this.SBTrack[field] = null;
      }
  },

  get_year_from_perf_date: function(){
        var date = this.get_ti_field('date');
        if (date == null || date.length == 0)
            return(null);
        date = date.toString();

        this.updatefields.push('year');

        // 1935-1956 vs. 1937-03-25, 1937--1958, 1937-12, 1937--12
        // basically if it is two four digit numbers skip it.
        // Otherwise get the year off the front.
        if (date.match('[0-9][0-9][0-9][0-9]-*[0-9][0-9][0-9][0-9]') == true){
            return(null);
        }
        return (parseInt(date).toString());
  },

  get_ti_field: function(id){
        return (this.matching_ti_track[this.fields[id]]);
  },

  find_track_by_number: function(){
      for(var row=0; row < this.rowCount; row++){
        track = this.tracks[row][this.fields['tracknumber']];
        disc = this.tracks[row][this.fields['discnumber']];
        current_tracknumber = this.current_item.getProperty(SBProperties.trackNumber);
        current_discnumber = this.current_item.getProperty(SBProperties.discNumber);
        //alert ("find track: " + track + ":" + disc + "    " + current_tracknumber + ":" + current_discnumber);
        if(track != current_tracknumber){
            //alert("continuing");
            continue;
        }
        if(current_discnumber == disc || current_discnumber == null){
            //alert(this.tracks[row]);
            return (this.tracks[row]);
        }
      }
      return(null);
  },

  set_property: function(property, value){
      // if only empty is checked then bail if the field isn't empty.
      if(this.onlyempty){
          var test_value = this.current_item.getProperty(property);
          if (test_value != null)
             return;
      }

      // set the property.
      this.current_item.setProperty(property, value);
      // keep track of the properties that have changed.
      this.writeProperties.push(property);

  },

  find_orchestra_and_artist: function(string){

        var split_value = this.find_artist_in_string(string);

        split_value[0] = this.fix_first_last(split_value[0]);

        return (split_value);
  },

  fix_first_last: function(name){
        // split, reverse and join with a space between.
        // return(' '.join(name.split(',')[::-1]))
        if (name.length && name.indexOf(',') != -1){
            var split_name = name.split(',');
            // Need to remove leading and trailing spaces on the pieces.
            var newname = "";
            var count = split_name.length;
            for (var i=count;i>0;i--){
                if (i < count)
                    newname = newname + " ";
                newname = newname + split_name[i-1].trim();
            }

            return (newname);
        } else
            return (name);
  },

  find_artist_in_string: function(string){
      //orchestra followed by  voce./with/con/Canta/featuring/feat./(singer)
      var artist = string;
      var parts= [];
      // get rid of with/con/Canta/featuring/feat. replace with |.
      artist = artist.replace( re_canta, '|');
      artist = artist.replace( re_with, '|');
      artist = artist.replace( re_con, '|');
      artist = artist.replace( re_featuring, '|');
      artist = artist.replace( re_feat, '|');
      artist = artist.replace( re_voc, '|');

      // found one of those. get rid of the () and split it.
      if (artist.indexOf('|') != -1){
          //split it.
          artist=artist.replace( '(', '' );
          artist = artist.replace( ')', '' )
          artist = artist.replace( '[', '|' )
          artist = artist.replace( ']', '' )
          artist=artist.replace( ':', '' );
          parts=artist.split('|');
          // try to split it at the (,[ or - and get rid of the ) and ].
      }else{
          artist = artist.replace( '-', '|' )
          artist = artist.replace( '[', '|' )
          artist = artist.replace( '(', '|' )
          artist = artist.replace( ')', '' )
          artist = artist.replace( ']', '' )
          //split it.
          parts=artist.split('|');
      }

      parts[0] = parts[0].trim();

      if (parts.length > 1)
          parts[1] = parts[1].trim();

      return(parts);
  },

  // Extract album artist and artist from artist. Blank artist if none found.
  // Also fixes lastname, firstname.
  Split_artist_into_artist_and_album_artist: function() {
      var artist = this.get_ti_field('artist');
      var split_value = this.find_orchestra_and_artist(artist);


      if(this.checkboxes.ti_AA.getAttribute("checked") == "true"){
          this.SBTrack['albumArtistName'] = split_value[0].trim();
          this.updatefields.push('albumArtistName');
      }
      if(this.checkboxes.ti_A.getAttribute("checked") == "true"){
          if(split_value.length > 1)
              this.SBTrack['artistName'] = split_value[1].trim();
          else{
              this.SBTrack['artistName'] = null;
          }
          this.updatefields.push('artistName');
      }
  },



  clear_artist_if_album_artist_matches: function(){
      if (this.SBTrack['artistName'] == this.SBTrack['albumArtistName']){
          this.SBTrack['artistName'] = null;
          //if (!'artistName' in this.updatefields)
          // wont matter if this updates twice, it was supposed to be
          // empty anyway.
          this.updatefields.push('artistName');
      }
  },

};

/**
* Controller for pane.xul
*/

extension.Controller = {

  _isURL: null,
  _isBIT: null,
  _isSAM: null,
  _isPLC: null,
  _isSCC: null,
  _displayPane: null,

  _prefs: null,


  switchPlaying: function(){
    extension.currentMode="playing";
    extension.Listener.setPlayingDeck();
  },

  switchSelected: function(){
    extension.currentMode="selected";
    extension.Listener.setSelectedDeck();
  },

  switchtodotango: function(){
    extension.currentInfoMode="todotango";
    extension.Listener.setSelectedDeck();
  },

  switchtangoinfo: function(){
    extension.currentInfoMode="tangoinfo";
    extension.Listener.setSelectedDeck();
  },

  switchwiki: function(){
    extension.currentInfoMode="wikipedia";
    extension.Listener.setSelectedDeck();
  },


  onLoad: function() {
    this._initialized = true;

    //document = window.document;


    extension.browser = document.getElementById("tangoinfo.browser");

    extension.browser.addEventListener("DOMContentLoaded",
          function() { extension.Controller.browser_page_loaded(); }, true);

    extension.find = extension.browser.webBrowserFind;
    extension.find.wrapFind = true;

    extension.tiframe = document.getElementById("tangoinfo_tracktagger");

    extension.tiframe.addEventListener("DOMContentLoaded",
          function() { extension.Controller.iframe_loaded(); }, true);


    this.lasturl = "";
    // Make a local variable for this controller so that
    // it is easy to access from closures.
    var controller = this;

    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                    .getService(Components.interfaces.nsIPrefService);

    prefs = prefs.getBranch("extensions.tangoinfo.");

    extension.currentMode=prefs.getCharPref("lastMode");
    extension.currentInfoMode=prefs.getCharPref("lastInfoMode");

    if (!extension.currentMode)
        extension.currentMode = "selected";

    if (!extension.currentInfoMode)
        extension.currentInfoMode = "tangoinfo";

    // Get our displayPane

    var displayPaneManager = Cc["@songbirdnest.com/Songbird/DisplayPane/Manager;1"]
                                .getService(Ci.sbIDisplayPaneManager);
    var dpInstantiator = displayPaneManager.getInstantiatorForWindow(window);

    if (dpInstantiator) {
      this._displayPane = dpInstantiator.displayPane;
    }

    this._viewTracks = document.getElementById("ViewTracks");
    this._viewTracks.addEventListener("command",
         function() { extension.Controller.view_tango_info(); }, false);

    this._ti_clearbutton = document.getElementById("TI_clear");
    this._ti_clearbutton.addEventListener("command",
         function() { extension.tracks.clear(); }, false);

    this._ti_selectall = document.getElementById("TI_select");
    this._ti_selectall.addEventListener("command",
         function() { extension.tracks.select_all(); }, false);

    this._ti_apply = document.getElementById("TI_Apply");
    this._ti_apply.addEventListener("command",
         function() { extension.tracks.doit(); }, false);

    this._backbutton = document.getElementById("backbutton");
    this._backbutton.addEventListener("command",
         function() { extension.Controller.back(); }, false);

    this._forwardbutton = document.getElementById("forwardbutton");
    this._forwardbutton.addEventListener("command",
         function() { extension.Controller.forward(); }, false);

    this._findbutton = document.getElementById("findbutton");
    this._findbutton.addEventListener("command",
         function() { extension.Controller.findnext(); }, false);

    this._helpbutton = document.getElementById("helpbutton");
    this._helpbutton.addEventListener("command",
         function() { extension.Controller.loadHelpPage(); }, false);


    this._searchfield = document.getElementById("SearchField");
    this._searchfield.addEventListener("command",
         function() { extension.Controller.find_on_page(); }, false);

    this._TI_AA_radio = document.getElementById("TI-AA");
    this._TI_AA_radio.addEventListener("command",
           function() { extension.Controller.get_current_item(); }, false);

    this._TI_A_radio = document.getElementById("TI-A");
    this._TI_A_radio.addEventListener("command",
           function() { extension.Controller.get_current_item(); }, false);

    this._TI_C_radio = document.getElementById("TI-C");
    this._TI_C_radio.addEventListener("command",
           function() { extension.Controller.get_current_item(); }, false);

    this._TI_TN_radio = document.getElementById("TI-TN");
    this._TI_TN_radio.addEventListener("command",
           function() { extension.Controller.get_current_item(); }, false);

    this._TI_radio = document.getElementById("TI");
    this._TI_radio.addEventListener("command",
           function() { extension.Controller.switchtangoinfo(); }, false);

    this._Todo_radio = document.getElementById("Todotango");
    this._Todo_radio.addEventListener("command",
           function() { extension.Controller.switchtodotango(); }, false);

    this._wiki_radio = document.getElementById("Wikipedia");
    this._wiki_radio.addEventListener("command",
           function() { extension.Controller.switchwiki(); }, false);

    this._NP_radio = document.getElementById("Nowplaying");
    this._NP_radio.addEventListener("command",
           function() { extension.Controller.switchselected(); }, false);

    this._S_radio = document.getElementById("Selected");
    this._S_radio.addEventListener("command",
           function() { extension.Controller.switchplaying(); }, false);


    Components.utils.import("resource://app/jsmodules/SBJobUtils.jsm");

    extension.Listener.init();

    extension.tracks.init();

    extension.Listener.loadArtist();
  },

  /**
   * Called when the pane is about to close
   */
  onUnLoad: function() {
    extension.Listener.onUnLoad();
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                    .getService(Components.interfaces.nsIPrefService);
    prefs = prefs.getBranch("extensions.tangoinfo.");
    prefs.setCharPref("lastMode",extension.currentMode);
    prefs.setCharPref("lastInfoMode",extension.currentInfoMode);
    this._initialized = false;

  },

  forward: function(){
      extension.browser.goForward();
  },

  back: function(){
      var browserbox = document.getElementById("browserbox");
      if(browserbox.style.display == "none"){
          this.toggle_browser_view();
          document.getElementById("ViewTracks").disabled = false;
      } else
          extension.browser.goBack();
  },

  find_on_page: function(){
      extension.find.searchString = document.getElementById("SearchField").value;
      //alert(document.getElementById("SearchField").value);
      extension.find.findNext();
  },

  findnext: function(){
      extension.find.searchString = document.getElementById("SearchField").value;
      extension.find.findNext();
  },

  get_current_item: function(){
      extension.Listener.load_current();
  },

  browser_page_loaded: function() {
      //var frame = document.getElementById("contentview");
      //alert(frame.contentDocument.location.href);
      this.load_tango_info_iframe();
      this.forward_back_buttons();
  },

  forward_back_buttons: function() {
      if (extension.browser.canGoForward)
          this._forwardbutton.disabled = false;
      else
          this._forwardbutton.disabled = true;
      if (extension.browser.canGoBack)
          this._backbutton.disabled = false;
      else
          this._backbutton.disabled = true;
  },

  iframe_loaded: function(){
      this.load_tango_info();
  },

    // var mystring = 'this,is,"some, sample","csv, text, for",you,to,"look",at';
    // var parsed = mystring.splitCSV();
      //
    // alert(parsed.join("\n"));

    get_tango_info_TIN: function(){
        var TIN = null;
        var ti_doc = extension.browser.contentDocument;
        var tangoinfolinks = ti_doc.getElementsByTagName("a");
        for (var i = 0; i < tangoinfolinks.length; i++) {
            var inner = tangoinfolinks[i].innerHTML;
            if (inner.match('^tracktagger.*') != null){
                TIN = tangoinfolinks[i].href;
                if (TIN.length && TIN.indexOf('=') != -1){
                    TIN  = TIN.split('=')[1];
                }
            }
        }
        //alert(TIN);
        return (TIN);
    },

    get_tango_info_url: function(){
        var tin = this.get_tango_info_TIN();
        if (tin != null && tin.length){
            var url = "https://tango.info/tracktagger/1.4.1?track_references=";
            this.enable_toolbox(url);
            return(url.concat(tin));
        }
        this.enable_toolbox(null);
        return(null);
    },

    load_tango_info_iframe: function(){
        var url = this.get_tango_info_url();
        if(url != null){
            tiframe = document.getElementById("tangoinfo_tracktagger");
            tiframe.loadURI(url, null, null);
        }
    },

  loadHelpPage: function() {
    // Ask the window containing this pane (likely the main player window)
    // to load the display pane documentation
    //top.loadURI("http://wiki.songbirdnest.com/Developer/Articles/Getting_Started/Display_Panes");
    top.loadURI("chrome://tangoinfo/content/welcome.xul");
  },

    enable_toolbox: function (enable){
        var ti_doc = extension.browser.contentDocument;
        var trackview = ti_doc.getElementById("trackstree");
        //alert("enable " + trackview + " : " + enable);

        if (enable != null || trackview != null){
            //document.getElementById("tangoinfo-toolbox").style.display = null;
            if (trackview != null)
                document.getElementById("ViewTracks").disabled = true;
            else
                document.getElementById("ViewTracks").disabled = false;
        }else{
            //document.getElementById("tangoinfo-toolbox").style.display = "none";
            document.getElementById("ViewTracks").disabled = true;
        }
    },

    // iframe is loaded. lets get the data.
    load_tango_info: function(){
        tiframe = document.getElementById("tangoinfo_tracktagger").contentDocument;
        this.ti_data = tiframe.getElementById("tag_list").innerHTML;
        /*
        if(this.ti_data.length > 0)
            this.enable_toolbox(true);
        else
            this.enable_toolbox(null);
            */
    },

    toggle_browser_view: function(){
        var ti_toolbox = document.getElementById("tangoinfo-toolbox");
        var trackstree = document.getElementById("trackstree");
        var browserbox = document.getElementById("browserbox");
        if(browserbox.style.display == "none"){
            browserbox.style.display = null;
            trackstree.style.display = "none";
            ti_toolbox.style.display = "none";
        } else {
            browserbox.style.display = "none";
            trackstree.style.display = null;
            ti_toolbox.style.display = null;
            document.getElementById("ViewTracks").disabled = true;
        }
    },

    view_tango_info: function(){
        extension.tracks.load(this.ti_data);
        this.toggle_browser_view();
        extension.tracks.showtracks();
    },
};
//window.addEventListener("load", function(e) { extension.Controller.onLoad(e); }, false);
//window.addEventListener("unload", function(e) { extension.Controller.onUnLoad(e); }, false);
