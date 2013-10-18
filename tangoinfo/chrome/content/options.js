
// Make a namespace.
if (typeof tangoinfo == 'undefined') {
  var tangoinfo = {};
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


tangoinfo.OptionController = {
  add:function(){
    var item = document.getElementById("avaiablelist").selectedItem;
    if (item){
      document.getElementById("avaiablelist").removeChild(item);
      document.getElementById("selectedlist").appendChild(item);
    }
  },
  
  rem:function(){
    var item = document.getElementById("selectedlist").selectedItem;
    if (item){
      document.getElementById("selectedlist").removeChild(item);
      document.getElementById("avaiablelist").appendChild(item);
    }
  },
  
  up:function(){
    var sellist = document.getElementById("selectedlist");
    //var viewpos = sellist.getIndexOfFirstVisibleRow();
    
    var item = sellist.selectedItem;
    var index = sellist.selectedIndex;
    
    if (item && (index != 0)){
      sellist.removeChild(item);
      var nitem = sellist.insertItemAt(index-1,item.getAttribute("label"),item.getAttribute("value"));
      sellist.selectedIndex=index-1;
      
      /*sellist.scrollToIndex(viewpos);
      sellist.ensureElementIsVisible(nitem);*/
    }
  },
  
  down:function(){
    var sellist = document.getElementById("selectedlist");
    //var viewpos = sellist.getIndexOfFirstVisibleRow();
    
    var index=sellist.selectedIndex+1;
    var item = sellist.getItemAtIndex(index);
    
    if (item && (index < sellist.childNodes.length)){
      sellist.removeChild(item);
      var nitem = sellist.insertItemAt(index-1,item.getAttribute("label"),item.getAttribute("value"));
      sellist.selectedIndex=index;
      
      /*sellist.scrollToIndex(viewpos);
      sellist.ensureElementIsVisible(nitem);*/
    }
  },
  
  onLoad:function(){
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                    .getService(Components.interfaces.nsIPrefService);
    prefs = prefs.getBranch("extensions.tangoinfo.");
    
    var selectedstr=prefs.getCharPref("selected");
    
    var selected = selectedstr.split(",");
    
    if (selected[0] != "") {
      
      var sellist=document.getElementById("selectedlist");
      
      for (var i = 0; i<selected.length;i++){
        sellist.appendItem(_getLocalizedLabel(selected[i]),selected[i]).setAttribute("id","selectedlist-item-"+selected[i]);
      }
      
    }
    
    var avalist=document.getElementById("avaiablelist");
    
    for(var i=0;i<localecaption.length;i++){
      var found=false;
      for (var j = 0; j<selected.length;j++){
        if (selected[j]==localecaption[i][0]){
          found=true;
        }
      }
      if (!found)
      {
        avalist.appendItem(_getLocalizedLabel(localecaption[i][0]),localecaption[i][0]).setAttribute("id","selectedlist-item-"+selected[i]);
      }
    }
  },
  
  onAccept:function(){
    var selecteditems = document.getElementById("selectedlist").childNodes;
    var selectedstr="";
    for (var i = 0; i< selecteditems.length; i++){
      selectedstr+=selecteditems[i].getAttribute("value");
      if (i+1 < selecteditems.length){
        selectedstr+=",";
      }
    }
    
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                    .getService(Components.interfaces.nsIPrefService);
    prefs = prefs.getBranch("extensions.tangoinfo.");
    
    prefs.setCharPref("selected",selectedstr);
  },
	
	onNumChange:function(edit){
	  edit.value = edit.value < 1 ? 1 : edit.value;
	},
}
