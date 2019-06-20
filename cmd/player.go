package main

import (
	"fmt"
	"github.com/gorilla/websocket"
)

// player represents a checker player
type player struct {
	// socket is used to send player and opponent
	// moves to the server and browser
	socket *websocket.Conn

	// moveChan is used to link up the two players,
	// moves are forwarded to the other player over
	// this channel
	moveChan chan *message

	// startChan is used to notify the player if
	// they are going first (true) or second (false),
	// this channel is closed after that
	startChan chan bool
}

// play is the starting point for the player. Here they will
// wait for a message that indicates if they are going first
// or second.
func (p *player) play() {
	goFirst := <-p.startChan
	if goFirst {
		p.readMyMove()
	} else {
		p.readOpponentMove()
	}
}

// readMyMove blocks the player until the next move is sent
// over the websocket
func (p *player) readMyMove() {
	fmt.Println("readMyMove")
}

// readOpponentMove blocks the player until it reads the opponents
// move from moveChan
func (p *player) readOpponentMove() {
	fmt.Println("readOpponentMove")
}
