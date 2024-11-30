package config

import "github.com/redis/go-redis/v9"

func NewRedisOpts(url string) *redis.Options {
	opt, err := redis.ParseURL(url)
	if err != nil {
		panic(err)
	}

	return opt
}
