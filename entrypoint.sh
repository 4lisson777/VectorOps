#!/bin/sh
set -e

echo "Running database migrations..."
cd /app/apps/web
mkdir -p prisma/data
node /app/node_modules/prisma/build/index.js migrate deploy

echo "Starting ShinobiOps..."
exec node /app/apps/web/server.js
