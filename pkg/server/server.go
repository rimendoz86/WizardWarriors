package server

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/go-redis/redis/v9"
	"github.com/sonastea/WizardWarriors/pkg/config"
	"github.com/sonastea/WizardWarriors/pkg/hub"
)

type Server struct {
	server *http.Server
}

func NewServer(cfg *config.Config, hub *hub.Hub) (*Server, error) {
	router := http.NewServeMux()
	router.Handle("/game", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hub.ServeWs(w, r)
	}))

	srv := &http.Server{
		Addr:         cfg.Addr,
		Handler:      router,
		ReadTimeout:  cfg.ReadTimeout,
		WriteTimeout: cfg.WriteTimeout,
		IdleTimeout:  cfg.IdleTimeout,
	}

	s := &Server{server: srv}

	return s, nil
}

func (s *Server) Start(cfg *config.Config, stores hub.Stores, pool *redis.Client) {
	ctx, pubsubCancel := context.WithCancel(context.Background())

	cleanup := make(chan os.Signal, 1)

	hub, err := hub.New(cfg, stores, pool)
	if err != nil {
		panic(err)
	}

	go hub.Run(ctx)

	go func() {
		signal.Notify(cleanup, syscall.SIGINT, syscall.SIGTERM)
		<-cleanup
		log.Println("Received quit signal . . .")
		ctx, shutdownCancel := context.WithTimeout(context.Background(), 30)
		if err := s.server.Shutdown(ctx); err != nil {
		}
		shutdownCancel()
		pubsubCancel()
	}()

	log.Printf("Listening on %s\n", s.server.Addr)
	if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("HTTP server ListenAndServe: %v", err)
	}
}
