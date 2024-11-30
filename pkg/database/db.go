package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewConnPool(ctx context.Context, database_url string) *pgxpool.Pool {
  pool, err := pgxpool.New(ctx, database_url)
  if err != nil {
    panic("Unable to connect to database.")
  }

  return pool
}
