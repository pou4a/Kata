FROM node:20-alpine

WORKDIR /usr/src/app

COPY front-end/package*.json ./
RUN npm ci

COPY front-end ./

# CRA + Docker hot reload tweaks
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

ENV PORT=3001

EXPOSE 3001
CMD ["npm", "start"]
