package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
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
	p.socket.SetCloseHandler(p.socketCloseHandler)
	goFirst := <-p.startChan
	if goFirst {
		p.socket.WriteJSON(message{FirstMsg: true, StartOrder: 1})
		p.readMyMove()
	} else {
		p.socket.WriteJSON(message{FirstMsg: true, StartOrder: 2})
		p.readOpponentMove()
	}
}

// readMyMove blocks the player until the next move is sent
// over the websocket
func (p *player) readMyMove() {
	var msg *message
	if err := p.socket.ReadJSON(&msg); err != nil {
		log.Println("readMyMove:", err)
		p.errorEndGame()
		return
	}

	p.moveChan <- msg

	if msg.Winner || msg.Quit {
		p.socket.Close()
		return
	} else {
		p.readOpponentMove()
	}
}

// readOpponentMove blocks the player until it reads the opponents
// move from moveChan
func (p *player) readOpponentMove() {
	msg := <-p.moveChan
	if err := p.socket.WriteJSON(msg); err != nil {
		log.Println("readOpponentMove:", err)
		p.errorEndGame()
		return
	}

	if msg.Winner || msg.Quit {
		p.socket.Close()
		close(p.moveChan)
		return
	} else {
		p.readMyMove()
	}
}

func (p *player) socketCloseHandler(code int, text string) error {
	fmt.Println("SOCKET WAS CLOSED", text, code)
	return nil
}

// errorEndGame is used to signal to the other player that an
// error has occured and the game must end
func (p *player) errorEndGame() {
	p.moveChan <- &message{Quit: true}
	p.socket.Close()
}
