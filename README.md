# workindia-irctc-api documentation
Repository containing solution of assignment for SDE Internship Program at WorkIndia

## Overview
This API provides functionalities for user authentication, train operations, and admin-level management with enhanced security using API keys. The API also ensures transaction safety with PostgreSQL.

## Tech Stack
- **Backend:** Node.js with Express.js
- **Database:** PostgreSQL (Managed by Supabase)
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** API Key Protection for Admin Endpoints
- **Concurrency Control:** Transactions & Row-Level Locking (`FOR UPDATE`)

## Authentication
- **JWT-based authentication for users**
- **API key-based authentication for admin operations**

## API Endpoints

### **User Authentication**
| Method | Endpoint                 | Description |
|--------|--------------------------|-------------|
| `POST` | `/api/user/register`    | Register a new user |
| `POST` | `/api/user/login`       | Login and receive JWT |

### **Train Operations**
| Method | Endpoint                              | Description |
|--------|---------------------------------------|-------------|
| `GET`  | `/api/train/availability?source=X&destination=Y` | Get available trains (Public) |
| `POST` | `/api/train/book/:trainId`          | Book a seat on a train (User Required) |
| `GET`  | `/api/train/bookings`               | Get user booking details (User Required) |

### **Admin Operations (API Key Required)**
| Method | Endpoint                              | Description |
|--------|---------------------------------------|-------------|
| `POST`  | `/api/train/add`  | Add a new train |
| `PUT`  | `/api/train/update/:trainId`  | Update total seats of a train |

## Transactions & Concurrency Handling
1. **Ensuring Seat Booking Consistency**
   - Uses **`BEGIN` transaction** to start operations
   - Locks the train row with **`SELECT ... FOR UPDATE`**
   - Commits changes with **`COMMIT`** or rolls back on failure **`ROLLBACK`**
   
2. **Preventing Overbooking**
   - Users competing for the last available seat must wait for transaction completion
   - Ensures only one seat is assigned per request

3. **Optimizing Queries with Indexing**
   - Indexes on frequently searched fields like `source, destination`
   - Fast lookup for user bookings

## Setup & Testing with Postman
1. **Import the `postman_collection.json` into Postman**
2. **Set environment variables:**
   - `base_url`: `http://localhost:5000`
   - `user_token`: _(After login)_
   - `admin_api_key`: _(Stored in `.env`)_
3. **Run API requests and validate responses**