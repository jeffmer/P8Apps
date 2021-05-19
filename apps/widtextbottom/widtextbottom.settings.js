(function(back) {

  const Storage = require("Storage");
  const filename = 'widtextbottom.json';
  let settings = Storage.readJSON(filename,1)|| null;

  function getSettings(){
    return {
      predtext: true,
      colors : true,
      fontsize : 13      
    };
  }
  
  function updateSettings() {
    require("Storage").writeJSON(filename, settings);
    //Bangle.buzz();
  }
  
  if(!settings){
    settings = getSettings();
    updateSettings();
  }

  function saveChange(name){
    return function(v){
      settings[name] = v;
      updateSettings();
    }
  }

  E.showMenu({
    '': { 'title': 'WGtxtbottom sett.' },
    "Text" : {
      value : settings.predtext,
      format : v => v?"#espruino":"#Javascript",
      onchange: v => {
        saveChange('predtext')(!settings.predtext);
      }
    },
    "Colors" : {
      value : settings.colors,
      format : v => v?"Olive":"Red",
      onchange : saveChange('colors')
    },      
    "fontsize" : {
      value : settings.fontsize,
      min: 11, max: 14, step: 1,
      onchange : saveChange('fontsize')
    },	
    '< Back': back
  });
});