package hub

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/lithammer/shortuuid"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 1000
)

type Client struct {
	sync.RWMutex
	Id       int    `json:"id,string,omitempty"`
	Xid      string `json:"xid"`
	Name     string `json:"name,omitempty"`
	Email    string `json:"email,omitempty"`
	Password string `json:"password,omitempty"`
	conn     *websocket.Conn

	hub *Hub

	send chan []byte
}

func NewClient(hub *Hub, conn *websocket.Conn) error {
	newId := shortuuid.New()
	client := &Client{
		Xid:      newId,
		Name:     newId,
		Email:    newId + "example.com",
		Password: "",
		hub:      hub,
		conn:     conn,
		send:     make(chan []byte),
	}

	hub.register <- client

	go client.writePump()
	go client.readPump()

    return nil
}

func (client *Client) GetId() int {
	return client.Id
}

func (client *Client) GetXid() string {
	return client.Xid
}

func (client *Client) GetName() string {
	return client.Name
}

func (client *Client) GetEmail() string {
	return client.Email
}

func (client *Client) GetPassword() string {
	return client.Password
}

func (client *Client) readPump() {
	defer func() {
		client.hub.unregister <- client
		close(client.send)
		client.conn.Close()
	}()

	client.conn.SetReadLimit(maxMessageSize)
	client.conn.SetReadDeadline(time.Now().Add(pongWait))
	client.conn.SetPongHandler(func(string) error { client.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	for {
		_, message, err := client.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err,
				websocket.CloseGoingAway,
				websocket.CloseAbnormalClosure,
				websocket.CloseNormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		client.hub.pubsub.conn.Publish(context.Background(), "lobby", message)
	}
}

func (client *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		client.conn.Close()
	}()

	for {
		select {
		case msg, ok := <-client.send:
			client.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				client.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := client.conn.NextWriter(websocket.BinaryMessage)
			if err != nil {
				return
			}

			w.Write(msg)

			n := len(client.send)
			for i := 0; i < n; i++ {
				w.Write(<-client.send)
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			client.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := client.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
