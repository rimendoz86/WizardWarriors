package server

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/rs/cors"
	"github.com/sonastea/WizardWarriors/pkg/store"
)

type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

type PlayerSaveRequestBody struct {
	GameId int `json:"game_id"`
}

func ErrorResponse(err string) string {
	return `{"success": false, "error": "` + err + `"}`
}

func enableCors(h http.Handler, origins []string, debug bool) http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins:   origins,
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodOptions},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		Debug:            debug,
	})

	return c.Handler(h)
}

func healthcheckHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}
}

func registerHandler(us userService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, ErrorResponse("Method not allowed."), http.StatusMethodNotAllowed)
			return
		}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, ErrorResponse("Error reading request body."), http.StatusInternalServerError)
			return
		}

		var credentials store.UserCredentials
		err = json.Unmarshal(body, &credentials)
		if err != nil {
			http.Error(w, ErrorResponse("Error parsing request body."), http.StatusBadRequest)
			return
		}

		err = us.Add(credentials.Username, credentials.Password)
		if err != nil {
			http.Error(w, ErrorResponse("Error creating user."), http.StatusInternalServerError)
			log.Println(err)
			return
		}

		response := APIResponse{
			Success: true,
			Data:    credentials,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

func loginHandler(us userService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, ErrorResponse("Method not allowed."), http.StatusMethodNotAllowed)
			return
		}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, ErrorResponse("Error reading request body."), http.StatusInternalServerError)
			return
		}

		var credentials store.UserCredentials
		err = json.Unmarshal(body, &credentials)
		if err != nil {
			http.Error(w, ErrorResponse("Error parsing request body."), http.StatusBadRequest)
			return
		}

		ctx := context.Background()
		ctx, err = us.Login(ctx, credentials.Username, credentials.Password)
		if err != nil {
			log.Printf("%+v\n", err)
			http.Error(w, ErrorResponse("The username or password is incorrect."), http.StatusUnauthorized)
			return
		}

		saves, err := us.PlayerSaves(ctx)
		if err != nil {
			log.Printf("%+v\n", err)
			http.Error(w, ErrorResponse("Error getting player saves."), http.StatusInternalServerError)
			return
		}

		response := APIResponse{
			Success: true,
			Data:    saves,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

func playersaveHandler(us userService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, ErrorResponse("Method not allowed."), http.StatusMethodNotAllowed)
			return
		}
		var game PlayerSaveRequestBody
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Invalid request.", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		if err := json.Unmarshal(body, &game); err != nil {
			http.Error(w, "Invalid json format.", http.StatusBadRequest)
			return
		}

		ctx := context.Background()
		save, err := us.PlayerSave(ctx, game.GameId)
		if err != nil {
			log.Printf("%+v\n", err)
			http.Error(w, ErrorResponse(err.Error()), http.StatusInternalServerError)
			return
		}

		response := APIResponse{
			Success: true,
			Data:    save,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

func leaderboardHandler(us userService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		/* if r.Method != http.MethodGet {
			http.Error(w, ErrorResponse("Method not allowed."), http.StatusMethodNotAllowed)
			return
		} */

		ctx := context.Background()
		data, err := us.Leaderboard(ctx)
		if err != nil {
			log.Printf("%+v\n", err)
			http.Error(w, ErrorResponse("Error getting leaderboard."), http.StatusInternalServerError)
			return
		}

		response := APIResponse{
			Success: true,
			Data:    data,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
