package models

import (
	"sync"
)

type User struct {
	sync.RWMutex

	ID uint `json:"id"`

	UUID     string `json:"uuid"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}
