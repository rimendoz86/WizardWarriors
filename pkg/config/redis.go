package config

import (
	"github.com/go-redis/redis/v9"
)

func NewRedisOpts(url string) *redis.Options {
	opt, err := redis.ParseURL(url)
	if err != nil {
		panic(err)
	}

	return opt
}
