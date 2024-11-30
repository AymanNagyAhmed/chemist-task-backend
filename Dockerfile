FROM node:18-alpine

WORKDIR /usr/src/app

# Install necessary tools for Prisma
RUN apk add --no-cache openssl

# Copy package files and prisma directory first
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN npm run prisma:generate

# Set environment variable to skip migration prompt
ENV PRISMA_MIGRATION_NAME=init

# Create a script to handle migrations and startup
RUN echo '#!/bin/sh\n\
npm run prisma:migrate -- --name $PRISMA_MIGRATION_NAME --create-only\n\
npm run prisma:migrate deploy\n\
npm run start:prod' > ./startup.sh

RUN chmod +x ./startup.sh

EXPOSE 3000

CMD ["./startup.sh"] 