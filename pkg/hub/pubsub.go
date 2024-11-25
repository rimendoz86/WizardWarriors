package hub

import (
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/redis/go-redis/v9"
	"github.com/sonastea/WizardWarriors/pkg/config"
	"github.com/sonastea/WizardWarriors/pkg/stores/user"
)

type Stores struct {
	UserStore *user.Store
}

type Realm string

type PubSub struct {
	conn          *redis.Client
	subs          []Realm
	subscriptions map[Realm]*redis.PubSub

	userStore user.UserStore
}

func NewPubSub(cfg *config.Config, stores Stores, pool *redis.Client) (*PubSub, error) {
	opt, err := redis.ParseURL(cfg.RedisURL)
	if err != nil {
		log.Fatalf("RedisUrl Error: %s\n", err)
	}

	conn := redis.NewClient(opt)

	subs := []Realm{
		"lobby",
	}

	pubsub := &PubSub{
		conn:          conn,
		subs:          subs,
		subscriptions: make(map[Realm]*redis.PubSub),

		userStore: stores.UserStore,
	}

	return pubsub, nil
}

func (h *Hub) ListenPubSub(ctx context.Context) {
	for _, sub := range h.pubsub.subs {
		ch := h.pubsub.conn.PSubscribe(ctx, string(sub))
		h.pubsub.subscriptions[sub] = ch
	}

	for {
		select {
		case msg := <-h.pubsub.subscriptions["lobby"].Channel():
			// h.sendToRoom("lobby", msg.Payload)
			topics := strings.Split(msg.Channel, ".")
			fmt.Printf("%+v\n", topics)
		}
	}
}
