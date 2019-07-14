class Board {
    constructor(width,
                height,
                playerCheckerColor,
                opponentCheckerColor,
                boardElement) {
        this.width = width;
        this.height = height;
        this.playerCheckerColor = playerCheckerColor;
        this.opponentCheckerColor = opponentCheckerColor;
        this.board = boardElement;
    }

    create() {
        for (let r = 0; r < this.height; r++) {
            let row = this.board.insertRow()
            for (let c = 0; c < this.width; c++) {
                let col = row.insertCell();
                col.style.textAlign = "center";
            }
        }
        this._addCheckers();
    }

    _addCheckers() {
        for (let i = 0; i < this.width; i++) {
            if (i % 2 == 0) {
                this.addChecker({"row":1,"col":i}, this.opponentCheckerColor, false);
                this.addChecker({"row":5,"col":i}, this.playerCheckerColor, false);
                this.addChecker({"row":7,"col":i}, this.playerCheckerColor, false);
            } else {
                this.addChecker({"row":0,"col":i}, this.opponentCheckerColor, false);
                this.addChecker({"row":2,"col":i}, this.opponentCheckerColor, false);
                this.addChecker({"row":6,"col":i}, this.playerCheckerColor, false);
            }
        }
    }

    moveChecker(src, dst) {
        console.log(src, dst);
        let checkerColor = this._getCheckerElement(src.row, src.col)
                               .style
                               .backgroundColor;

        this.removeChecker(src);
        let isKingNow = dst.row == 0;
        this.addChecker(dst, checkerColor, isKingNow);
    }

    removeChecker(checker) {
        let cell = this._getCellElement(checker.row, checker.col);
        cell.removeChild(cell.childNodes[0]);
    }

    addChecker(cell, color, kingFlag) {
        let checker = this.makeChecker(color);
        console.log("King on board:", kingFlag);
        if (kingFlag) {
            checker.style.border = "2px solid black";
        }
        this._getCellElement(cell.row, cell.col).appendChild(checker);
    }

    makeChecker(color) {
        let checker = document.createElement("SPAN");
        checker.className = "checkerPiece";
        checker.style.backgroundColor = color;
        checker.style.border = "2px solid " + color;
        return checker;
    }

    changeNormalCheckerColor(cell, color) {
        let checker = this._getCheckerElement(cell.row, cell.col);
        checker.style.backgroundColor = color;
        checker.style.border = "2px solid " + color;
    }

    changeKingCheckerColor(cell, color) {
        let king = this._getCheckerElement(cell.row, cell.col);
        king.style.backgroundColor = color;
        king.style.border = "2px solid black";
    }

    getPlayerCheckerColor() {
        return this.playerCheckerColor;
    }

    getOpponentCheckerColor() {
        return this.opponentCheckerColor;
    }

    _getCheckerElement(row, col) {
        return this.board.rows[row].cells[col].childNodes[0];
    }

    _getCellElement(row, col) {
        return this.board.rows[row].cells[col];
    }
}

export { Board };
