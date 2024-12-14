package config

import (
	"flag"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
)

type Config struct {
	Addr         string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration

	AllowedOrigins []string
	Debug          bool
	DBConnURI      string
	RedisURL       string
	RedisOpts      *redis.Options
}

// Load parses the command-line arguments into the Config struct
func (c *Config) Load(args []string) error {
	fs := flag.NewFlagSet("ww", flag.ContinueOnError)

	fs.StringVar(&c.Addr, "ADDR", ":8080", "database connection uri")
	fs.BoolVar(&c.Debug, "debug", false, "enable debug mode for detailed logging")
	fs.StringVar(&c.DBConnURI, "DATABASE_URL", "postgresql://postgres:postgres@db/wizardwarriors", "database connection uri")
	fs.StringVar(&c.RedisURL, "REDIS_URL", "redis://localhost:6379/0", "redis url")

	var allowedOrigins string
	fs.StringVar(&allowedOrigins, "ALLOWED_ORIGINS", "http://ww.dev.localhost,http://localhost:3000", "comma-separated list of allowed origins for CORS")

	if err := fs.Parse(args); err != nil {
		return err
	}

	c.AllowedOrigins = parseOrigins(allowedOrigins)

	return nil
}

// parseOriginsparses the allowed origins flag or uses a default value if none is provided
func parseOrigins(allowedOrigins string) []string {
	if allowedOrigins == "" {
		return []string{"http://localhost:3000"}
	}

	origins := strings.Split(allowedOrigins, ",")
	for i, origin := range origins {
		origins[i] = strings.TrimSpace(origin)
	}

	return origins
}
