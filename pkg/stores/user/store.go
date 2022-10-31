package user

import (
	"github.com/jackc/pgx/v4/pgxpool"
)

type UserStore interface {
	Add()
	Remove()
	Get()
	GetAll()
}

type Store struct {
	db *pgxpool.Pool
}

func NewStore(db *pgxpool.Pool) *Store {
	return &Store{db: db}
}

func (s *Store) Add()    {}
func (s *Store) Remove() {}
func (s *Store) Get()    {}
func (s *Store) GetAll() {}
