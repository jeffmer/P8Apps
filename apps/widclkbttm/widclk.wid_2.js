(() => {
  //Compatible P8	 and bottom WD
  let intervalRef = null;
  var width = 5 * 6*2; //???
  var text_color=0x03E0;//Dark green

  function draw() {
    //g.reset().setFont("6x8", 2).setFontAlign(-1, 0);
	g.reset();	
	var font_size='12';//ok2
    g.setFontVector(font_size);  
	g.setColor(text_color);   
	//setFontAlign(x, y, rotation)
    // x - X alignment. -1=left (default), 0=center, 1=right	
	g.setFontAlign(-1, 0);
   //bangle var time = require("locale").time(new Date(),1);
    var d = new Date();
	//Tue May 18 2021 11:42:23 GMT+0200 (Romance Standard Time)
	var da = d.toString().split(" ");
    var v_hora = da[4];
	
    g.drawString(v_hora, this.x, this.y+11, true); // 5 * 6*2 = 60
  }
  function clearTimers(){
    if(intervalRef) {
      clearInterval(intervalRef);
      intervalRef = null;
    }
  }
  function startTimers(){
    intervalRef = setInterval(()=>WIDGETS["wdclk"].draw(), 60*1000);
    WIDGETS["wdclk"].draw();
  } 
  
    /*Bangle.on('lcdPower', (on) => {  
    clearTimers();
    if (on) startTimers();
  });
  */ 
  if (P8.awake) {  
    clearTimers();
    startTimers();
  });

  WIDGETS["wdclk"]={area:"br",width:width,draw:draw};
  //if (Bangle.isLCDOn) 
 if (P8.awake)  intervalRef = setInterval(()=>WIDGETS["wdclk"].draw(), 60*1000);
})()
