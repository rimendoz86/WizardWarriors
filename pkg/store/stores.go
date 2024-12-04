package store

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type GameStatsResponse struct {
	ID                 int       `json:"id"`
	Username           string    `json:"username"`
	UserID             int       `json:"user_id"`
	TeamDeaths         int       `json:"team_deaths"`
	TeamKills          int       `json:"team_kills"`
	PlayerLevel        int       `json:"player_level"`
	PlayerKills        int       `json:"player_kills"`
	PlayerKillsAtLevel int       `json:"player_kills_at_level"`
	TotalAllies        int       `json:"total_allies"`
	TotalEnemies       int       `json:"total_enemies"`
	IsGameOver         bool      `json:"is_game_over"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type PlayerSaveResponse struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	MaxLevel  int       `json:"max_level"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	IsActive  bool      `json:"is_active"`
}

type User struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Password  string    `json:"password"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	IsActive  bool      `json:"is_active"`
}

type UserCredentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type userStore interface {
	Add(username, password string) error
	Remove()
	Login(ctx context.Context, username, password string) (context.Context, error)
	PlayerSaves() ([]PlayerSaveResponse, error)
	GetAll()
	Leaderboard() ([]GameStatsResponse, error)
}

type UserStore struct {
	pool *pgxpool.Pool
}

func NewUserStore(pool *pgxpool.Pool) *UserStore {
	return &UserStore{pool: pool}
}

func (us *UserStore) Add(username, password string) error {
	query := `
		INSERT INTO users (username, password)
		VALUES ($1, $2)
	`
	_, err := us.pool.Exec(context.Background(), query, username, password)
	return err
}

func (us *UserStore) Remove() {}

func (us *UserStore) Login(ctx context.Context, username, password string) (context.Context, error) {
	var userId int
	err := us.pool.QueryRow(ctx, `
		SELECT id FROM users WHERE username = $1 AND password = $2
	`, username, password).Scan(&userId)
	if err != nil {
		return ctx, fmt.Errorf("Failed to login: %w", err)
	}

	ctx = context.WithValue(ctx, "userId", userId)

	return ctx, nil
}

func (us *UserStore) PlayerSaves(ctx context.Context) ([]PlayerSaveResponse, error) {
	userId := ctx.Value("userId").(int)
	fmt.Println("User id: ", userId)
	query := `
		SELECT
			id, user_id, max_level, created_at, updated_at, is_active FROM player_saves
		WHERE
			user_id = $1
	`

	rows, err := us.pool.Query(ctx, query, userId)
	if err != nil {
		return nil, fmt.Errorf("Failed to get player saves: %w", err)
	}
	defer rows.Close()

	var saves []PlayerSaveResponse

	for rows.Next() {
		var save PlayerSaveResponse
		err := rows.Scan(
			&save.ID, &save.UserID, &save.MaxLevel, &save.CreatedAt, &save.UpdatedAt, &save.IsActive,
		)
		if err != nil {
			return nil, fmt.Errorf("Failed to scan row: %w", err)
		}
		saves = append(saves, save)
	}

	if rows.Err() != nil {
		return nil, fmt.Errorf("Failed to iterate rows: %w", err)
	}

	return saves, nil
}

func (us *UserStore) GetAll() {}

func (us *UserStore) Leaderboard(ctx context.Context) ([]GameStatsResponse, error) {
	query := ` SELECT eGS.id,
    eU.username AS login,
    eGS.user_id,
    eGS.team_deaths,
    eGS.team_kills,
    eGS.player_level,
    eGS.player_kills,
    eGS.player_kills_at_level,
    eGS.total_allies,
    eGS.total_enemies,
    eGS.is_game_over,
    eGS.updated_at
		FROM
				game_stats AS eGS
		INNER JOIN
				users AS eU
				ON eGS.user_id = eU.id
		WHERE
				eGS.is_active = TRUE
		ORDER BY
				eGS.player_level DESC,
				eGS.player_kills DESC
		LIMIT 20;
	`

	rows, err := us.pool.Query(context.Background(), query)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %w", err)
	}
	defer rows.Close()

	var results []GameStatsResponse

	for rows.Next() {
		var res GameStatsResponse
		err := rows.Scan(
			&res.ID,
			&res.Username,
			&res.UserID,
			&res.TeamDeaths,
			&res.TeamKills,
			&res.PlayerLevel,
			&res.PlayerKills,
			&res.PlayerKillsAtLevel,
			&res.TotalAllies,
			&res.TotalEnemies,
			&res.IsGameOver,
			&res.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}
		results = append(results, res)
	}

	if rows.Err() != nil {
		return nil, fmt.Errorf("row iteration error: %w", rows.Err())
	}

	return results, nil
}
