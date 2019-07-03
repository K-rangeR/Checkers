// make this better
var checkerToMove = {
    selected: false,
    row: 0,
    col: 0,
};

var checkerToJump = {
    selected: false,
    row: 0,
    col: 0,
};

var gameBoard = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0]
];

/* for king
var gameBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0]
];
*/

/*
var gameBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0]
];
*/

//printGameBoard();

var websocket;

window.onload = function() {
    document.getElementById("board").addEventListener("click", eval);

    websocket = new WebSocket("ws://localhost:8080/play");

    websocket.onclose = function() {
        document.getElementById("msgHeader").innerHTML = "Lost connection";
    };

    websocket.onmessage = function(msg) {
        const move = JSON.parse(msg.data);
        if (move.firstMessage) {
            if (move.startOrder == 1) {
                document.getElementById("msgHeader")
                        .innerHTML = "You are going first";
            } else {
                document.getElementById("msgHeader")
                        .innerHTML = "You are going second";
            }
        } else {
            alert("stuff");
        }
    };

    websocket.onerror = function(err) {
        document.getElementById("msgHeader").innerHTML = "Lost connection";
    };

    websocket.onopen = function(err) {
        alert("websocket open");
    };
};

function makeMove() {
    alert("moving...");
}

function quitGame() {
    alert("quiting");
}

function createBoard() {
    var board = document.getElementById("board");
    board.addEventListener("click", eval);
    for (r = 0; r < 8; r++) {
        var row = board.insertRow();
        for (c = 0; c < 8; c++) {
            var col = row.insertCell();
            col.style.textAlign = "center"; // center checker
        }
    }

    //addCheckersToRow(0, true, "lightgreen");
    addCheckersToRow(1, false, "lightgreen");
    //addCheckersToRow(2, true, "lightgreen");

    addCheckersToRow(5, false, "lightskyblue");
    addCheckersToRow(6, true, "lightskyblue");
    addCheckersToRow(7, false, "lightskyblue");
}

function addCheckersToRow(rowIndex, oddSquare, color) {
    var row = document.getElementById("board").rows[rowIndex];
    for (var i = 0; i < 8; i++) {
        var checker = createChecker(color);
        if (oddSquare && i % 2 != 0) {
            row.cells[i].appendChild(checker);
        } else if (!oddSquare && i % 2 == 0) {
            row.cells[i].appendChild(checker);
        }
    }
}

// TODO: give better name
function eval(event) {
    var target = event.target;
    if (target.tagName == "SPAN") {
        selectedChecker(target);
    } else if (target.tagName == "TD") {
        moveChecker(target);
    }
}

function selectedChecker(checker) {
    var row = checker.parentElement.parentElement.rowIndex;
    var col = checker.parentElement.cellIndex;
    var checkerID = gameBoard[row][col];

    if (checkerID == 2 || checkerID == 4) {
        handleMyCheckerPress(row, col);
    } else {
        handleOpponentCheckerPress(row, col);
    }
}

function handleMyCheckerPress(row, col) {
    // Is a checker already selected
    if (checkerToMove.selected) {
        resetOldCheckerColor();
    }

    var checker = document.getElementById("board")
                          .rows[row]
                          .cells[col]
                          .childNodes[0];
    checker.style.backgroundColor = "orange";
    if (gameBoard[row][col] == 4) {
        checker.style.borderColor = "black";
    } else {
        checker.style.borderColor = "orange";
    }

    checkerToMove.selected = true;
    checkerToMove.row = row;
    checkerToMove.col = col;

    console.log("==== Select ====");
    printGameBoard();
}

function handleOpponentCheckerPress(row, col) {
    if (checkerToMove.selected) {
        if (isValidMove(row, col)) {
            var checker = document.getElementById("board")
                                  .rows[row]
                                  .cells[col]
                                  .childNodes[0];
            checker.style.backgroundColor = "red";
            checker.style.borderColor = "red";

            if (checkerToJump.selected) {
                checker = document.getElementById("board")
                                  .rows[checkerToJump.row]
                                  .cells[checkerToJump.col]
                                  .childNodes[0];
                checker.style.backgroundColor = "lightgreen";
                checker.style.borderColor = "lightgreen";
            }

            checkerToJump.selected = true;
            checkerToJump.row = row;
            checkerToJump.col = col;
        } else {
            alert("You can't jump that one");
        }
    } else {
        alert("Thats not your checker");
    }
}

function resetOldCheckerColor() {
    var oldRow = checkerToMove.row;
    var oldCol = checkerToMove.col;
    var checker = document.getElementById("board")
                          .rows[oldRow]
                          .cells[oldCol]
                          .childNodes[0];
    checker.style.backgroundColor = "lightskyblue";
    if (gameBoard[oldRow][oldCol] == 4) {
        checker.style.borderColor = "black";
    } else {
        checker.style.borderColor = "lightskyblue";
    }

    if (checkerToJump.selected) {
        checker = document.getElementById("board")
                          .rows[checkerToJump.row]
                          .cells[checkerToJump.col]
                          .childNodes[0];
        checker.style.backgroundColor = "lightgreen";
        checker.style.borderColor = "lightgreen";
    }
}

function moveChecker(cell) {
    var board = document.getElementById("board");
    var destRow = cell.parentElement.rowIndex;
    var destCol = cell.cellIndex;
    var srcRow = checkerToMove.row;
    var srcCol = checkerToMove.col;

    console.log("Move: " + checkerToMove.selected);
    console.log("Jump: " + checkerToJump.selected);

    if (!checkerToMove.selected) {
        alert("No checker selected");
        return;
    }

    if (squareOccupied(destRow, destCol)) {
        alert("There is already have a checker there");
        return;
    }

    /*
    if (checkerToJump.selected && isValidJump(destRow, destCol)) {
        alert("Jumping");
        return;
    }
    */

    if (!isValidMove(destRow, destCol)) {
        alert("Invalid square");
        return;
    }

    var checker = createChecker("lightskyblue");

    // Add new checker to destination square
    board.rows[destRow]
         .cells[destCol]
         .appendChild(checker);

    // Remove old checker
    var srcSquare = board.rows[srcRow]
                         .cells[srcCol];
    srcSquare.removeChild(srcSquare.childNodes[0]);

    checkerToMove.selected = false;
    if (destRow == 0 || gameBoard[srcRow][srcCol] == 4) {
        gameBoard[destRow][destCol] = 4;
        checker.style.borderColor = "black";
    } else {
        gameBoard[destRow][destCol] = 2;
    }
    gameBoard[srcRow][srcCol] = 0;

    console.log("==== Move ====");
    printGameBoard();
}

function isValidMove(destRow, destCol) {
    var srcRow = checkerToMove.row;
    var srcCol = checkerToMove.col;

    var normal = ((destRow == srcRow-1) && (destCol == srcCol-1)
        || (destRow == srcRow-1) && (destCol == srcCol+1));

    var king = false;
    if (gameBoard[srcRow][srcCol] == 4) {
        king = ((destRow == srcRow+1) && (destCol == srcCol-1)
            || (destRow == srcRow+1) && (destCol == srcCol+1));
    }

    return normal || king;
}

function squareOccupied(destRow, destCol) {
    return gameBoard[destRow][destCol] != 0;
}

function isValidJump(destRow, destCol) {
    // 5 things can happen
    //      - Up Left
    //      - Up Right
    //      - Down Left  (king)
    //      - Down Right (king)
    //      - Invalid jump
    if (checkerToMove.row != checkerToJump.row-1
            && checkerToMove.col != checkerToJump.col-1) {
        return false;
    }
    return true;
}

function createChecker(color) {
    var checker = document.createElement("SPAN");
    checker.className = "checkerPiece";
    checker.style.backgroundColor = color;
    checker.style.border = "2px solid " + color;
    return checker;
}

function printGameBoard() {
    var row = "";
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            row += gameBoard[i][j] + " ";
        }
        row += "\n";
    }
    console.log(row);
}
