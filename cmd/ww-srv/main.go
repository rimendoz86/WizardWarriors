package main

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"github.com/sonastea/WizardWarriors/pkg/config"
	db "github.com/sonastea/WizardWarriors/pkg/database"
	"github.com/sonastea/WizardWarriors/pkg/hub"
	"github.com/sonastea/WizardWarriors/pkg/server"
	"github.com/sonastea/WizardWarriors/pkg/store"
)

func main() {
	ctx := context.Background()

	cfg := &config.Config{}
	cfg.Load(os.Args[1:])
	cfg.RedisOpts = config.NewRedisOpts(cfg.RedisURL)

	_, err := pgxpool.New(context.Background(), cfg.DBConnURI)
	if err != nil {
		panic(err)
	}
	redis := redis.NewClient(cfg.RedisOpts)
	pool := db.NewConnPool(ctx, cfg.DBConnURI)

	stores := hub.Stores{}
	stores.UserStore = store.NewUserStore(pool)

	hub, err := hub.New(cfg, stores, redis)
	if err != nil {
		panic(err)
	}

	server, err := server.NewServer(cfg, hub, stores.UserStore)
	if err != nil {
		log.Fatalln("Unable to create server")
	}

	server.Start(hub)
}
