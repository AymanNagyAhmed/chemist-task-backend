FROM  node:22.11.0-alpine

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

EXPOSE 4000

CMD ["./startup.sh"] 