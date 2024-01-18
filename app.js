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
        let innerHTMLtxt = `<div></div><table class="table">`;
        let emptyClass = "";
        for (let i = 0; i < 3; i++) {
            innerHTMLtxt += "<tr>";
            for (let j = 0; j < 3; j++) {
                if (this.table[i][j] == EMPTY) {
                    emptyClass = "empty";
                }
                innerHTMLtxt += `<td class="cell ${emptyClass}"><span class="getNum">${this.table[i][j]}</span></td>`;
                emptyClass = "";
            }
            innerHTMLtxt += "</tr>";
        }
        innerHTMLtxt += "</table></div>";
        InputControl.innerHTML = innerHTMLtxt;
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
function MaxValue(state, depth, alpha, beta) {
    let utility = state.CheckWin();
    if (utility != null) {
        if (utility == 0)
            return utility;
        else
            return utility.winner;
    }
    let v = -Infinity;
    let children = sucessors(state);
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let minV = MinValue(child.state, depth + 1, alpha, beta);
        child.value = minV;
        v = Math.max(v, minV);
        if (alphabetaActivated) {
            if (v >= beta) {
                if (depth == 0)
                    return [v, children];
                else
                    return v;
            }
            alpha = Math.max(alpha, v)
        }
    }
    if (depth == 0)
        return [v, children];
    else
        return v;
}
// the function used by the minimizing player (HUMAN in this case) to determine the minimum possible score from a given game state.
function MinValue(state, depth, alpha, beta) {
    let utility = state.CheckWin();
    if (utility != null) {
        if (utility == 0)
            return utility;
        else
            return utility.winner;
    }
    let v = +Infinity;
    let children = sucessors(state);
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let maxV = MaxValue(child.state, depth + 1, alpha, beta);
        child.value = maxV;
        v = Math.min(v, maxV);
        if (alphabetaActivated) {
            if (v <= alpha) {
                if (depth == 0)
                    return [v, children];
                else
                    return v;
            }
            beta = Math.min(beta, v)
        }
    }
    if (depth == 0)
        return [v, children];
    else
        return v;
}
// calculates MiniMax value and return best target position for maximizing player
function MiniMax(state) {
    let targetPos;
    let result = MaxValue(state, 0, -Infinity, +Infinity);
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
// calculates MiniMax value and return best target position for maximizing player using alphabeta pruning
function AlphaBeta(state) {
    let targetPos;
    let result = MaxValue(state, 0, -Infinity, +Infinity);
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
    return new Promise(resolve => {
        let cells = document.querySelectorAll(".cell");
        // Add a click event listener to each cell
        cells.forEach((cell, index) => {
            cell.addEventListener("click", function () {
                // Resolve the promise with the clicked cell's position
                resolve([Math.floor(index / 3), index % 3]);
            });
        });
    });
}
// returns computer target position
function getCOMPUTERTarget(board) {
    if (alphabetaActivated)
        return AlphaBeta(board);
    else
        return MiniMax(board);
}
// show result of game (returns winner or draw)
function showResult(result) {
    if (result === 0) {
        return setMessage("tipDraw", "Draw!");
    }
    else {
        let winner = (result.winner == 1) ? COMPUTER : HUMAN;
        let tipClass = (result.winner == 1) ? "tipSucess" : "tipError";
        return setMessage(tipClass, winner + " Won!");
    }
}
// gameplay handler
async function PlayTicTacToe() {
    if (humanSymb == "X" || humanSymb == "O") {
        if (humanSymb != HUMAN) {
            COMPUTER = HUMAN;
            HUMAN = humanSymb;
        }
    }
    let board = new GameBoard(null, null);
    board.printTable();
    let result = null;
    while (!board.isTableFull()) {
        if (result == null) {
            let targetPos = [0, 0];
            let currentTurn = board.getTurn();
            CtrlTurnShow(currentTurn);
            if (currentTurn == HUMAN) {
                targetPos = await getHUMANTarget();
            }
            else {
                let startTime = performance.now();
                targetPos = getCOMPUTERTarget(board);
                let endTime = performance.now();
                let duration = (endTime - startTime).toFixed(2)
                setMessage("tipWait", duration + "ms");
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
                    setMessage("tipError", er);
            }
        } else {
            showResult(result);
            break;
        }
    }
    CtrlretryBtn(1);
}
// shows result or related info
function setMessage(className, info) {
    if (className)
        tipbox.classList = [className];
    else
        tipbox.classList = [];
    tipbox.innerHTML = info;
}
// contols initialize Game button
function CtrlRunBox(show) {
    if (show) {
        if (runBox.classList.contains("hideSolveBtn"))
            runBox.classList.remove("hideSolveBtn");
    } else {
        if (!runBox.classList.contains("hideSolveBtn"))
            runBox.classList.add("hideSolveBtn");
    }
}
// contols retry Game button
function CtrlretryBtn(show) {
    if (show) {
        if (retryBtn.classList.contains("hideSolveBtn"))
            retryBtn.classList.remove("hideSolveBtn");
    } else {
        if (!retryBtn.classList.contains("hideSolveBtn"))
            retryBtn.classList.add("hideSolveBtn");
    }
}
// contols Gameplay option radio buttons
function CtrlGamePlayOptions(show) {
    if (!show) {
        XInputRadio.disabled = true;
        OInputRadio.disabled = true;
        miniMaxInputRadio.disabled = true;
        alphaBetaInputRadio.disabled = true;
    }
    else {
        XInputRadio.disabled = false;
        OInputRadio.disabled = false;
        miniMaxInputRadio.disabled = false;
        alphaBetaInputRadio.disabled = false;
        InputControl.innerHTML = "";
    }
}
// shows player turn
function CtrlTurnShow(turn) {
    if (turn)
        turnShowText.innerHTML = "turn: " + turn;
    else
        turnShowText.innerHTML = "";
}

var humanSymb = HUMAN;
var alphabetaActivated = false;
const XInputRadio = document.getElementById("humanSymbX");
const OInputRadio = document.getElementById("humanSymbO");
const miniMaxInputRadio = document.getElementById("miniMax");
const alphaBetaInputRadio = document.getElementById("alphaBeta");
const InputControl = document.getElementById("inputControl");

const initGame = document.getElementById("initGame");
const retryBtn = document.getElementById("retry");
const runBox = document.getElementById("runBox");
const tipbox = document.getElementById("tip");
const turnShowText = document.getElementById("turnShow");

XInputRadio.addEventListener("click", () => {
    humanSymb = "X";
    CtrlretryBtn(0);
    setMessage("", "");
    CtrlRunBox(1);
});
OInputRadio.addEventListener("click", () => {
    humanSymb = "O";
    CtrlretryBtn(0);
    setMessage("", "");
    CtrlRunBox(1);
});
miniMaxInputRadio.addEventListener("click", () => {
    alphabetaActivated = false;
    CtrlretryBtn(0);
    setMessage("", "");
    CtrlRunBox(1);
});
alphaBetaInputRadio.addEventListener("click", () => {
    alphabetaActivated = true;
    CtrlretryBtn(0);
    setMessage("", "");
    CtrlRunBox(1);
});
retryBtn.addEventListener("click", () => {
    CtrlretryBtn(0);
    CtrlGamePlayOptions(1);
    CtrlTurnShow("");
    setMessage("", "");
    CtrlRunBox(1);
});
initGame.addEventListener("click", () => {
    CtrlretryBtn(0);
    CtrlGamePlayOptions(0);
    CtrlTurnShow("");
    setMessage("", "");
    CtrlRunBox(0);
    PlayTicTacToe();
});