package main

import (
	"math/rand"
	"net/http"
	"github.com/gorilla/websocket"
)

var upgrader = &websocket.Upgrader{
	ReadBufferSize: 1024,
	WriteBufferSize: 1024}

// matchMaker represents the http handler that
// will match up players
type matchMaker struct {
	playerChan     chan *player
	waitingPlayers []*player
}

// ServeHTTP is the http handler that runs when a player wants
// to play against another player
func (m *matchMaker) ServeHTTP(w http.ResposneWriter, r *http.Request) {
	socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal("ServeHTTP:", err)
		return
	}

	p := &player{
		socket: socket,
		moveChan: nil,
		startChan: nil,
	}

	m.playerChan <- p
	p.play()
}

// listenForPlayers listens on playerChan for players requesting to play
func (m *matchMaker) listenForPlayers() {
	for {
		select {
		case p := <-m.playerChan:
			if len(m.waitingPlayers) == 0 {
				m.waitingPlayers = append(m.waitingPlayers, p)
			} else {
				p2 := m.waitingPlayer[0]
				go matchUpPlayer(p, p2)
				m.waitingPlayer = m.waitingPlayer[1:]
			}
		}
	}
}

// matchUpPlayers puts p1 and p2 against each other
func matchUpPlayers(p1, p2 *player) {
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
