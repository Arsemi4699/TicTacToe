let table = [
    ["_", "_", "_"],
    ["_", "_", "_"],
    ["_", "_", "_"]
]

var HUMAN = "X";
var COMPUTER = "O";
var EMPTY = "_";

// printing game table
function printTable(table) {
    let outputText = "";
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            outputText += table[i][j];
            if (j < 2)
                outputText += " ";
        }
        outputText += "\n"
    }
    console.log(outputText);
}

// set game table with player symbol in index x,y
function setTableAtXYFrom(table, x, y, player) {
    if (x > 2 || y > 2 || x < 0 || y < 0)
        throw "index out of range!";
    if (table[x][y] == EMPTY)
        table[x][y] = player;
    else
        throw "you can not select filled cell";
}

//test area
console.log("turn 1:");
printTable(table);
console.log("turn 2:");
setTableAtXYFrom(table, 1, 1, HUMAN);
printTable(table);
console.log("turn 3:");
setTableAtXYFrom(table, 1, 2, COMPUTER);
printTable(table);
console.log("end");