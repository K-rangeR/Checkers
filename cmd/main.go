package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
)

func main() {
	ipAddr := flag.String("i", "127.0.0.1", "Server IP")
	port := flag.String("p", "8080", "Server port number")
	flag.Parse()

	serverAddr := fmt.Sprintf("%s:%s", *ipAddr, *port)
	fmt.Printf("Server running on %s\n", serverAddr)

	server := http.Server{
		Addr: serverAddr,
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello world")
	})

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
