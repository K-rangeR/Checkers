package main

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

var upgrader = &websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024}

// matchMaker represents the http handler that
// will match up players
type matchMaker struct {
	playerChan     chan *player
	waitingPlayers []*player
}

// ServeHTTP is the http handler that runs when a player wants
// to play against another player
func (m *matchMaker) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("ServeHTTP: ", err)
		return
	}

	p := &player{
		socket:    socket,
		moveChan:  nil,
		startChan: make(chan bool),
	}

	m.playerChan <- p
	p.play()
}

// listenForPlayers listens on playerChan for players requesting to play
func (m *matchMaker) listenForPlayers() {
	for {
		p := <-m.playerChan
		if len(m.waitingPlayers) == 0 {
			m.waitingPlayers = append(m.waitingPlayers, p)
		} else {
			p2 := m.waitingPlayers[0]
			go matchUpPlayers(p2, p)
			m.waitingPlayers = m.waitingPlayers[1:]
		}
	}
}

// matchUpPlayers puts p1 and p2 against each other
func matchUpPlayers(p1, p2 *player) {
	moveChan := make(chan *message)
	p1.moveChan = moveChan
	p2.moveChan = moveChan

	p1.startChan <- true
	p2.startChan <- false

	close(p1.startChan)
	close(p2.startChan)
}
