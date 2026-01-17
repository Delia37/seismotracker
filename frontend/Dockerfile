FROM node:19-alpine

RUN mkdir -p app/frontend

WORKDIR /app

WORKDIR /app/frontend
COPY frontend/package*.json .
RUN mkdir node_modules
RUN npm install --legacy-peer-deps

USER root
COPY ./frontend .

EXPOSE 3001
