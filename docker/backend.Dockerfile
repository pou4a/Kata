FROM node:20-alpine

WORKDIR /usr/src/app

# deps
COPY back-end/package*.json ./
RUN npm ci

COPY back-end/prisma ./prisma
RUN npx prisma generate || true

COPY back-end ./

EXPOSE 3000
CMD ["sh", "-c", "npx prisma generate && npm run start:dev"]
