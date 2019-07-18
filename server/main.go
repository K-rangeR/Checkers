package main

import (
	"flag"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"path/filepath"
)

func main() {
	ipAddr := flag.String("i", "127.0.0.1", "Server IP")
	port := flag.String("p", "8080", "Server port number")
	flag.Parse()

	serverAddr := fmt.Sprintf("%s:%s", *ipAddr, *port)
	fmt.Printf("Server running on %s\n", serverAddr)

	mm := matchMaker{
		playerChan:     make(chan *player),
		waitingPlayers: make([]*player, 0),
	}

	fs := http.FileServer(http.Dir(filepath.Join("..", "web")))
	http.Handle("/web/", http.StripPrefix("/web/", fs))
	http.Handle("/play", &mm)
	go mm.listenForPlayers()

	err := http.ListenAndServe(serverAddr, nil)
	if err != nil {
		log.Fatal(err)
	}
}
