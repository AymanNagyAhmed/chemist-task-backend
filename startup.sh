#!/bin/sh

# Generate Prisma Client (in case it wasn't generated during build)
echo "Generating Prisma Client..."
npm run prisma:generate

# Create and apply migrations
echo "Creating and applying database migrations..."
npm run prisma:migrate -- --name init

# Seed the database
echo "Seeding the database..."
npm run prisma:seed

# Start the application
echo "Starting the application..."
npm run start:dev 