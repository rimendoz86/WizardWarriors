### Wizard Warriors: Getting Started

Follow this guide to set up the project locally using Docker Compose and explore the game.

---
#### **Prerequisites**

- **Docker**: Make sure Docker is installed on your system. You can download it from [Docker's official site](https://www.docker.com/).
- **Docker Compose**: Ensure Docker Compose is also installed. It comes bundled with Docker Desktop.
---

#### **Setup Instructions**

1. **Clone the Repository**

   Clone this repository to your local machine:
   ```bash
   git clone https://github.com/sonastea/WizardWarriors
   cd WizardWarriors
   ```

2. **Build and Start Services**

   Run the following command to build and start all services in detached mode:
   ```bash
   docker-compose up -d
   ```

3. **Seed the Database**

   After the services are running, populate the database with initial data:
   ```bash
   go run seed.go
   ```

4. **Access the Game**

   Once the services are up:
   - Open your browser and navigate to the frontend URL: [http://ww.dev.localhost](http://ww.dev.localhost)
   - The backend server is available at: [http://ww.api.localhost](http://ww.api.localhost)

5. **Stopping the Services**

   To stop the running services:
   ```bash
   docker-compose down
   ```

---

#### **Available Services**

| Service      | Description                                 | URL                                  |
|--------------|---------------------------------------------|--------------------------------------|
| **Traefik**  | Reverse proxy and load balancer            | [http://localhost:8080](http://localhost:8080) |
| **Database** | PostgreSQL database for game data          | `localhost:5432` (PostgreSQL client) |
| **Backend**  | Game backend API server                   | [http://ww.api.localhost](http://ww.api.localhost) |
| **Frontend** | Game user interface                       | [http://ww.dev.localhost](http://ww.dev.localhost) |

---

#### **Database Access**

If you need to connect to the PostgreSQL database:

- **Host:** `localhost`
- **Port:** `5432`
- **Username:** `postgres`
- **Password:** `postgres`
- **Database:** `wizardwarriors`

#### Example Connection Command:

```bash
psql -h localhost -U postgres -d wizardwarriors
```

#### Modify Environment Variables

You can update the following environment variables in `docker-compose.yml`:

- **Frontend:**
  - `NEXT_PUBLIC_API_URL`: URL for the backend API.
  - `NEXT_PUBLIC_WS_URL`: URL for the WebSocket server.

- **Backend:**
  - `DATABASE_URL`: Connection string for PostgreSQL.
  - `REDIS_URL`: Connection string for Redis.

---

Enjoy the game! 🎮
