FROM node:20

ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

RUN npm install -g serve

COPY . .

# Accept build args for environment variables
ARG VITE_API_ENDPOINT
# Set environment variables for build time
ENV VITE_API_ENDPOINT=$VITE_API_ENDPOINT

RUN pnpm run build:client

EXPOSE 3000

CMD [ "serve", "-s", "dist/spa" ]