# Capstone API

This is the API for the Capstone project. This is the API for the Capstone project. It provides endpoints for managing users, authentication, tourist places, recommendations, and wishlist functionality

## Documentation


To run the documentation locally:

## API Endpoints

### Public Endpoints
- `GET /places/:id` - Get place by ID
- `GET /places` - Get all places
- `GET /gambar/gambarname` -Get image file  example: `/gambar/mt bromo.png`

### Authentication 
- `POST /register` - Register a new user
- `POST /login` - Log in as a user
- `DELETE`/logout` - Logout as user

### User Endpoints
- `GET /whislist` - Get user's wishlist
- `POST /whislist` - Add place to wishlist
- `DELETE /whislist/:placeId` -Remove from wishlist


## Running the API

To run the API in development mode:

```bash
npm run start:dev
```

To run the API in production mode:

```bash
npm run start:prod
```

In your `.env` file:

```
ACCESS_TOKEN_SECRET =your_token-acces
REFRESH_TOKEN_SECRET =yout_token-secret
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE=your_supabase_service_role
DB_NAME=your_db
DB_USER=your_db_user
DB_PASS=your_db_password
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_DIALECT=your_db_dialect
ML_API_SERVICE=your_ml_api
BE_API_SERVICE=your_be_api
```

### Menjalankan Project

#### Development Mode

```bash

npm run start:dev

```

#### Production Mode

```bash

npm run start:prod

```
### To run the open in your browser :
```bash
http://localhost:5000

```
