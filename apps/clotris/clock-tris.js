

const storage = require("Storage");

g.setColor(1,1,1);
var buf = Graphics.createArrayBuffer(240,160,1,{msb:true});
function flip() {
  g.drawImage({width:240,height:160,bpp:1,buffer:buf.buffer},0,0);
}

const W = buf.getWidth();
const H = buf.getHeight();
const CX = W / 2;
const CY = H / 2;

const HEIGHT_BUFFER = 4;

const LINES = 20;
const COLUMNS = 11;
const CELL_SIZE = Math.floor((H - HEIGHT_BUFFER) / (LINES + 1));

const BOARD_X = Math.floor((W - CELL_SIZE * COLUMNS) / 2) + 2;
const BOARD_Y = Math.floor((H - CELL_SIZE * (LINES + 1)) / 2);
const BOARD_W = COLUMNS * CELL_SIZE;
const BOARD_H = LINES * CELL_SIZE;

const TEXT_X = BOARD_X + BOARD_W + 10;

const BLOCKS = [
  [
    [2, 7],
    [2, 6, 2],
    [0, 7, 2],
    [2, 3, 2]
  ],
  [
    [1, 3, 2],
    [6, 3]
  ],
  [
    [2, 3, 1],
    [3, 6]
  ],
  [
    [2, 2, 6],
    [0, 7, 1],
    [3, 2, 2],
    [4, 7]
  ],
  [
    [2, 2, 3],
    [1, 7],
    [6, 2, 2],
    [0, 7, 4]
  ],
  [
    [2, 2, 2, 2],
    [0, 15]
  ],
  [[3, 3]]
];


const COLOR_WHITE = 1;
const COLOR_BLACK = 0;

const EMPTY_LINE = 0b00000000000000;
const BOUNDARY = 0b10000000000010;
const FULL_LINE = 0b01111111111100;

let gameOver = false;
let paused = false;
let currentBlock = 0;
let nextBlock = 0;
let x, y;
let points;
let level;
let lines;
let board;
let rotation = 0;
let ticker = null;
let needDraw = true;
let highScore = parseInt(storage.read(".trishig") || 0, 10);

function getBlock(a, c, d) {
  const block = BLOCKS[a % 7];
  return block[(a + c) % block.length];
}

function drawBlock(block, screenX, screenY, x, y) {
  for (let row in block) {
    let mask = block[row];
    for (let col = 0; mask; mask >>= 1, col++) {
      if (mask % 2) {
        const dx = screenX + (x + col) * CELL_SIZE;
        const dy = screenY + (y + row) * CELL_SIZE;
        buf.fillRect(dx, dy, dx + CELL_SIZE - 3, dy + CELL_SIZE - 3);
      }
    }
  }
}

function drawBoard() {
  buf.setColor(COLOR_WHITE);
  buf.drawRect(BOARD_X - 3, BOARD_Y - 3, BOARD_X + BOARD_W, BOARD_Y + BOARD_H);
  drawBlock(board, BOARD_X, BOARD_Y, -2, 0);

  buf.setColor(1);
  drawBlock(getBlock(currentBlock, rotation), BOARD_X, BOARD_Y, x - 2, y);
}

function drawNextBlock() {
  buf.setFontAlign(0, -1, 0);
  buf.setColor(COLOR_WHITE);
  buf.drawString("NEXT BLOCK", BOARD_X / 2, 10);
  buf.setColor(1);
  drawBlock(getBlock(nextBlock, 0), BOARD_X / 2 - 2 * CELL_SIZE, 25, 0, 0);
}

function drawTextLine(text, line) {
  buf.drawString(text, TEXT_X, 10 + line * 15);
}

function drawGameState() {
  buf.setFontAlign(-1, -1, 0);
  buf.setColor(COLOR_WHITE);
  let ln = 0;
  drawTextLine("CLOCK-TRIS", ln++);
  ln++;
  drawTextLine("LVL " + level, ln++);
  drawTextLine("LNS " + lines, ln++);
  drawTextLine("PTS " + points, ln++);
  drawTextLine("TOP " + highScore, ln++);
}

function drawBanner(text) {
  buf.setFontAlign(0, 0, 0);
  buf.setColor(COLOR_BLACK);
  buf.fillRect(CX - 46, CY - 11, CX + 46, CY + 9);
  buf.setColor(COLOR_WHITE);
  buf.drawRect(CX - 45, CY - 10, CX + 45, CY + 8);
  buf.drawString(text, CX, CY);
}

function drawPaused() {
  drawBanner("PAUSED");
}

function drawGameOver() {
  drawBanner("GAME OVER");
}

function draw() {
  buf.clear();
  buf.setFont("6x8");
  drawBoard();
  drawNextBlock();
  drawGameState();
  if (paused) {
    drawPaused();
  }
  if (gameOver) {
    drawGameOver();
  }
  flip();
}

function getNextBlock() {
  currentBlock = nextBlock;
  nextBlock = (Math.random() * BLOCKS.length) | 0;
  x = 6;
  y = 0;
  rotation = 0;
}

function landBlock(a) {
  const block = getBlock(currentBlock, rotation);
  for (let row in block) {
    board[y + (row | 0)] |= block[row] << x;
  }

  let clearedLines = 0;
  let keepLine = LINES;
  for (let line = LINES - 1; line >= 0; line--) {
    if (board[line] === FULL_LINE) {
      clearedLines++;
    } else {
      board[--keepLine] = board[line];
    }
  }

  lines += clearedLines;
  if (lines > level * 10) {
    level++;
    setSpeed();
  }

  while (--keepLine > 0) {
    board[keepLine] = EMPTY_LINE;
  }
  if (clearedLines) {
    points += 100 * (1 << (clearedLines - 1));
    needDraw = true;
  }

  getNextBlock();
  if (!checkMove(0, 0, 0)) {
    gameOver = true;
    needDraw = true;
    highScore = Math.max(points, highScore);
    storage.write(".trishig", highScore.toString());
  }
}

function checkMove(dx, dy, rot) {
  if (gameOver) {
    startGame();
    return;
  }
  if (paused) {
    return;
  }
  const block = getBlock(currentBlock, rotation + rot);
  for (const row in block) {
    const movedBlockRow = block[row] << (x + dx);
    if (
      row + y === LINES - 1 ||
      movedBlockRow & board[y + dy + row] ||
      movedBlockRow & BOUNDARY
    ) {
      if (dy) {
        landBlock();
      }
      return false;
    }
  }
  rotation += rot;
  x += dx;
  y += dy;
  needDraw = true;
  return true;
}

function drawLoop() {
  if (needDraw) {
    needDraw = false;
    draw();
  }
  setTimeout(drawLoop, 100);
}

function gameTick() {
  if (!gameOver) {
    checkMove(0, 1, 0);
  }
}

function setSpeed() {
  if (ticker) {
    clearInterval(ticker);
  }
  ticker = setInterval(gameTick, 1000 - level * 100);
}

function pause(b) {
  if (!gameOver) {
    paused = b;
    needDraw = true;
  }
}

function startGame() {
  board = [];
  for (let i = 0; i < LINES; i++) {
    board[i] = EMPTY_LINE;
  }

  gameOver = false;
  points = 0;
  lines = 0;
  level = 0;
  getNextBlock();
  setSpeed();
  needDraw = true;
}

/*
function bindButton(btn, dx, dy, r) {
  setWatch(checkMove.bind(null, dx, dy, r), btn, { repeat: true });
}
bindButton(BTN_L, -1, 0, 0);
bindButton(BTN_R, 1, 0, 0);
bindButton(BTN_ROT, 0, 0, 1);
bindButton(BTN_DOWN, 0, 1, 0);
seWatch(togglePause, BTN_PAUSE, { repeat: true });
*/
var selbut = -1;
var butdefs = [{x1:10,y1:200,x2:59,y2:239,poly:[20,220,50,204,50,235]},
                {x1:95,y1:200,x2:144,y2:239,poly:[105,204,135,204,105,235,135,235]},
                {x1:180,y1:200,x2:229,y2:239,poly:[190,204,220,220,190,235]}];
var drawButton = function(d,sel){
      (sel?g.setColor(0.8,0.8,1.0):g.setColor(0.5,0.5,1.0)).fillRect(d.x1,d.y1,d.x2,d.y2);
      g.setColor(-1).fillPoly(d.poly);
};

var isPressed = function(p,n) {
    var d = butdefs[n];
    var bb = (p.x>d.x1 && p.y>d.y1 && p.x<d.x2 && p.y<d.y2);
    if (bb) {selbut=n; drawButton(d,true);setTimeout(()=>{drawButton(d,false);},50);}
    return bb;
};
buttons = function(p){
  if (isPressed(p,0)) checkMove(-1,0,0);
  else if (isPressed(p,1)) checkMove(0,0,1); 
  else if (isPressed(p,2)) checkMove(1,0,0);
  else selbut=-1;
};

TC.on("touch",buttons);
P8.on("sleep",(b)=>{pause(b)});

setTimeout(()=>{
  for(var i=0;i<3;i++)drawButton(butdefs[i],false);
  startGame();
  drawLoop();
},500);
