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

#### Signup
- **POST** `/api/auth/signup`
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Login
- **POST** `/api/auth/login`
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

For detailed API documentation, please refer to the Postman collection included in the repository.

## Testing

Run tests using:
```bash
npm test
```

## License

MIT
