# Money Transfer Application Backend

A backend API for a money transfer application built with Node.js, Express, and MySQL.

## Features

- User authentication (signup and login)
- Bank account generation
- Webhook integration for transfer notifications
- Money transfer functionality using Raven Atlas API
- Transaction history

## Prerequisites

- Node.js (v14 or higher)
- MySQL
- npm or yarn
- Raven Atlas API account
- Postman (for testing APIs)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd money-transfer-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your configuration:
```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=money_transfer_dev

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Raven Atlas API Configuration
RAVEN_PUBLIC_KEY=your_raven_public_key
RAVEN_SECRET_KEY=your_raven_secret_key
RAVEN_API_URL=https://api.getravenbank.com/v1

# Webhook Configuration
WEBHOOK_SECRET=your_webhook_secret
```

4. Run database migrations:
```bash
npm run migrate
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Running Tests
```bash
npm test
```

## API Testing with Postman

A Postman collection is included in the root directory (`postman_collection.json`) for testing all API endpoints.

### Setting up Postman

1. Open Postman
2. Click on "Import" button
3. Select the `postman_collection.json` file from the project directory
4. Create a new environment in Postman:
   - Click on "Environments" tab
   - Click "New"
   - Add the following variables:
     - `base_url`: `http://localhost:3000`
     - `auth_token`: (You'll get this after login)
     - `webhook_signature`: (Generate using your webhook secret)

### Testing Flow

1. Authentication:
   - Use "Sign Up" request to create a new account
   - Use "Login" request to get authentication token
   - Copy the token from the response and set it as `auth_token` in your environment

2. Bank Account Operations:
   - Generate a bank account
   - Get list of available banks
   - Verify bank accounts before transfer

3. Transfer Operations:
   - Initiate transfers (max 100 NGN)
   - Check transaction history
   - Filter transactions by type

4. Webhook Testing:
   - Use webhook.site for testing webhook notifications
   - Test both successful and failed transfers

### Available Endpoints

#### Authentication
- POST `/api/auth/signup` - Create new account
- POST `/api/auth/login` - Login to existing account

#### Bank Accounts
- POST `/api/bank-accounts/generate` - Generate new bank account
- GET `/api/bank-accounts/banks` - Get list of banks
- POST `/api/bank-accounts/verify` - Verify bank account

#### Transfers
- POST `/api/transfers` - Initiate money transfer
- GET `/api/transfers/history` - Get transaction history

#### Webhook
- POST `/api/webhooks/raven` - Webhook endpoint for transfer notifications

## Database Schema

### Users Table
- id (Primary Key)
- first_name
- last_name
- email (Unique)
- password (Hashed)
- bank_account_number (Unique)
- balance
- created_at
- updated_at

### Transactions Table
- id (Primary Key)
- user_id (Foreign Key)
- type (deposit, transfer, withdrawal)
- amount
- reference (Unique)
- description
- recipient_account_number
- recipient_bank_code
- recipient_name
- status (pending, completed, failed)
- metadata (JSON)
- created_at
- updated_at

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 