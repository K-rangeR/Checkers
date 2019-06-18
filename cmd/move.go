package main

// message reprsents the move message that the players exchange
type message struct {
	// Winner is true if there is a winner
	Winner bool `json:"winner"`

	// Quit is true if a player quits
	Quit bool `json:"quit"`

	// Cells is an array of game board cells
	// that the player is moving a checker through.
	// The first cell is the source cell and the
	// last cell is the destination cell.
	Cells []boardCell `json:"cells"`
}

// boardCell represents a cell on the game board
type boardCell struct {
	Row int `json:"row"`
	Col int `json:"col"`
}
