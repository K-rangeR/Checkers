package main

// message reprsents the move message that the players exchange
type message struct {
	// FirstMsg is true only for the first message sent
	// to the browser. It acts as a flag that will tell
	// to brower to check the 'startOrder' field to know
	// if the player goes first or second.
	FirstMsg bool `json:"firstMessage"`

	// StartOrder is used to inform the browser of the
	// players start order. If 1 they go first, if 2
	// they go second.
	StartOrder int `json:"startOrder"`

	// Winner is true if there is a winner
	Winner bool `json:"winner"`

	// Quit is true if a player quits
	Quit bool `json:"quit"`

	// Cells is an array of game board cells
	// that the player is moving a checker through.
	// The first cell is the source cell and the
	// last cell is the destination cell.
	Cells []boardCell `json:"cells"`

	// Message is for testing ONLY, remove later
	Message string `json:"message"`
}

// boardCell represents a cell on the game board
type boardCell struct {
	Row int `json:"row"`
	Col int `json:"col"`
}
