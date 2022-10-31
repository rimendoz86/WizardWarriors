package hub

import (
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var newLine = ([]byte{'\n'})

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

	hub   *Hub

	send chan []byte
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
		/* for room := range client.rooms {
			room.unregister <- client
		} */
		close(client.send)
		client.conn.Close()
	}()

	client.conn.SetReadLimit(maxMessageSize)
	client.conn.SetReadDeadline(time.Now().Add(pongWait))
	client.conn.SetPongHandler(func(string) error { client.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	/* for {
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

		client.handleIncomingMessage(message)
	} */
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

			w, err := client.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}

			w.Write(msg)

			n := len(client.send)
			for i := 0; i < n; i++ {
				w.Write(newLine)
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

/* func (client *Client) handleIncomingMessage(msg []byte) {
	var m Message
	if err := json.Unmarshal(msg, &m); err != nil {
		log.Printf("Error on unmarshal JSON message %s", err)
		return
	}
	m.Sender = client

	switch m.Type {
	case message.Normal.String():
		client.handleSendMessage(m)

	case message.Command.String():
		switch m.Action {
		case message.JoinRoom.String():
			client.handleJoinRoom(m)
		case message.LeaveRoom.String():
			client.handleLeaveRoom(m)
		}
	}
}

func (client *Client) handleSendMessage(msg Message) {
	msg.Action = message.SendMessage.String()
	roomXid := msg.Room.GetXid()
	client.hub.pubsub.conn.Publish(ctx, "room."+roomXid, msg.encode())
}

func (client *Client) handleJoinRoom(msg Message) {
	roomName := msg.Room.GetName()

	room := client.hub.findRoomByName(client, roomName)

	if client.isInRoom(room) {
		client.notifyRoomClientJoined(room, client)
		return
	}

	if !client.isInRoom(room) {
		client.rooms[room] = true
		room.register <- client
		client.notifyRoomClientJoined(room, client)
	}

	for prevRoom := range client.rooms {
		if room != prevRoom {
			prevRoom.unregister <- client
		}
	}
}

func (client *Client) handleLeaveRoom(msg Message) {
	room := client.hub.findRoomByXid(msg.Room.Xid)
	if room == nil {
		return
	}

	if _, ok := client.rooms[room]; ok {
		delete(client.rooms, room)
	}

	room.unregister <- client
}

func (client *Client) isInRoom(room *Room) bool {
	if _, ok := client.rooms[room]; ok {
		return true
	}

	return false
}

func (client *Client) notifyRoomClientJoined(room *Room, sender models.User) {
	msg := Message{
		Type:   string(message.Server),
		Action: string(message.NotifyJoinRoomMessage),
		Room:   room,
		Body:   fmt.Sprintf("%v joined %v.", sender.GetXid(), room.GetName()),
		Sender: broker,
	}

	client.send <- msg.encode()
} */
