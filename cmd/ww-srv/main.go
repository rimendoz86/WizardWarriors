package main

import (
	"context"
	"log"
	"os"

	"github.com/go-redis/redis/v9"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/sonastea/WizardWarriors/pkg/config"
	"github.com/sonastea/WizardWarriors/pkg/hub"
	"github.com/sonastea/WizardWarriors/pkg/server"
	"github.com/sonastea/WizardWarriors/pkg/stores/user"
)

func main() {
	cfg := &config.Config{}
	cfg.Load(os.Args[1:])
	cfg.RedisOpts = config.NewRedisOpts(cfg.RedisURL)

	db, err := pgxpool.Connect(context.Background(), cfg.DBConnURI)
	if err != nil {
		panic(err)
	}
	pool := redis.NewClient(cfg.RedisOpts)

	stores := hub.Stores{}
	stores.UserStore = user.NewStore(db)

	hub, err := hub.New(cfg, stores, pool)
	if err != nil {
		panic(err)
	}

	server, err := server.NewServer(cfg, hub)
	if err != nil {
		log.Fatalln("Unable to create server")
	}

	server.Start(cfg, stores, pool)
}
