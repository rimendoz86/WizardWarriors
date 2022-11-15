package hub

import (
	"context"
	"fmt"

	"github.com/go-redis/redis/v9"
	"github.com/sonastea/WizardWarriors/pkg/config"
)

type Hub struct {
	register   chan *Client
	unregister chan *Client

	// users     []models.User
	clients map[*Client]bool
	// rooms     map[*Room]bool
	// roomsLive map[string]*Room

	pubsub *PubSub
}

func New(cfg *config.Config, stores Stores, pool *redis.Client) (*Hub, error) {
	pubsub, err := NewPubSub(cfg, stores, pool)
	if err != nil {
		return nil, err
	}

	hub := &Hub{
		register:   make(chan *Client),
		unregister: make(chan *Client),

		clients: make(map[*Client]bool),

		pubsub: pubsub,
	}

	// hub.users = userStore.GetAllUsers()

	return hub, nil
}

func (hub *Hub) Run(ctx context.Context) {
	go hub.ListenPubSub(ctx)

	for {
		select {

		case client := <-hub.register:
			hub.addClient(client)

		case client := <-hub.unregister:
			hub.removeClient(client)
		}
	}
}

func (hub *Hub) addClient(client *Client) {
	hub.clients[client] = true
	fmt.Println("Joined size of connection pool: ", len(hub.clients))
}

func (hub *Hub) removeClient(client *Client) {
	if _, ok := hub.clients[client]; ok {
		delete(hub.clients, client)
		// hub.userStore.RemoveUser(client)
		fmt.Println("Remaining size of connection pool: ", len(hub.clients))
	}
}

func (hub *Hub) broadcastToClients(message []byte) {
	for client := range hub.clients {
		client.send <- message
	}
}
