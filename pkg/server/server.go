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
	"github.com/sonastea/WizardWarriors/pkg/store"
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

type userService interface {
	Add(username, password string) error
	Login(ctx context.Context, username, password string) (context.Context, error)
	PlayerSave(ctx context.Context, game_id int) (store.PlayerSaveResponse, error)
	PlayerSaves(ctx context.Context) ([]store.PlayerSaveResponse, error)
	Leaderboard(context.Context) ([]store.GameStatsResponse, error)
	SaveGame(ctx context.Context, game_stats store.GameStats) (store.GameStats, error)
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

func NewServer(cfg *config.Config, hub *hub.Hub, us userService) (*Server, error) {
	router := http.NewServeMux()

	router.Handle("/game", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ServeWs(hub, w, r)
	}))

	router.Handle("/healthcheck", enableCors(healthcheckHandler(), cfg.AllowedOrigins, cfg.Debug))

	router.Handle("/api/leaderboard", enableCors(leaderboardHandler(us), cfg.AllowedOrigins, cfg.Debug))
	router.Handle("/api/player-save", enableCors(playersaveHandler(us), cfg.AllowedOrigins, cfg.Debug))
	router.Handle("/api/save-game", enableCors(saveGameHandler(us), cfg.AllowedOrigins, cfg.Debug))
	router.Handle("/api/register", enableCors(registerHandler(us), cfg.AllowedOrigins, cfg.Debug))
	router.Handle("/api/login", enableCors(loginHandler(us), cfg.AllowedOrigins, cfg.Debug))

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
