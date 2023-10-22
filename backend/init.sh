#!./bin/bash
echo "[CONFIG] - Starting project's configuration... "

# Copying files.
cp ./examples/init_db.sql.example ./init_db.sql
cp ./examples/.env.example ./.env