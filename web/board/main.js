import { Board } from "./modules/board.js";
import { GameEngine } from "./modules/engine.js";

const KING = true;
const NOT_KING = false;
const SELECTED_CHECKER_COLOR = "orange";
const JUMP_CHECKER_COLOR = "red";

let board;
let ge;

window.onload = () => {
    board = new Board(8, 8, "lightskyblue", "lightgreen",
                          document.getElementById("board"));

    document.getElementById("board")
            .addEventListener("click", boardPressHandler);

    board.create();

    ge = new GameEngine(12);
};

function boardPressHandler(event) {
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
        board.changeNormalCheckerColor(oldJumpChecker, "lightgreen");
    }

    ge.selectCheckerToJump(checker.row, checker.col);
    board.changeNormalCheckerColor(checker, JUMP_CHECKER_COLOR);
}

function handlePlayerCheckerSelected(checker) {
    if (ge.isCheckerSelected()) {
        let oldChecker = ge.getSelectedChecker();
        board.changeNormalCheckerColor(oldChecker,
                                       board.getPlayerCheckerColor());
    }

    if (ge.isCheckerToJumpSelected()) {
        let checkerToJump = ge.getCheckerToJump();
        board.changeNormalCheckerColor(checkerToJump,
                                       board.getOpponentCheckerColor());
    }

    ge.selectChecker(checker.row, checker.col);
    board.changeNormalCheckerColor(checker, SELECTED_CHECKER_COLOR);
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

    handleJump(cell);
}

function handleMove(cell) {
    if (!ge.isValidMove(cell.row, cell.col)
            || ge.isSquareOccupied(cell.row, cell.col)) {
        alert("That is not a valid move");
        return;
    }

    let src = ge.getSelectedChecker();
    board.moveChecker(src, cell);
    ge.moveSelectedChecker(cell.row, cell.col);
}

function handleJump(cell) {
    console.log("jumping");
}

function getCellRowCol(cell) {
    return {
        "row": cell.parentElement.rowIndex,
        "col": cell.cellIndex,
    };
}
