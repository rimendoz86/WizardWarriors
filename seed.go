package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	ctx := context.Background()
	connString := os.Getenv("DATABASE_URL")

	pool, err := pgxpool.New(ctx, connString)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer pool.Close()

	err = seedDatabase(ctx, pool)
	if err != nil {
		log.Fatalf("Failed to seed database: %v", err)
	}
}

func seedDatabase(ctx context.Context, pool *pgxpool.Pool) error {
	tx, err := pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("Failed to start transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx, `
		INSERT INTO users (username, password, created_at, updated_at, is_active)
		VALUES
			('wizard', 'warrior', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
			('player1', 'password1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
			('player2', 'password2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
			('cheater', 'cheater', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE);
	`)
	if err != nil {
		return fmt.Errorf("Failed to seed users: %v", err)
	}

	_, err = tx.Exec(ctx, `
		INSERT INTO game_stats (
			user_id,
			team_deaths,
			team_kills,
			player_level,
			player_kills,
			player_kills_at_level,
			total_allies,
			total_enemies,
			is_game_over,
			created_at,
			updated_at,
			is_active
		)
		VALUES
			(1, 2, 2, 20, 20, 25, 10, 40, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
			(2, 3, 3, 15, 15, 20, 8, 30, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
			(3, 4, 4, 10, 10, 15, 6, 20, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
			(4, 1, 1, 25, 25, 10, 20, 50, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE);
	`)
	if err != nil {
		return fmt.Errorf("Failed to seed game_stats: %v", err)
	}

	return tx.Commit(ctx)
}
