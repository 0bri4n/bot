FROM oven/bun:latest as build

WORKDIR /usr/app

COPY package*.json ./

RUN bun install

COPY . .

ENTRYPOINT ["bun", "run", "start"]
