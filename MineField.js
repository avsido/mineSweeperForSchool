export class MineField{
    constructor(rows, cols, factor){
      this.rows = rows;
      this.cols = cols;
      this.factor = factor;
      this.board = [];
      let cellNumber = this.rows * this.cols;
      for (let i = 0; i < cellNumber; i++){
        this.board.push({isMine:0, checked:false, flagged:false, neighborMineCount:0}); 
      }
      this.resetGame();
    }
    getCell(row, col){
        return this.board[row * this.cols + col];
    }
    startGame(x, y){
        for (let i = 0; i < this.rows; i++){
            for (let j = 0; j < this.cols; j++){
                if (Math.abs(i - x) >= 2 || Math.abs(j - y) >= 2){
                    this.getCell(i, j).isMine = Math.random() > this.factor ? 1 : 0;
                }
            }
        }    
    }
    resetGame(){
        let cellNumber = this.rows * this.cols;
        for (let i = 0; i < cellNumber; i++){
            this.board[i].isMine = 0;
            this.board[i].checked = false;
            this.board[i].flagged = false;
            this.board[i].neighborMineCount = 0;
        }
    }
}