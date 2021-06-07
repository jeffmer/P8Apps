 (() => {
  //Compatible P8    and bottom WD
  let intervalRef = null;
  var width = 5 * 6*2; //???
  var text_color=0x07FF;//cyan 
  var text_bgcolor='#111111';//black 
  var font_size='14';
  var v_hora='';
  

  function draw() {    
    g.reset();      
    g.setFontVector(font_size);  
    g.setFontAlign(-1, 0);
    //Clear previous/color black    
    g.setColor(text_bgcolor);   
    if (v_hora== null || v_hora=='') v_hora='88:88:88'; 
    g.drawString(v_hora, this.x, this.y+11, true); // 5 * 6*2 = 60
    
    //Draw New time
    g.setColor(text_color);   
    //setFontAlign(x, y, rotation)
    // x - X alignment. -1=left (default), 0=center, 1=right        
   //bangle var time = require("locale").time(new Date(),1);
    var d = new Date();
    //format Tue May 18 2021 11:42:23 GMT+0200 (Roman...
    var da = d.toString().split(" ");
    v_hora = da[4];    
    g.drawString(v_hora, this.x, this.y+11, true); // 5 * 6*2 = 60
  }
  
    setInterval(function() {
    WIDGETS["wdclkbttm"].draw(WIDGETS["wdclkbttm"]);
  }, 60*1000); // update every minute
  
  WIDGETS["wdclkbttm"]={area:"br",width:width,draw:draw};
})()
