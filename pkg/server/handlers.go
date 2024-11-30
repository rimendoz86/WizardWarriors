package server

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/rs/cors"
	"github.com/sonastea/WizardWarriors/pkg/store"
)

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

func registerHandler(us *store.UserStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
			return
		}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body.", http.StatusInternalServerError)
			return
		}

		var credentials UserCredentials
		err = json.Unmarshal(body, &credentials)
		if err != nil {
			http.Error(w, "Error parsing request body.", http.StatusBadRequest)
			return
		}

		err = us.Add(credentials.Username, credentials.Password)
		if err != nil {
			http.Error(w, "Error creating user.", http.StatusInternalServerError)
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

func loginHandler(us *store.UserStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
			return
		}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body.", http.StatusInternalServerError)
			return
		}

		var credentials UserCredentials
		err = json.Unmarshal(body, &credentials)
		if err != nil {
			http.Error(w, "Error parsing request body.", http.StatusBadRequest)
			return
		}

		us.Get()

		response := APIResponse{
			Success: true,
			Data:    credentials,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
