package server

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/gorilla/websocket"
	"github.com/sonastea/WizardWarriors/pkg/config"
	"github.com/sonastea/WizardWarriors/pkg/hub"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// Returning true for now, but should check origin.
	CheckOrigin: func(r *http.Request) bool {
		log.Printf("Origin %v\n", r.Header.Get("Origin"))
		return true
	},
}

type Server struct {
	server *http.Server
}

func ServeWs(h *hub.Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	err = hub.NewClient(h, conn)
	if err != nil {
		log.Println(err)
		return
	}
}

func NewServer(cfg *config.Config, hub *hub.Hub) (*Server, error) {
	router := http.NewServeMux()
	router.Handle("/game", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ServeWs(hub, w, r)
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

func (s *Server) Start(hub *hub.Hub) {
	ctx, pubsubCancel := context.WithCancel(context.Background())

	cleanup := make(chan os.Signal, 1)

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
