const PLAYER_CHECKER = 2;
const PLAYER_KING = 4;

const OPPONENT_CHECKER = 1;
const OPPONENT_KING = 3;

/*
 * Represents the game engine for checkers. It handles validating
 * player moves, jumps, checker selections, and maintaining a logical
 * view of the game board.
 */
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

    isValidJump(dstRow, dstCol) {
        let srcRow = this.selectedChecker.row;
        let srcCol = this.selectedChecker.col;
        let checker = this.gameBoard[srcRow][srcCol];

		// is cell occupied
		if (this.isSquareOccupied(dstRow, dstCol)) {
			return false;
		}

        // upward right jump
        if (dstRow == srcRow-2 && dstCol == srcCol+2) {
            return true;
        }
        // upward left jump
        if (dstRow == srcRow-2 && dstCol == srcCol-2) {
            return true;
        }

        // downward left jump
        if (checker == PLAYER_KING &&
                dstRow == srcRow+2 &&
                dstCol == srcCol+2) {
            return true;
        }

        // downward right jump
        if (checker == PLAYER_KING &&
                dstRow == srcRow+2 &&
                dstCol == srcCol-2) {
            return true;
        }

        return false;
    }

    isJumpable(row, col) {
        // upper left corner
        if (row == this.selectedChecker.row-1
                && col == this.selectedChecker.col-1) {
            return true;
        }

        // upper right corner
        if (row == this.selectedChecker.row-1
                && col == this.selectedChecker.col+1) {
            return true;
        }

        let checker = this.gameBoard[this.selectedChecker.row]
                                    [this.selectedChecker.col];

        // for king only, bottom left corner
        if (checker == PLAYER_KING &&
                (row == this.selectedChecker.row+1 &&
                 col == this.selectedChecker.col-1)) {
            return true;
        }

        // for king only, bottom right corner
        if (checker == PLAYER_KING &&
                (row == this.selectedChecker.row+1 &&
                 col == this.selectedChecker.col+1)) {
            return true;
        }

        return false;
    }

    moveOpponentChecker(srcRow, srcCol, dstRow, dstCol) {
        let checker = this.gameBoard[srcRow][srcCol];
        this.removeCheckerFromBoard(srcRow, srcCol);
        if (dstRow == 7 || checker == OPPONENT_KING) {
            this.gameBoard[dstRow][dstCol] = OPPONENT_KING;
        } else {
            this.gameBoard[dstRow][dstCol] = checker;
        }
    }

    moveSelectedChecker(dstRow, dstCol) {
        let srcRow = this.selectedChecker.row;
        let srcCol = this.selectedChecker.col;
        let checker = this.gameBoard[srcRow][srcCol];

        this.removeCheckerFromBoard(srcRow, srcCol);
        if (dstRow == 0)
            this.gameBoard[dstRow][dstCol] = PLAYER_KING;
        else
            this.gameBoard[dstRow][dstCol] = checker;
        this.selectChecker(dstRow, dstCol);
    }

    removeCheckerFromBoard(row, col) {
        this.gameBoard[row][col] = 0;
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

    isCheckerToJumpSelected() {
        return this.checkerToJump.row != -1;
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

    isKing(row, col) {
        let checker = this.gameBoard[row][col];
        return checker == PLAYER_KING || checker == OPPONENT_KING;
    }

    isOpponentChecker(row, col) {
        return this.gameBoard[row][col] ==  OPPONENT_KING
                || this.gameBoard[row][col] == OPPONENT_CHECKER;
    }

    isSquareOccupied(row, col) {
        return this.gameBoard[row][col] != 0;
    }

	// For debugging
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
