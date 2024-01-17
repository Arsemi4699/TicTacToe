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
    // returns table of the game
    getTable() {
        return this.table;
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
    // returns empty positions in table
    getAvailablePosList() {
        let availables = [];
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                if (this.table[i][j] == EMPTY)
                    availables.push([i, j]);
        return availables;
    }
}
// returns a children list of input state(each state is a GameBoard)

function sucessors(state) {
    let children = [];
    let currentTurn = state.getTurn();
    let available = state.getAvailablePosList();
    available.forEach(element => {
        let sucessor = new GameBoard(state.getTable(), currentTurn);
        sucessor.setTableAtRC(element[0], element[1]);
        sucessor.ChangeTurn();
        children.push({
            state: sucessor,
            action: element,
            value: null
        });
    });
    return children;
}
// the function used by the maximizing player (COMPUTER in this case) to determine the maximum possible score from a given game state. 
function MaxValue(state, depth) {
    let utility = state.CheckWin();
    if (utility != null) {
        if (utility == 0)
            return utility;
        else
            return utility.winner;
    }
    let v = -Infinity;
    let children = sucessors(state);
    children.forEach(child => {
        let minV = MinValue(child.state, depth + 1);
        child.value = minV;
        v = Math.max(v, minV);
    });
    if (depth == 0)
        return [v, children];
    else
        return v;
}
// the function used by the minimizing player (HUMAN in this case) to determine the minimum possible score from a given game state.
function MinValue(state, depth) {
    let utility = state.CheckWin();
    if (utility != null) {
        if (utility == 0)
            return utility;
        else
            return utility.winner;
    }
    let v = +Infinity;
    let children = sucessors(state);
    children.forEach(child => {
        let maxV = MaxValue(child.state, depth + 1);
        child.value = maxV;
        v = Math.min(v, maxV);
    });
    if (depth == 0)
        return [v, children];
    else
        return v;
}
// calculates MiniMax value and return best target position for maximizing player
function MiniMax(state) {
    let targetPos;
    let result = MaxValue(state, 0);
    let v = result[0];
    let children = result[1];
    for (let i = 0; i < children.length; i++) {
        if (children[i].value == v) {
            targetPos = children[i].action;
            break;
        }
    }
    return targetPos;
}
// returns human target position
function getHUMANTarget() {
    let targetText = prompt("enter your target cell position (row col): ", "0 0");
    let targetPos = targetText.split(" ").map(Number);
    return targetPos;
}
// returns computer target position
function getCOMPUTERTarget(board) {
    return MiniMax(board);
}
// show result of game (returns winner or draw)
function showResult(result) {
    if (result === 0) {
        return console.log("draw");
    }
    else {
        let winner = (result.winner == 1) ? COMPUTER : HUMAN;
        return console.log(winner + " Won!");
    }
}
// gameplay handler
function PlayTicTacToe() {
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
                targetPos = getCOMPUTERTarget(board);
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
PlayTicTacToe();