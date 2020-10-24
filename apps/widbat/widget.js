(function(){
  var CHARGING = 0x07E0;

  function getBattery(){
    var v = P8.batV();
    v = v<3.7?3.7:v;
    return Math.floor((v-3.7)*200);
  }

  function draw() {
    var s = 39;
    var x = this.x, y = this.y;
    g.setColor(-1);
    g.fillRect(x,y+2,x+s-4,y+21);
    g.clearRect(x+2,y+4,x+s-6,y+19);
    g.fillRect(x+s-3,y+10,x+s,y+14);
    g.setColor(CHARGING).fillRect(x+4,y+6,x+4+getBattery()*(s-12)/100,y+17);
    g.setColor(-1);
  }


  WIDGETS["bat"]={area:"tr",width:40,draw:draw};
})()
