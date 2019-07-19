# Multiplayer Checkers
This project is a multiplayer checker game that runs in the browser.

## How to run code
### Building server
The server is written in golang so navigate to the server directory in the project and run:
```
go build
```
This will create an executable named *server*.

### Running the server
By default the server will run on localhost:8080, to change this run:
```
./server -i [IP] -p [PORTNUM]
```

### Playing game
To read how to play navigate to:
```
localhost:8080/
```
To start a game navigate to:
```
localhost:8080/web/board/board.html
```
At this point the game will tell you that it is waiting for another player. So open a new browser 
window and go to the above URL. Now the game is started and you can make moves that
will be sent to the server and then to the other browser window. Have fun!

## Dependencies
* [Gorilla websocket](https://github.com/gorilla/websocket)
