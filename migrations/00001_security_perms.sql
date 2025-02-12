-- 00001_security_perms.sql

-- +goose Up
-- +goose StatementBegin
DO $$
BEGIN
   IF NOT EXISTS (
       SELECT FROM pg_roles WHERE rolname = 'wizardwarrior'
   ) THEN
       CREATE ROLE wizardwarrior WITH LOGIN PASSWORD 'wizardwarrior';
   END IF;
END $$;

GRANT CONNECT ON DATABASE wizardwarriors TO wizardwarrior;

GRANT USAGE ON SCHEMA public TO wizardwarrior;
GRANT CREATE ON SCHEMA public TO wizardwarrior;

DO $$
DECLARE
    tbl RECORD;
BEGIN
    FOR tbl IN
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO wizardwarrior', tbl.tablename);
    END LOOP;
END $$;

DO $$
DECLARE
    seq RECORD;
BEGIN
    FOR seq IN
        SELECT sequencename FROM pg_sequences WHERE schemaname = 'public'
    LOOP
        EXECUTE format('GRANT USAGE, SELECT, UPDATE ON SEQUENCE public.%I TO wizardwarrior', seq.sequencename);
    END LOOP;
END $$;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, DELETE, UPDATE, INSERT ON TABLES TO wizardwarrior;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO wizardwarrior;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
REVOKE CONNECT ON DATABASE wizardwarriors FROM wizardwarrior;

DO $$
DECLARE
    table_name text;
BEGIN
    FOR table_name IN
        SELECT tablename
        FROM pg_catalog.pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I FROM wizardwarrior;', table_name);
    END LOOP;
END $$;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE SELECT, DELETE, UPDATE, INSERT ON TABLES FROM wizardwarrior;

DO $$
BEGIN
   IF EXISTS (
       SELECT FROM pg_roles WHERE rolname = 'wizardwarrior'
   ) THEN
       DROP ROLE wizardwarrior;
   END IF;
END $$;
-- +goose StatementEnd
