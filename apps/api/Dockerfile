# syntax=docker/dockerfile:1.6

FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["npm", "run", "start"]

