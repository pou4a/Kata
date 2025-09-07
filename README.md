# Kata

## The Exercise

Implement the code for a supermarket checkout that calculates the total price of a number of items.

-   Items each have their own price, which can change frequently.
-   There are also weekly special offers for when multiple items are bought.
-   An example of this would be "Apples are 50 each or 3 for 130".

### Pricing Table Example

| Item   | Price for 1 item | Offer     |
| ------ | ---------------- | --------- |
| Apple  | 30               | 2 for 45  |
| Banana | 50               | 3 for 130 |
| Peach  | 60               | -         |
| Kiwi   | 20               | -         |

The checkout accepts the items in any order, so that if we scan an apple, a banana and another apple, we'll recognise two apples and apply the discount of 2 for 45.

## Explanation

This repository contains a full-stack application with a NestJS back-end and a React front-end.

## Project Structure

-   `back-end/` - NestJS API server
    -   `src/` - Source code for the API
    -   `prisma/` - Prisma schema and migrations
-   `front-end/` - React application
-   `docker/` - Dockerfiles for backend and frontend
-   `docker-compose.yml` - Docker Compose configuration

## Getting Started

### Prerequisites

-   Node.js (v18+ recommended)
-   Docker & Docker Compose (for containerized setup)

### Development

#### Back-end

1. Install dependencies:
    ```bash
    cd back-end
    npm install
    ```
2. Start the server:
    ```bash
    npm run start:dev
    ```

#### Front-end

1. Install dependencies:
    ```bash
    cd front-end
    npm install
    ```
2. Start the development server:
    ```bash
    npm start
    ```

### Using Docker Compose

To run both services with Docker Compose:

```bash
docker compose up --build
```

## Database

-   Uses Prisma ORM with migrations in `back-end/prisma/migrations`.
-   Configure your database connection in `back-end/prisma/schema.prisma`.

-   If running the backend outside Docker, change DATABASE_URL in your .env to use localhost:5432 instead of db:5432.

## Testing

-   Back-end: `npm run test` (unit), `npm run test:e2e` (end-to-end)
-   Front-end: `npm test`

## License

MIT
