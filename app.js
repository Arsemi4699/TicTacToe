const HUMAN = "X";
const COMPUTER = "O";
const EMPTY = "_";

class GameBoard {
    table;
    turn;

    constructor(inTable, inTurn) {
        this.table = [
            ["_", "_", "_"],
            ["_", "_", "_"],
            ["_", "_", "_"]
        ]

        if (inTable)
            for (let i = 0; i < 3; i++)
                for (let j = 0; j < 3; j++)
                    this.table[i][j] = inTable[i][j];

        if (inTurn)
            this.turn = inTurn;
        else
            this.turn = HUMAN;
    }
    // printing game table
    printTable() {
        let outputText = "";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                outputText += this.table[i][j];
                if (j < 2)
                    outputText += " ";
            }
            outputText += "\n"
        }
        console.log(outputText);
    }
    // set game table with player symbol in index x,y
    setTableAtXY(x, y) {
        let isDone = false;
        if (x == null || y == null)
            throw "x or y parameters is missing!";
        if (x > 2 || y > 2 || x < 0 || y < 0)
            throw "index out of range!";
        if (this.table[x][y] == EMPTY) {
            this.table[x][y] = this.getTurn();
            isDone = true;
        }
        else
            throw "you can not select filled cell!";
        return isDone;
    }
    // update turn between HUMAN and COMPUTER
    ChangeTurn() {
        if (this.turn == HUMAN)
            this.turn = COMPUTER
        else
            this.turn = HUMAN
    }
    getTurn() {
        return this.turn;
    }
}

//test area
let board = new GameBoard(null, null);
board.printTable();
console.log("turn: " + board.getTurn());
board.setTableAtXY(1, 1);
board.printTable();
board.ChangeTurn();
console.log("turn: " + board.getTurn());
board.setTableAtXY(2, 2);
board.printTable();
board.ChangeTurn();
console.log("turn: " + board.getTurn());
board.setTableAtXY(0, 0);
board.printTable();