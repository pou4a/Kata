FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Upgrade Alpine packages and install Postgres client (for pg_isready)
RUN apk upgrade --no-cache \
    && apk add --no-cache postgresql-client bash

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 3000

# Start the app with DB readiness check and Prisma migrations
CMD ["sh", "-c", "until pg_isready -h db -p 5432; do echo 'Waiting for database...'; sleep 2; done; npx prisma migrate dev && npm run start:dev"]
