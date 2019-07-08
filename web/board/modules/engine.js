const PLAYER_CHECKER = 2;
const PLAYER_KING = 4;

const OPPONENT_CHECKER = 1;
const OPPONENT_KING = 3;

class GameEngine {
    constructor(checkers) {
        this.opponentCheckers = checkers;
        this.playerCheckers = checkers;
        this.gameBoard = [
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0]
        ];
        this.selectedChecker = {
            "row": -1,
            "col": -1,
        };
        this.checkerToJump = {
            "row": -1,
            "col": -1,
        };
    }

    isValidMove(destRow, destCol) {
        let srcRow = this.selectedChecker.row;
        let srcCol = this.selectedChecker.col;

        let normal = ((destRow == srcRow-1) && (destCol == srcCol-1)
            || (destRow == srcRow-1) && (destCol == srcCol+1));

        let king = false;
        if (this.gameBoard[srcRow][srcCol] == PLAYER_KING) {
            king = ((destRow == srcRow+1) && (destCol == srcCol-1)
                || (destRow == srcRow+1) && (destCol == srcCol+1));
        }

        return normal || king;
    }

    isValidJump(destRow, destCol) {
        // 5 things can happen
        //      - Up Left
        //      - Up Right
        //      - Down Left  (king)
        //      - Down Right (king)
        //      - Invalid jump
        if (this.selectedChecker.row != this.checkerToJump.row-1
                && this.selectedChecker.col != this.checkerToJump.col-1) {
            return false;
        }
        return true;
    }

    moveChecker(srcRow, srcCol, dstRow, dstCol) {
        let checker = this.gameBoard[srcRow][srcCol];
        this.gameBoard[srcRow][srcCol] = 0;
        this.gameBoard[dstRow][dstCol] = checker;
    }

    upgradeToKing(row, col) {
        let checker = this.gameBoard[row][col];
        if (checker == 1) {
            this.gameBoard[row][col] = OPPONENT_KING;
        } else {
            this.gameBoard[row][col] = PLAYER_KING;
        }
    }

    getPlayerCheckerCount() {
        return this.playerCheckers;
    }

    reducePlayerCheckerCount(amount) {
        this.playerCheckers -= amount;
    }

    getOpponentCheckerCount() {
        return this.opponentCheckers;
    }

    reduceOpponentCheckerCount(amount) {
        this.opponentCheckers -= amount;
    }

    getSelectedChecker() {
        return this.selectedChecker;
    }

    isCheckerSelected() {
        return this.selectedChecker.row != -1;
    }

    selectChecker(row, col) {
        this.selectedChecker.row = row;
        this.selectedChecker.col = col;
    }

    unselectChecker() {
        this.selectedChecker.row = -1;
        this.selectedChecker.col = -1;
    }

    selectCheckerToJump(row, col) {
        this.checkerToJump.row = row;
        this.checkerToJump.col = col;
    }

    unselectCheckerToJump() {
        this.checkerToJump.row = -1;
        this.checkerToJump.col = -1;
    }

    getCheckerToJump() {
        return this.checkerToJump;
    }

    gameWasWon() {
        return this.opponentCheckers == 0;
    }

    gameWasLost() {
        return this.playerCheckers == 0;
    }

    isSquareOccupied(row, col) {
        return this.gameBoard[row][col] != 0;
    }

    printGameBoard() {
        let row = "";
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                row += this.gameBoard[i][j] + " ";
            }
            row += "\n";
        }
        console.log(row);
    }
}

export { GameEngine };
