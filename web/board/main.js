import { Board } from "./modules/board.js";
import { GameEngine } from "./modules/engine.js";

const KING = true;
const NOT_KING = false;

let board;

window.onload = () => {
    /*
    board = new Board(8, 8, "lightskyblue", "lightskyblue",
                          document.getElementById("board"));

    document.getElementById("board")
            .addEventListener("click", boardPressHandler);

    board.create();

    board.addChecker({"row":0,"col":0}, "lightgreen", NOT_KING);
    board.addChecker({"row":0,"col":1}, "lightskyblue", KING);
    board.moveChecker({"row":0,"col":0}, {"row":2,"col":2});
    */

    let engine = new GameEngine(12);
    engine.selectChecker(5, 2);
};

function boardPressHandler(event) {
    let target = event.target;
    if (target.tagName == "SPAN") {
        checkerSelected(target);
    } else if (target.tagName == "TD") {
        console.log("empty cell selected");
    }
}

function checkerSelected(target) {
    let checker = getCheckerRowCol(target);
    console.log(checker.row, checker.col);
    board.changeNormalCheckerColor(checker, "orange");
}

function getCheckerRowCol(target) {
    return {
        "row": target.parentElement.parentElement.rowIndex,
        "col": target.parentElement.cellIndex,
    };
}
