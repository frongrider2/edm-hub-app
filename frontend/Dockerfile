FROM node:20

ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 8080

CMD [ "pnpm", "start" ]