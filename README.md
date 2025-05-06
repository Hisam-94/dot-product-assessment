# Personal Budget Tracker

A full-stack application to help users track their personal finances, manage transactions, and set budgets.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Deployment Guide](#deployment-guide)
6. [API Documentation](#api-documentation)
7. [Local Development](#local-development)
8. [Test Credentials](#test-credentials)

## Project Overview

Personal Budget Tracker is a full-stack web application designed to help users track their personal finances, set budgets, and manage transactions. The application provides visual representations of financial data through interactive charts, helping users understand their spending patterns and make informed financial decisions.

## Features

- **User Authentication**
  - Secure login with JWT
  - Protected routes for authenticated users
  - Token-based session management

- **Dashboard**
  - Financial summary with income, expenses, and balance
  - Interactive pie chart for income vs expenses distribution
  - Bar chart for budget vs actual spending
  - Category breakdown with percentage visualization
  - Month selector for viewing different time periods

- **Transaction Management**
  - Add income and expense transactions
  - Categorize transactions (e.g., Food, Rent, Salary)
  - Edit and delete existing transactions
  - Filter transactions by type, category, date range, and amount
  - Pagination for transaction history

- **Budget Management**
  - Set and update monthly budgets
  - Budget usage visualization
  - Remaining budget calculation
  - Budget history tracking

- **Responsive Design**
  - Mobile-friendly interface
  - Adaptive layout for different screen sizes

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime for the server
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for storing user data, transactions, and budgets
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT (JSON Web Tokens)**: For secure authentication
- **bcrypt**: For password hashing

### Frontend
- **React.js**: JavaScript library for building user interfaces
- **React Router**: For navigation and routing
- **Tailwind CSS**: Utility-first CSS framework for styling
- **D3.js**: Library for creating dynamic and interactive data visualizations
- **Axios**: Promise-based HTTP client for API requests
- **React Context API**: For state management (AuthContext)

## Project Structure

This repository contains two separate projects:

### Backend Structure
```
backend/
├── controllers/   # Request handlers for each route
├── routes/        # API route definitions
├── models/        # Mongoose schemas and models
├── middleware/    # Auth middleware and other middleware
├── config/        # Configuration files
└── server.js      # Entry point for the application
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── layouts/       # Layout components
│   ├── services/      # API service functions
│   ├── context/       # React Context (AuthContext)
│   ├── App.js         # Main App component with routes
│   └── index.js       # Entry point
└── public/            # Static assets
```

## Deployment Guide

Both the frontend and backend can be deployed separately on Vercel.

### Backend Deployment on Vercel

1. Navigate to the Vercel dashboard and create a new project
2. Import your repository or the backend folder
3. Configure the following environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure string for JWT encryption
   - `NODE_ENV`: Set to "production"
4. Set the root directory to `/backend`
5. Set the build command to `npm install`
6. Set the output directory to `/`
7. Deploy and note the generated URL for use in the frontend deployment

### Frontend Deployment on Vercel

1. Navigate to the Vercel dashboard and create a new project
2. Import your repository or the frontend folder
3. Configure the following environment variables:
   - `REACT_APP_API_URL`: The URL from your deployed backend (e.g., https://budget-tracker-backend.vercel.app)
4. Set the root directory to `/frontend`
5. Deploy

## API Documentation

### Authentication Endpoints

#### `POST /api/auth/login`
- **Description**: Authenticates a user and returns a JWT
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    }
  }
  ```

#### `GET /api/auth/profile`
- **Description**: Retrieves authenticated user's profile
- **Headers**: `x-auth-token: jwt_token_here`

### Transaction Endpoints

#### `GET /api/transactions`
- **Description**: Retrieves user transactions with optional filtering
- **Headers**: `x-auth-token: jwt_token_here`
- **Query Parameters**:
  - `type`: "income" or "expense"
  - `category`: Transaction category
  - `startDate`, `endDate`, `minAmount`, `maxAmount`
  - `page`, `limit`: For pagination

#### `POST /api/transactions`
- **Description**: Creates a new transaction
- **Headers**: `x-auth-token: jwt_token_here`
- **Request Body**: Transaction data

#### `PUT /api/transactions/:id`
- **Description**: Updates an existing transaction
- **Headers**: `x-auth-token: jwt_token_here`
- **URL Parameters**: `id` - Transaction ID
- **Request Body**: Fields to update

#### `DELETE /api/transactions/:id`
- **Description**: Deletes a transaction
- **Headers**: `x-auth-token: jwt_token_here`
- **URL Parameters**: `id` - Transaction ID

### Budget Endpoints

#### `GET /api/budget`
- **Description**: Gets the budget for a specific month
- **Headers**: `x-auth-token: jwt_token_here`
- **Query Parameters**: `month` (optional, format: "YYYY-MM")

#### `POST /api/budget`
- **Description**: Creates or updates a budget for a month
- **Headers**: `x-auth-token: jwt_token_here`
- **Request Body**: Budget data

#### `GET /api/budget/history`
- **Description**: Gets budget history
- **Headers**: `x-auth-token: jwt_token_here`

### Summary Endpoints

#### `GET /api/summary`
- **Description**: Gets financial summary for a specific month
- **Headers**: `x-auth-token: jwt_token_here`
- **Query Parameters**: `month` (optional, format: "YYYY-MM")

#### `GET /api/summary/monthly`
- **Description**: Gets monthly overview for a year
- **Headers**: `x-auth-token: jwt_token_here`
- **Query Parameters**: `year` (optional, format: "YYYY")

## Local Development

### Prerequisites
- Node.js and npm installed
- MongoDB instance (local or cloud)

### Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file with your configuration
# Example .env content:
# PORT=5000
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
# JWT_SECRET=your_jwt_secret

# Start the development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create a .env.local file (optional)
# Example .env.local content:
# REACT_APP_API_URL=http://localhost:5000

# Start the development server
npm start
```

## Test Credentials

To test the application, use the following credentials:

- **Email**: `test@gmail.com`
- **Password**: `test@1321`

## License

MIT 
