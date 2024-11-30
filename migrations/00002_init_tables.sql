-- 00002_init_tables.sql

-- +goose Up
-- +goose StatementBegin
-- Player Saves Table
CREATE TABLE player_saves (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    max_level INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Insert initial users
INSERT INTO users (username, password)
VALUES
('wizard', 'warrior'),
('test_user', 'test_user');

-- Game Statistics Table
CREATE TABLE game_stats (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    team_deaths INTEGER NOT NULL,
    team_kills INTEGER NOT NULL,
    player_level INTEGER NOT NULL,
    player_kills INTEGER NOT NULL,
    player_kills_at_level INTEGER NOT NULL,
    total_allies INTEGER NOT NULL,
    total_enemies INTEGER NOT NULL,
    is_game_over BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Populate user metadata when inserting a user
CREATE OR REPLACE FUNCTION insert_user(
    p_username VARCHAR(50),
    p_return_key VARCHAR(50)
)
RETURNS INTEGER AS $$
DECLARE
    v_new_id INTEGER;
BEGIN
    INSERT INTO users (
        username,
        return_key,
        created_at,
        created_by,
        updated_at,
        updated_by
    )
    VALUES (
        p_username,
        p_return_key,
        CURRENT_TIMESTAMP,
        p_username,
        CURRENT_TIMESTAMP,
        p_username
    )
    RETURNING id INTO v_new_id;

    RETURN v_new_id;
END;
$$ LANGUAGE plpgsql;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS game_stats;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS player_saves;
DROP FUNCTION IF EXISTS insert_user(VARCHAR(50), VARCHAR(50));
-- +goose StatementEnd
