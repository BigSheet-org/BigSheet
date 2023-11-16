#!/bin/bash

# Params :
# $1 : key
# $2 : string to replace
# $3 : file_path
write_key() {
    sed -i "s/$2/$1/g" "$3"
}

echo "[CONFIG] - Starting project's configuration... "

POSTGRES_KEY=$(openssl rand -hex 32)
REDIS_KEY=$(openssl rand -hex 32)
JWT_AUTH_KEY=$(openssl rand -hex 32)
JWT_REFRESH_KEY=$(openssl rand -hex 32)

echo "[CONFIG] - Copying files... "

cp -f ./examples/init_db.sql.example ./init_db.sql
cp -f ./examples/.env.example ./.env

echo "[CONFIG] - Installing keys ..."

# PostgreSQL key
write_key "$POSTGRES_KEY" "postgres_key_to_replace" './.env'
write_key "$POSTGRES_KEY" "postgres_key_to_replace" './init_db.sql'

# Redis key
write_key "$REDIS_KEY" "redis_key_to_replace" './.env'

# JWT Keys
write_key "$JWT_AUTH_KEY" "jwt_auth_key_to_replace" './.env'
write_key "$JWT_REFRESH_KEY" "jwt_refresh_key_to_replace" './.env'

echo "[CONFIG] - Configuration done !"