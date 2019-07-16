import { Board } from "./modules/board.js";
import { GameEngine } from "./modules/engine.js";

const KING = true;
const NOT_KING = false;
const SELECTED_CHECKER_COLOR = "orange";
const JUMP_CHECKER_COLOR = "red";
const NOT_MY_TURN = false;
const MY_TURN = true;

let board;
let ge;
let websocket;
let turn;

window.onload = () => {
    board = new Board(8, 8, "lightskyblue", "lightgreen",
                          document.getElementById("board"));

    document.getElementById("board")
            .addEventListener("click", boardPressHandler);

    board.create();

    ge = new GameEngine(12);

    websocket = new WebSocket("ws://localhost:8080/play");
    websocket.onclose = wsOnClose;
    websocket.onmessage = wsOnMessage;
    websocket.onerror = wsOnError;
    websocket.onopen = wsOnOpen;
};

function wsOnClose() {
    document.getElementById("msgHeader").innerHTML = "Lost connection";
}

function wsOnMessage(msg) {
    const move = JSON.parse(msg.data);
    if (move.firstMessage) {
        if (move.startOrder == 1) {
            document.getElementById("msgHeader")
                    .innerHTML = "You are going first";
                    turn = MY_TURN;
        } else {
            document.getElementById("msgHeader")
                    .innerHTML = "You are going second";
                    turn = NOT_MY_TURN;
        }
    } else {
        updateBoard(move);
    }
}

function updateBoard(move) {
    let src = translateMove(move.src);
    let dst = translateMove(move.dst);
    let jump = translateMove(move.jump);

    board.changeColor(src, SELECTED_CHECKER_COLOR);

    if (move.jumping) {
        console.log("Jumping");
        board.changeColor(jump, JUMP_CHECKER_COLOR);
        board.removeChecker(jump);
        updatePlayerCheckerCount(1);
        ge.removeCheckerFromBoard(jump.row, jump.col);
    }

    ge.moveOpponentChecker(src.row, src.col, dst.row, dst.col);
    board.moveChecker(src, dst);
    board.changeColor(dst, board.getOpponentCheckerColor());

    if (move.winner) {
        alert("You lost this game, thanks for playing");
        // TODO: redirect client to home page
    }

    ge.printGameBoard();
    ge.unselectChecker();
    turn = MY_TURN;
}

function translateMove(move) {
    let cell = {
         "row": (7 - move.row),
         "col": (7 - move.col)
    };
    return cell;
}

function wsOnError(err) {
    document.getElementById("msgHeader").innerHTML = "Lost connection";
}

function wsOnOpen(err) {
    console.log("WebSocket was opended");
}

function wsSendMove(src, dst, jumpChecker, jumping, winner) {
    let move = {
        firstMessage: false,
        startOrder: 0,
        winner: winner,
        quit: false,
        jumping: jumping,
        src: src,
        dst: dst,
        jump: jumpChecker,
    };

    websocket.send(JSON.stringify(move));
}

function boardPressHandler(event) {
    if (!turn) {
        alert("It is not your turn, please wait");
        return;
    }
    let target = event.target;
    if (target.tagName == "SPAN") {
        checkerSelected(target);
    } else if (target.tagName == "TD") {
        emptyCellSelected(target);
    }
}

function checkerSelected(checkerElement) {
    let checker = getCheckerRowCol(checkerElement);
    if (ge.isOpponentChecker(checker.row, checker.col)) {
        handleOpponentCheckerSelected(checker);
    } else {
        handlePlayerCheckerSelected(checker);
    }
}

function getCheckerRowCol(target) {
    return {
        "row": target.parentElement.parentElement.rowIndex,
        "col": target.parentElement.cellIndex,
    };
}

function handleOpponentCheckerSelected(checker) {
    if (!ge.isCheckerSelected()) {
        alert("That is not your checker");
        return;
    }

    if (!ge.isJumpable(checker.row, checker.col)) {
        alert("Cannot jump that checker");
        return;
    }

    if (ge.isCheckerToJumpSelected()) {
        let oldJumpChecker = ge.getCheckerToJump();
        board.changeColor(oldJumpChecker, board.getOpponentCheckerColor());
    }

    ge.selectCheckerToJump(checker.row, checker.col);
    board.changeColor(checker, JUMP_CHECKER_COLOR);
}

function handlePlayerCheckerSelected(checker) {
    if (ge.isCheckerSelected()) {
        let oldChecker = ge.getSelectedChecker();
        board.changeColor(oldChecker, board.getPlayerCheckerColor());
    }

    if (ge.isCheckerToJumpSelected()) {
        console.log("RESETTING JUMP CHECKER COLOR");
        let checkerToJump = ge.getCheckerToJump();
        board.changeColor(checkerToJump, board.getOpponentCheckerColor());
        ge.unselectCheckerToJump();
    }

    ge.selectChecker(checker.row, checker.col);
    board.changeColor(checker, SELECTED_CHECKER_COLOR);
}

function emptyCellSelected(cell) {
    cell = getCellRowCol(cell);
    if (!ge.isCheckerSelected() && !ge.isCheckerToJumpSelected()) {
        console.log("No checker selected");
        return;
    }

    if (ge.isCheckerSelected() && !ge.isCheckerToJumpSelected()) {
        handleMove(cell);
        return;
    }

    console.log("HANDLING JUMP");
    handleJump(cell);
}

function handleMove(dst) {
    if (!ge.isValidMove(dst.row, dst.col)
            || ge.isSquareOccupied(dst.row, dst.col)) {
        alert("That is not a valid move");
        return;
    }

    let src = ge.getSelectedChecker();
    wsSendMove(src, dst, {"row":0,"col":0}, false, false);
    board.moveChecker(src, dst);
    board.changeColor(dst, board.getPlayerCheckerColor());

    ge.moveSelectedChecker(dst.row, dst.col);
    turn = NOT_MY_TURN;
}

function handleJump(cell) {
    console.log("jumping", cell.row, cell.col);
    if (!ge.isValidJump(cell.row, cell.col)) {
        alert("Not a valid jump");
        return;
    }

    let checker = ge.getSelectedChecker();
    let jumpedChecker = ge.getCheckerToJump();

    updateOpponentCheckerCount(1);
    wsSendMove(checker, cell, jumpedChecker, true, ge.gameWasWon());

    board.moveChecker(checker, cell);
    ge.moveSelectedChecker(cell.row, cell.col);
    board.changeColor(cell, board.getPlayerCheckerColor());

    board.removeChecker(jumpedChecker);
    ge.removeCheckerFromBoard(jumpedChecker.row, jumpedChecker.col);
    ge.unselectCheckerToJump();

    if (ge.gameWasWon()) {
        alert("Good job you just won the game, thanks for playing");
        // TODO: close websoket (if needed)
        // TODO: redirect player to home page
        return;
    }
    turn = NOT_MY_TURN;
}

function updateOpponentCheckerCount(reduction) {
    ge.reduceOpponentCheckerCount(reduction);
    let currentCount = document.getElementById("opponentCnt").innerHTML;
    currentCount = currentCount.split(" ")[2];
    currentCount -= reduction;
    currentCount = "Opponent = " + currentCount;
    document.getElementById("opponentCnt").innerHTML = currentCount;
}

function updatePlayerCheckerCount(reduction) {
    ge.reducePlayerCheckerCount(reduction);
    let currentCount = document.getElementById("playerCnt").innerHTML;
    currentCount = currentCount.split(" ")[2];
    currentCount -= reduction;
    currentCount = "You = " + currentCount;
    document.getElementById("playerCnt").innerHTML = currentCount;
}

function getCellRowCol(cell) {
    return {
        "row": cell.parentElement.rowIndex,
        "col": cell.cellIndex,
    };
}
