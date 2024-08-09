# Stage 1: build
FROM node:20-alpine AS development

WORKDIR /khoa/frontend/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@17

COPY . .

RUN npm run build

EXPOSE 4200