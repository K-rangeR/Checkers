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

	// Jumping is true if the Jump object is set
	Jumping bool `json:"jumping"`

	// Source is the source cell of the checker being moved
	Source boardCell `json:"src"`

	// Destination is the destination cell for the checker being moved
	Destination boardCell `json:"dst"`

	// Jump is the cell of the checker being jumped
	Jump boardCell `json:"jump"`
}

// boardCell represents a cell on the game board
type boardCell struct {
	Row int `json:"row"`
	Col int `json:"col"`
}
