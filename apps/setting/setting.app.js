P8.setLCDTimeout(30);
const storage = require("Storage");
const showMenu = eval(storage.read("menu.js"));
var s = storage.readJSON("settings.json",1)||{ontime:5, bright:3, timezone:1};

var mainmenu = {
    "" : { "title" : "Settings" },
    "On Time" :{ value : s.ontime,
                  min:5,max:300,step:5,
                  onchange : v => { s.ontime=v;}
                },
    "Brightness" :{ value : s.bright,
                  min:1,max:7,step:1,
                  onchange : v => { brightness(v); s.bright=v;}
                },
    "Time Zone" :{ value : s.timezone,
                  min:-12,max:12,step:1,
                  onchange : v => {s.timezone=v;}
                },
    "Exit" : function() { storage.writeJSON("settings.json",s); load("launch.js");}
};

setTimeout(()=>{showMenu(mainmenu);},500);
