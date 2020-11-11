/* jshint esversion: 6 */
(() => {

  const BLACK = 0, MOON = 0xFFE0, MC = 29.5305882, NM = 694039.09; 
  var r = 12, mx = 0, my = 0;

  var moon = {
    0: () => { g.reset().setColor(BLACK).fillRect(mx - r, my - r, mx + r, my + r);},
    1: () => { moon[0](); g.setColor(MOON).drawCircle(mx, my, r);},
    2: () => { moon[3](); g.setColor(BLACK).fillEllipse(mx - r / 2, my - r, mx + r / 2, my + r);},
    3: () => { moon[0](); g.setColor(MOON).fillCircle(mx, my, r).setColor(BLACK).fillRect(mx - r, my - r, mx, my + r);},
    4: () => { moon[3](); g.setColor(MOON).fillEllipse(mx - r / 2, my - r, mx + r / 2, my + r);},
    5: () => { moon[0](); g.setColor(MOON).fillCircle(mx, my, r);},
    6: () => { moon[7](); g.setColor(MOON).fillEllipse(mx - r / 2, my - r, mx + r / 2, my + r);},
    7: () => { moon[0](); g.setColor(MOON).fillCircle(mx, my, r).setColor(BLACK).fillRect(mx, my - r, mx + r + r, my + r);},
    8: () => { moon[7](); g.setColor(BLACK).fillEllipse(mx - r / 2, my - r, mx + r / 2, my + r);}
  };

  function moonPhase(){
    var lp = 2551443; 
    var now = new Date();						
    var new_moon = new Date(2020, 9, 15, 20, 35, 0);
    var phase = ((now.getTime() - new_moon.getTime())/1000) % lp;
    var ld =  Math.floor(phase /(24*3600)) + 1;
    return Math.floor(ld*8/29.5309) +1;
  }

  function draw() {
    mx = this.x; my = this.y + 12;
    moon[moonPhase()]();
  }

  WIDGETS["widmoon"] = { area: "tl", width: 24, draw: draw };

})();
