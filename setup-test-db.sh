#!/bin/bash

# Set environment variables for MySQL
export MYSQL_DATABASE=chemist_test_db
export MYSQL_USER=test_user
export MYSQL_PASSWORD=test_password
export MYSQL_ROOT_PASSWORD=root_password

# Create test database and user
mysql -h localhost -u root -p${MYSQL_ROOT_PASSWORD} << EOF
CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'localhost' IDENTIFIED BY '${MYSQL_PASSWORD}';
GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

# Run Prisma migrations
DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@localhost:3306/${MYSQL_DATABASE}" npx prisma migrate deploy 