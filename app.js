const prompt = require('prompt-sync')();
var HUMAN = "X";
var COMPUTER = "O";
const EMPTY = "_";

class GameBoard {
    table;
    turn;

    constructor(inTable, inTurn) {
        this.table = [
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]
        ]

        if (inTable)
            for (let i = 0; i < 3; i++)
                for (let j = 0; j < 3; j++)
                    this.table[i][j] = inTable[i][j];

        if (inTurn)
            this.turn = inTurn;
        else
            this.turn = "X";
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
    // set game table with player symbol in index r,c
    setTableAtRC(r, c) {
        let isDone = false;
        if (r == null || c == null)
            throw "row or col parameters is missing!";
        if (r > 2 || c > 2 || r < 0 || c < 0)
            throw "index out of range!";
        if (this.table[r][c] == EMPTY) {
            this.table[r][c] = this.getTurn();
            isDone = true;
        } else
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
    // returns turn that is HUMAN or COMPUTER value
    getTurn() {
        return this.turn;
    }
    // checks that game is over or not
    isTableFull() {
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                if (this.table[i][j] == EMPTY)
                    return false;
        return true;
    }
    //checks and returns winner of the game
    CheckWin() {
        let result = 0; // 1: COMPUTER is winner ,-1: HUMAN is winner, 0: draw
        //row check
        for (let i = 0; i < 3; i++) {
            if (this.table[i][0] != EMPTY && this.table[i][0] == this.table[i][1] && this.table[i][1] == this.table[i][2]) {
                result = (this.table[i][0] == COMPUTER) ? 1 : -1;
                return {
                    winner: result,
                    type: "row",
                    loc: i
                }
            }
        }
        //col check
        for (let i = 0; i < 3; i++) {
            if (this.table[0][i] != EMPTY && this.table[0][i] == this.table[1][i] && this.table[1][i] == this.table[2][i]) {
                result = (this.table[0][i] == COMPUTER) ? 1 : -1;
                return {
                    winner: result,
                    type: "col",
                    loc: i
                }
            }
        }
        //left diagonal check
        if (this.table[0][0] != EMPTY && this.table[0][0] == this.table[1][1] && this.table[1][1] == this.table[2][2]) {
            result = (this.table[1][1] == COMPUTER) ? 1 : -1;
            return {
                winner: result,
                type: "diag",
                loc: 0
            }
        }
        //right diagonal check
        if (this.table[2][0] != EMPTY && this.table[2][0] == this.table[1][1] && this.table[1][1] == this.table[0][2]) {
            result = (this.table[1][1] == COMPUTER) ? 1 : -1;
            return {
                winner: result,
                type: "diag",
                loc: 2
            }
        }
        if (this.isTableFull())
            return result;
        return null;
    }
}


function getHUMANTarget() {
    let targetText = prompt("enter your target cell position (row col): ", "0 0");
    let targetPos = targetText.split(" ").map(Number);
    return targetPos;
}

function getCOMPUTERTarget() {
    let posRow = Math.floor(Math.random() * 3);
    let posCol = Math.floor(Math.random() * 3);
    return [posRow, posCol];
}

function showResult(result) {
    if (result === 0) {
        return console.log("draw");
    }
    else {
        let winner = (result.winner == 1) ? COMPUTER : HUMAN;
        return console.log(winner + " Won!");
    }
}

function simplePlay() {
    let humanSymb = prompt("enter symbol you want to play (X or O): ", HUMAN);
    if (humanSymb == "X" || humanSymb == "O") {
        if (humanSymb != HUMAN) {
            COMPUTER = HUMAN;
            HUMAN = humanSymb;
        }
    } else
        throw "Wrong Input!";

    let board = new GameBoard(null, null);
    let result = null;
    while (!board.isTableFull()) {
        if (result == null) {
            let targetPos = [0, 0];
            let currentTurn = board.getTurn();
            console.log("turn: " + currentTurn);
            if (currentTurn == HUMAN) {
                targetPos = getHUMANTarget();
            }
            else {
                targetPos = getCOMPUTERTarget();
            }
            try {
                if (board.setTableAtRC(targetPos[0], targetPos[1]) == true) {
                    result = board.CheckWin();
                    board.printTable();
                    board.ChangeTurn();
                    if (result != null) {
                        showResult(result);
                        break;
                    }
                }
            }
            catch (er) {
                if (currentTurn == HUMAN)
                    console.log(er);
            }
        } else {
            showResult(result);
            break;
        }
    }
}

//test area
simplePlay();