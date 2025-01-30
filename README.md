# Money Transfer Application

A RESTful API for a money transfer application built with Node.js, Express, and SQLite.

## Features

- User Authentication (Signup/Login)
- Bank Account Management
- Money Transfer Operations
- Transaction History
- Webhook Integration

## Setup

1. Clone the repository:
```bash
git clone https://github.com/carlomagg/Raven-test.git
cd Raven-test
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file and set environment variables:
```
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_for_development
WEBHOOK_SECRET=your_webhook_secret_key_for_development
```

4. Run migrations:
```bash
npm run migrate
```

5. Start the application:
```bash
npm run dev
```

## API Documentation

### Authentication Endpoints

#### 1. Signup
- **POST** `/api/auth/signup`
- **Description**: Create a new user account
- **Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "bank_account_number": null,
      "balance": 0.00
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Login
- **POST** `/api/auth/login`
- **Description**: Login to existing account
- **Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "bank_account_number": "1234567890",
      "balance": 1000.00
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Bank Account Endpoints

#### 1. Generate Bank Account
- **POST** `/api/bank-accounts/generate`
- **Description**: Generate a new bank account number for the user
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "bank_account_number": "1234567890"
  }
}
```

#### 2. Get Bank Account Details
- **GET** `/api/bank-accounts`
- **Description**: Get user's bank account details
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "bank_account_number": "1234567890",
    "balance": 1000.00
  }
}
```

### Transfer Endpoints

#### 1. Initiate Transfer
- **POST** `/api/transfers`
- **Description**: Transfer money to another account
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "amount": 100.00,
  "recipient_account_number": "0987654321",
  "recipient_bank_code": "001",
  "description": "Payment for services"
}
```
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "transaction": {
      "id": 1,
      "type": "transfer",
      "amount": 100.00,
      "reference": "TRF_123456789",
      "status": "pending"
    }
  }
}
```

#### 2. Get Transaction History
- **GET** `/api/transfers/history`
- **Description**: Get user's transaction history
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `type` (optional): Filter by transaction type (deposit, transfer, withdrawal)
  - `status` (optional): Filter by status (pending, completed, failed)
  - `page` (optional): Page number for pagination
  - `limit` (optional): Number of records per page
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "transactions": [
      {
        "id": 1,
        "type": "transfer",
        "amount": 100.00,
        "reference": "TRF_123456789",
        "status": "completed",
        "created_at": "2024-01-30T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10
    }
  }
}
```

### Error Responses

All endpoints may return the following error responses:

#### 1. Validation Error (400)
```json
{
  "status": "error",
  "errors": [
    {
      "msg": "Please provide a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### 2. Authentication Error (401)
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

#### 3. Authorization Error (403)
```json
{
  "status": "error",
  "message": "Access denied"
}
```

#### 4. Resource Not Found (404)
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

## Testing

### Running Tests
```bash
npm test
```

### Using Postman Collection

1. Import the provided `postman_collection.json` into Postman
2. Create a new environment and set:
   - `base_url`: `http://localhost:3000`
   - `token`: (After login, set the JWT token here)
3. Test flow:
   - Create account using signup endpoint
   - Login to get JWT token
   - Set token in environment
   - Generate bank account
   - Test transfer operations

## Database Schema

### Users Table
- `id` (Primary Key)
- `first_name` (String)
- `last_name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `bank_account_number` (String, Unique)
- `balance` (Decimal)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Transactions Table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `type` (String: deposit, transfer, withdrawal)
- `amount` (Decimal)
- `reference` (String, Unique)
- `description` (String)
- `recipient_account_number` (String)
- `recipient_bank_code` (String)
- `recipient_name` (String)
- `status` (String: pending, completed, failed)
- `metadata` (JSON)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## License

MIT
