// 1️⃣ Chat Unlock Logic
function unlockChat() {
  const pw = document.getElementById("chatPassword").value;
  if (pw === "letmein") {
    document.getElementById("chat-section").classList.remove("hidden");
    document.getElementById("chat-unlock").classList.add("hidden");
  } else alert("Wrong password!");
}

function handleKey(e) {
  if (e.key === "Enter") sendMessage();
}

function sendMessage() {
  const m = document.getElementById("chatInput").value.trim();
  if (m) {
    const div = document.createElement("div");
    div.textContent = "🧑 " + m;
    document.getElementById("messages").appendChild(div);
    document.getElementById("chatInput").value = "";
    document.getElementById("messages").scrollTop =
      document.getElementById("messages").scrollHeight;
  }
}

// 2️⃣ Ludo Game Setup
const board = document.getElementById("ludo-board");
const boardSize = 15;
const players = ["red","green","yellow","blue"];
const homeStart = { red:{r:1,c:1}, green:{r:1,c:13}, yellow:{r:13,c:1}, blue:{r:13,c:13} };
const positions = { red:[], green:[], yellow:[], blue:[] };
let current = 0, dice = 0;
const path = generatePath();

function createBoard() {
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.r = r;
      cell.dataset.c = c;
      if (r < 6 && c < 6) cell.classList.add("red-home");
      else if (r < 6 && c > 8) cell.classList.add("green-home");
      else if (r > 8 && c < 6) cell.classList.add("yellow-home");
      else if (r > 8 && c > 8) cell.classList.add("blue-home");
      if ((c === 6 && r <= 5) || (c === 8 && r >= 9) ||
          (r === 6 && c >= 9) || (r === 8 && c <= 5)) {
        cell.classList.add("safe");
      }
      board.appendChild(cell);
    }
  }
}

function rollDice() {
  dice = Math.floor(Math.random()*6)+1;
  document.getElementById("dice-result").textContent = `🎲 Dice: ${dice}`;
  const col = players[current];
  document.getElementById("current-player").textContent = `Turn: ${col.toUpperCase()}`;
  if (dice === 6 && positions[col].length < 4) {
    spawn(col);
  } else {
    moveLast(col);
  }
}

function spawn(col) {
  const {r, c} = homeStart[col];
  const piece = document.createElement("div");
  piece.className = `piece ${col}`;
  piece.dataset.col = col;
  piece.dataset.pos = 0;
  piece.onclick = () => movePiece(piece);
  cellAt(r,c).appendChild(piece);
  positions[col].push(piece);
}

function moveLast(col) {
  const arr = positions[col];
  if (arr.length) movePiece(arr[arr.length-1]);
  else nextTurn();
}

function movePiece(piece) {
  const col = piece.dataset.col;
  let pos = parseInt(piece.dataset.pos) + dice;
  if (pos >= path.length) {
    alert(`${col.toUpperCase()} wins!`);
    return;
  }
  piece.dataset.pos = pos;
  const {r,c} = path[pos];
  cellAt(r,c).appendChild(piece);

  // capture logic
  players.forEach(p => {
    if (p !== col) {
      positions[p].forEach(o => {
        if (o.dataset.pos == pos) {
          alert(`${col} cuts ${p}!`);
          cellAt(homeStart[p].r, homeStart[p].c).appendChild(o);
          o.dataset.pos = 0;
        }
      });
    }
  });

  if (dice !== 6) nextTurn();
}

function nextTurn() {
  current = (current + 1) % players.length;
}

function cellAt(r,c) {
  return document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
}

function generatePath() {
  return [
    {r:6,c:0},{r:6,c:1},{r:6,c:2},{r:6,c:3},{r:6,c:4},{r:6,c:5},
    {r:6,c:6},{r:5,c:6},{r:4,c:6},{r:3,c:6},{r:2,c:6},{r:1,c:6},
    {r:0,c:6},{r:0,c:7},{r:1,c:7},{r:2,c:7},{r:3,c:7},{r:4,c:7},
    {r:5,c:7},{r:6,c:7},{r:6,c:8},{r:6,c:9},{r:6,c:10},{r:6,c:11},
    {r:6,c:12},{r:6,c:13},{r:6,c:14},{r:7,c:14},{r:7,c:13},{r:7,c:12},
    {r:7,c:11},{r:7,c:10},{r:7,c:9},{r:7,c:8},{r:8,c:8},{r:9,c:8},
    {r:10,c:8},{r:11,c:8},{r:12,c:8},{r:13,c:8},{r:14,c:8},{r:14,c:7},
    {r:13,c:7},{r:12,c:7},{r:11,c:7},{r:10,c:7},{r:9,c:7},{r:8,c:7},
    {r:8,c:6},{r:7,c:6},{r:7,c:5},{r:7,c:4},{r:7,c:3},{r:7,c:2},
    {r:7,c:1},{r:7,c:0}
  ];
}

window.onload = () => {
  createBoard();
  document.getElementById("roll-button").onclick = rollDice;
};
