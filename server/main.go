package main

import (
	"flag"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"path/filepath"
	"sync"
)

type rootHandler struct {
	once      sync.Once
	temp      *template.Template
	indexPath string
}

func (t *rootHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	t.once.Do(func() {
		t.indexPath = filepath.Join("..", "web", "index", "index.html")
		t.temp = template.Must(template.ParseFiles(t.indexPath))
	})
	t.temp.Execute(w, nil)
}

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
	http.Handle("/", &rootHandler{})
	go mm.listenForPlayers()

	err := http.ListenAndServe(serverAddr, nil)
	if err != nil {
		log.Fatal(err)
	}
}
