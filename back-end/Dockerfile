FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk upgrade --no-cache

COPY package*.json ./
RUN npm ci --legacy-peer-deps && npm cache clean --force

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
