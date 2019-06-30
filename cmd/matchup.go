package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"math/rand"
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
	fmt.Println("player connected: ServeHTTP()")
	socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal("ServeHTTP:", err)
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
			fmt.Println("Only one player: listenForPlayers()")
			m.waitingPlayers = append(m.waitingPlayers, p)
		} else {
			fmt.Println("Other player found: listenForPlayers()")
			p2 := m.waitingPlayers[0]
			go matchUpPlayers(p, p2)
			m.waitingPlayers = m.waitingPlayers[1:]
		}
	}
}

// matchUpPlayers puts p1 and p2 against each other
func matchUpPlayers(p1, p2 *player) {
	fmt.Println("Making match: matchUpPlayers()")
	moveChan := make(chan *message)
	p1.moveChan = moveChan
	p2.moveChan = moveChan

	// start == 0 player one goes first
	// start == 1 player one goes second
	start := rand.Intn(2)
	if start == 0 {
		p1.startChan <- true
		p2.startChan <- false
	} else {
		p1.startChan <- false
		p2.startChan <- true
	}
	close(p1.startChan)
	close(p2.startChan)
}
