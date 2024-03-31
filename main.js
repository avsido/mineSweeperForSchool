import { MineField } from "./MineField";
// initializing vars:
let rows; // 8/14/20
let cols; // 10/18/44
let factor; // 0.85/0.8/0.7
let flags;  // 10/44/90
let userFlags;
let time = 0;
let clicks = 0;
let running = true;
let hasWon = false;
let gameBoard = document.getElementById("gameBoard");
let end = document.getElementById("end");
let mineField;
greet();
function greet(){
  // this is the opening screen and where the player will select game difficulty.
  let h1 = document.createElement("h1");
  h1.innerHTML = "Welcome to Minesweeper!";
  h1.style.color = "white";
  let h2 = document.createElement("h2");
  h2.innerHTML = "Select Difficulty:";
  h2.style.color = "white";
  let buttEasy = document.createElement("button");
  let buttMedium = document.createElement("button");
  let buttHard = document.createElement("button");
  buttEasy.className = "buttDiff";
  buttEasy.onclick = ()=>{
    rows = 8; cols = 10; factor = 0.85; flags = 10; userFlags = 10;
    gameBoard.style.minWidth = '315px';
    createFirst();
    countTime();
    
  };
  buttMedium.onclick = ()=>{
    rows = 12; cols = 16; factor = 0.8; flags = 40; userFlags = 40;
    gameBoard.style.minWidth = '505px';
    createFirst();
    countTime();
  };
  buttHard.onclick = ()=>{
    rows = 18; cols = 24; factor = 0.7; flags = 90; userFlags = 90;
    gameBoard.style.minWidth = '760px';
    createFirst();
    countTime();
  };
  buttMedium.className = "buttDiff";
  buttHard.className = "buttDiff";
  buttEasy.innerHTML = "Easy";
  buttMedium.innerHTML = "Medium";
  buttHard.innerHTML = "Hard";
  gameBoard.appendChild(h1);
  gameBoard.appendChild(h2);
  gameBoard.appendChild(buttEasy);
  gameBoard.appendChild(buttMedium);
  gameBoard.appendChild(buttHard);
}
function createFirst(){
  // creates instance of mineField, on which the game is played, with parameters provided by greet().
  mineField = new MineField(rows, cols, factor);
  render();
}
function render(){
  // func to display data as it changes (checked/unchecked cells, flags or mines).
  removeChildren(gameBoard);
  gameBoard.style.border = "25px solid #4B5320";
  gameBoard.style.borderRadius = "8px";
  gameBoard.style.borderTopLeftRadius = "45px";
  gameBoard.style.borderTopRightRadius = "45px";
  gameBoard.style.backgroundColor = "#4B5320";
  let header = document.createElement("div");
  header.className = "header";
  let pTime = document.createElement("p");
  let smileyFace = document.createElement("img");
  smileyFace.className = "smileyFace";
  smileyFace.onclick = ()=>{
    restart(); 
  };
  smileyFace.src = (running || hasWon) ? "images/happy.png" : "images/sad.png";
  let pFlags = document.createElement("p");
  pTime.innerHTML = time + "";
  pFlags.innerHTML = flags + "";
  header.appendChild(pTime); 
  header.appendChild(smileyFace); 
  header.appendChild(pFlags); 
  gameBoard.appendChild(header);
  for (let i = 0; i < rows; i++){
    let divRow = document.createElement("div");
    divRow.className = "divRow";
    for (let j = 0; j < cols; j++){
      let cell = document.createElement("div");
      cell.className = "cell";
      let imgMine = document.createElement("img");
      imgMine.src = "images/bomb.png";
      imgMine.style.display = running ? "none" : "inline";
      if (mineField.getCell(i, j).isMine == 1 && !mineField.getCell(i, j).flagged && !hasWon) cell.appendChild(imgMine);
      let imgFlag = document.createElement('img');
      imgFlag.src = 'images/flag.png';
      if (mineField.getCell(i, j).flagged) cell.appendChild(imgFlag); 
      divRow.appendChild(cell);
      gameBoard.appendChild(divRow);
      if (mineField.getCell(i, j).isMine == 0 && mineField.getCell(i, j).checked){
        cell.style.backgroundColor = (i == j || (i + j) % 2 == 0 ) ? "rgb(180, 225, 205)" : "rgb(225, 225, 160)";
        if (mineField.getCell(i, j).isMine == 0){
          if (mineField.getCell(i, j).neighborMineCount > 0 && !mineField.getCell(i, j).flagged){
            cell.innerHTML = mineField.getCell(i, j).neighborMineCount + "";
            switch (mineField.getCell(i, j).neighborMineCount){
              case 1:
                cell.style.color = "blue";
                break;
              case 2:
                cell.style.color = "green";
                break;
              case 3:
                cell.style.color = "red";
                break;
              case 4:
                cell.style.color = "gold";
                break;
              case 5:
                cell.style.color = "orange";
                break;
              case 6:
                cell.style.color = "black";
                break;
              case 7:
                cell.style.color = "white";
                break;
            }
          } 
        }
      }else cell.style.backgroundColor = (i == j || (i + j) % 2 == 0 ) ? "#808000" :"#6B8E23";
      cell.onclick = (ev)=>{ 
        if (!running || mineField.getCell(i, j).flagged) return;
        if (mineField.getCell(i, j).isMine == 0){
          if (clicks <= 0){
            mineField.startGame(i, j);
            for (let k = 0; k < rows; k++){
              for (let l = 0; l < cols; l++){
                mineField.getCell(k, l).neighborMineCount = getMineCount(k, l);
              }
            }
          }
          clicks++;
          revealMinesAroundMe(i, j);
          if (checkWin()){
            hasWon = true;
            running = false;
            let hWin = document.createElement("h1");
            hWin.innerHTML = "Success! You Win!";
            hWin.className = "endMessage";
            end.appendChild(hWin);
            let timeMessage = document.createElement("h1");
            timeMessage.className = "endMessage";
            if (time < 60) timeMessage.innerHTML = "Your Time is: " + time + "s.";
            else {
              let m = Math.floor(time / 60);
              let s = time % 60;
              timeMessage.innerHTML = "Your Time is: " + m + "m " + s + "s.";
            }
            end.appendChild(timeMessage);
            let buttResetGame = document.createElement("button");
            buttResetGame.className = "buttDiff";
            buttResetGame.innerHTML = "Again!";
            buttResetGame.onclick = restart;
            end.appendChild(buttResetGame);
          }
        }else{
          running = false;
          let hLoss = document.createElement("h1");
          hLoss.innerHTML = "You Lost!";
          hLoss.className = "endMessage";
          end.appendChild(hLoss);
        }
        render();
      };
      cell.oncontextmenu = (ev)=>{
        ev.preventDefault();
        if (running){
          if (mineField.getCell(i, j).flagged){
            mineField.getCell(i, j).flagged = false;
            flags++;
          }else{
            if (flags <= 0) return;
            else{
              mineField.getCell(i, j).flagged = true;
              flags--;
            }
          }
          render();
        } 
      };
    }
  }
}
function getMineCount(i, j){
  // counts neighbor mines to be stored in mineField.getCell(i, j - 1).neighborMineCount.
  let mines = 0;
  if (j > 0) mines += mineField.getCell(i, j - 1).isMine; // middle left
  if (j < cols - 1) mines += mineField.getCell(i, j + 1).isMine; // middle right
  if (i > 0) mines += mineField.getCell(i - 1, j).isMine; // middle top
  if (i < rows - 1) mines += mineField.getCell(i + 1, j).isMine; // middle bottom
  if (i > 0 && j > 0) mines += mineField.getCell(i - 1, j - 1).isMine; // top left
  if (i < rows - 1 && j < cols - 1) mines += mineField.getCell(i + 1, j + 1).isMine; // bottom right
  if (i > 0 && j < cols - 1) mines += mineField.getCell(i - 1, j + 1).isMine; // top right
  if (j > 0 && i < rows - 1) mines += mineField.getCell(i + 1, j - 1).isMine; // bottom left 
  return mines;
}
function revealMinesAroundMe(i, j){
  // checks "available" cells (render() will get them to display number of neighbor mines)
  if (mineField.getCell(i, j).checked) return;
  if (!mineField.getCell(i, j).flagged) mineField.getCell(i, j).checked = true;
  if (mineField.getCell(i, j).neighborMineCount > 0 || !isShouldReveal(i, j)) return;
  if (i > 0 && j > 0) revealMinesAroundMe(i - 1, j - 1); 
  if (i > 0) revealMinesAroundMe(i - 1, j); 
  if (i > 0 && j < cols - 1) revealMinesAroundMe(i - 1, j + 1); 
  if (j < cols - 1) revealMinesAroundMe(i, j + 1);
  if (i < rows - 1 && j < cols - 1) revealMinesAroundMe(i + 1, j + 1);
  if (i < rows - 1) revealMinesAroundMe(i + 1, j);
  if (j > 0) revealMinesAroundMe(i, j - 1);
  if (i < rows - 1 && j > 0) revealMinesAroundMe(i + 1, j - 1);
}
function isShouldReveal(i, j){
  // decides how much further cells to reveal.
  if (i > 0 && j > 0 && mineField.getCell(i - 1, j - 1).neighborMineCount == 0) return true;
  if (i > 0 && mineField.getCell(i - 1, j).neighborMineCount == 0) return true;
  if (i > 0 && j < cols - 1 && mineField.getCell(i - 1, j + 1).neighborMineCount == 0) return true;
  if (j < cols - 1 && mineField.getCell(i, j + 1).neighborMineCount == 0) return true;
  if (i < rows - 1 && j < cols - 1 && mineField.getCell(i + 1, j + 1).neighborMineCount == 0) return true;
  if (i < rows - 1 && mineField.getCell(i + 1, j).neighborMineCount == 0) return true;
  if (j > 0 && mineField.getCell(i, j - 1).neighborMineCount == 0) return true;
  if (i < rows - 1 && j > 0 && mineField.getCell(i + 1, j - 1).neighborMineCount == 0) return true;   
}

function checkWin(){
  for (let i = 0; i < rows; i++){
    for (let j = 0; j < cols; j++){
      if (mineField.getCell(i, j).isMine == 0 && !mineField.getCell(i, j).checked) return false;
    } 
  }
  return true;
}
function restart(){
  if(!running){
    removeChildren(end);
    time = 0;
    clicks = 0;
    running = true;
    hasWon = false;
    flags = userFlags;
    mineField.resetGame();
    render();
  }
}

function countTime(){
  // seconds clock
  if (running){
    time++;
    render();
  }
  setTimeout(countTime, 1000); 
}
function removeChildren(element){
  while (element.lastElementChild){
    element.removeChild(element.lastElementChild);
  }
}