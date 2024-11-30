package store

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type userStore interface {
	Add(username, password string) error
	Remove()
	Get()
	GetAll()
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

func (us *UserStore) Get() {}

func (us *UserStore) GetAll() {}
