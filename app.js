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
    while (!board.isTableFull()) {
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
                board.printTable();
                board.ChangeTurn();
            }
        }
        catch (er) {
            if (currentTurn == HUMAN)
                console.log(er);
        }
    }
}

//test area
simplePlay();