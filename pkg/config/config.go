package config

import (
	"flag"
	"time"

	"github.com/redis/go-redis/v9"
)

type Config struct {
	Addr         string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration

	DBConnURI string
	RedisURL  string
	RedisOpts *redis.Options
}

func (c *Config) Load(args []string) error {
	fs := flag.NewFlagSet("ww", flag.ContinueOnError)

	fs.StringVar(&c.Addr, "ADDR", ":8080", "database connection uri")
	fs.StringVar(&c.DBConnURI, "DATABASE_URL", "", "database connection uri")
	fs.StringVar(&c.RedisURL, "REDIS_URL", "", "redis url")
	err := fs.Parse(args)

	return err
}
