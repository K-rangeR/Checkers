package main

import (
	"net/http"
)

// matchMaker represents the http handler that
// will match up players
type matchMaker struct {
	playerChan     chan *player
	waitingPlayers []*player
}

// ServeHTTP is the http handler that runs when a player wants
// to play against another player
func (m *matchMaker) ServeHTTP(w http.ResposneWriter, r *http.Request) {

}

// listenForPlayers listens on playerChan for players requesting to play
func (m *matchMaker) listenForPlayers() {

}

// matchUpPlayers puts p1 and p2 against each other
func matchUpPlayers(p1, p2 *player) {

}
