
E.enableWatchdog(15, true);
setWatch(E.reboot,D17,{irq:true});
const STOR = require("Storage");
const P8 = {
    ON_TIME: 10,
    BRIGHT : 3,
    awake : true,
    time_left:10,
    ticker:undefined,
    pressedtime:0,
    buttonwatchrising:undefined,
    buttonwatchfalling:undefined,
    buzz: (v)=>{
        v = v? v : 100;
        D16.set();
        setTimeout(()=>{D16.reset();},v);
    },
    batV: () => {
        pinMode(D16,"analog",true);
        var v = 7.1 * analogRead(D31);
        pinMode(D16,"input",true); //power saving?
        return v;
    },
    setLCDTimeout:(v)=>{P8.ON_TIME=v<5?5:v;},
    setLCDBrightness:(v)=>{P8.BRIGHT=v; brightness(v);},
    init:()=>{
            var s = STOR.readJSON("settings.json",1)||{ontime:10, bright:3, timezone:1};
            P8.ON_TIME=s.ontime;
            P8.time_left=s.ontime;
            P8.BRIGHT=s.bright;
            E.setTimeZone(s.timezone);
    },
    sleep:() => {
        P8.awake = false;
        brightness(0);
        TC.stop();
        P8.emit("sleep",true);
        g.lcd_sleep();
    },
    wake:()=> {
        P8.awake = true;
        P8.time_left = P8.ON_TIME;
        TC.start();
        g.lcd_wake();
        P8.emit("sleep",false);
        brightness(P8.BRIGHT);
        P8.ticker = setInterval(P8.tick,1000);
    },
    tick:()=>{
        P8.time_left--;
        if (P8.time_left<=0){
           if (P8.ticker) P8.ticker=clearInterval(P8.ticker);
           P8.emit("sleep",true);
           P8.sleep();
        }
    }
};
//P8.buttonwatchrising = setWatch(() =>{P8.pressedtime = Date.now();},D17,{repeat:true,edge:"rising"});
if (!D17.read()){
    P8.init();
    eval(STOR.read("lcd.js"));
    var g = ST7789();
    brightness(P8.BRIGHT);
    eval(STOR.read("touch.js"));
    TC.start();
    TC.on('touch',(p)=>{P8.time_left=P8.ON_TIME;});
    TC.on("longtouch", (p)=> {P8.time_left=P8.ON_TIME;if (D17.read()) reset(); else load("launch.js");});
    if (STOR.read("accel.js")){ 
       eval(STOR.read("accel.js"));
       ACCEL.init();
       setInterval(ACCEL.check,200);
       ACCEL.on("faceup",()=>{if (!P8.awake) P8.wake();});
    }
    P8.ticker = setInterval(P8.tick,1000);
    /*
    P8.buttonwatchfalling= setWatch(() =>{
        if ((Date.now()-P8.pressedtime)>5000) E.reboot();
        if (!P8.awake) P8.wake();
    },D17,{repeat:true,edge:"falling"});
    */
} else {
    setWatch(() =>{
        if ((Date.now()-P8.pressedtime)>5000) E.reboot();
    },D17,{repeat:true,edge:"falling"});
}
