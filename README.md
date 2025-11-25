<p align="center">
  <img src="https://edmhub.astrodeval.lol/images/logo.png" alt="EDM Hub Logo" width="80" style="border-radius:16px;" />
</p>

## EDM HUB

A fully responsive music streaming platform built with Nest.Js, React, Tailwind CSS, and Vite.

[Live Demo 🚀](https://edmhub.astrodeval.lol)

<a href="https://edmhub.astrodeval.lol"><img src="https://edmhub.astrodeval.lol/thumnail.png" alt="Imgur-Magic" border="0"></a>

## Features

- 🎵 **Get data from Spotify API** – Get and save artists, albums, tracks, and genres from Spotify API to the database.
- 🔐 **Authentication** – Login or register with Google and email.
- 🎶 **Playlist** – Create and delete playlists.
- ➕ **Track** – Add tracks to playlists.
- 🛠️ **Admin panel** – Sync artists, albums, tracks, and genres from Spotify API and save to database.

## Tech Stack

- **Frontend**: Typescript, React, Tailwind CSS, Vite, redux-toolkit, builder.io and frammer-motion.
- **Backend**: Typescript, Nest.Js, MongoDB, MVC architecture, mirate-mongo and spotify-api.
- **Database**: MongoDB
- **Authentication**: JWT and Google OAuth.
- **Infrastructure**: Digital ocean, Docker, Docker compose, Cloudflare, Dokploy and Cloudflare-tunnel.

## Installation (Local Development)

1. Clone the repository

```bash
git clone https://github.com/frongrider2/edm-hub-app.git
```

2. Create a `.env` file in the project root and set the following environment variables:

<details>
<summary>Sample <code>.env</code> for local development</summary>

```env
# -------------------- MongoDB (local development only)
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=123456
MONGO_INITDB_DATABASE=edm
MONGO_INITDB_USERNAME=admin
MONGO_INITDB_PASSWORD=123456

# -------------------- Backend
NODE_ENV=dev
BCRYPT_SALT_ROUNDS=10
JWT_SECRET=12345

MONGO_URI=mongodb://root:123456@localhost:27017
MONGO_DB_NAME=edm

# Google authentication
OAUTH_CLIENT=
OAUTH_SECRET=
OAUTH_CALLBACK_URL=

FRONTEND_URL=

# Spotify API
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# -------------------- Frontend
VITE_API_ENDPOINT=http://localhost:3000/api
```

</details>

3. Start the MongoDB service:

```bash
docker-compose -f docker-compose-db.yml up -d
```

4. Copy the `.env` file to both the backend and frontend directories:

```bash
cp .env backend/.env
cp .env frontend/.env
```

5. Install dependencies and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

6. Open a new terminal, then install dependencies and start the backend:

```bash
cd backend
npm install
npm run start:dev
```

## Deployment

For deployment, you can use the following command to deploy the application to vm (backend and frontend).

1. Clone the repository

```bash
git clone https://github.com/frongrider2/edm-hub-app.git
```

2. Create a `.env` file and set the environment variables

```
#------------------------------------- BACKEND

NODE_ENV = prod
BCRYPT_SALT_ROUNDS = 10
JWT_SECRET =

MONGO_URI = mongodb://localhost:123456@localhost:27017
MONGO_DB_NAME = edm

#Google auth
OAUTH_CLIENT=
OAUTH_SECRET=
OAUTH_CALLBACK_URL=

FRONTEND_URL=

#spotify
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

#-------------------------------------   FRONTEND

VITE_API_ENDPOINT=
```

3. Run the following command to start the application

```bash
docker-compose up -d --build
```

The backend service runs on port 3000 inside the container.
The frontend service runs on port 8080 inside the container.
