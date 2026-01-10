FROM node:19-alpine

RUN mkdir -p app/backend

WORKDIR /app

WORKDIR /app/backend

COPY backend/package*.json .
RUN mkdir node_modules
RUN npm install --legacy-peer-deps

COPY ./backend .
RUN mkdir -p prisma/migrations

RUN npx prisma generate

# For the server
EXPOSE 3000

# For prisma studio
EXPOSE 5555

