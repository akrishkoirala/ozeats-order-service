# OzEats Order Service

## Overview

The OzEats Order Service is a RESTful microservice developed for the OzEats food delivery platform as part of BIS5306 Assessment 3.

The service manages the lifecycle of customer orders, including creating orders, retrieving order details, viewing customer order history, updating order status, and cancelling orders.

The application is developed using Node.js, Express, and TypeScript. For this assessment, order data is stored using an in-memory data store rather than a persistent database.

---

## Technology Stack

- Node.js
- TypeScript
- Express.js
- Jest
- Supertest
- Docker
- Git
- GitHub
- GitHub Actions

---

## Project Structure

```text
ozeats-order-service/
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── controllers/
│   │   └── orderController.ts
│   ├── data/
│   │   └── orderStore.ts
│   ├── models/
│   │   └── order.ts
│   ├── routes/
│   │   └── orderRoutes.ts
│   ├── services/
│   │   └── orderService.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   └── order.test.ts
├── .dockerignore
├── .gitignore
├── Dockerfile
├── jest.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## API Endpoints

### Create Order

```http
POST /orders
```

Example request:

```json
{
  "customerId": "CUST001",
  "restaurantId": "REST001",
  "items": [
    {
      "menuItemId": "ITEM001",
      "name": "Chicken Burger",
      "quantity": 2,
      "price": 15.5
    },
    {
      "menuItemId": "ITEM002",
      "name": "Chips",
      "quantity": 1,
      "price": 6
    }
  ],
  "deliveryAddress": "10 George Street, Sydney"
}
```

The service automatically generates the order ID, calculates the total amount, sets the initial status to `PLACED`, and records timestamps.

### Get Order

```http
GET /orders/:orderId
```

Returns the order matching the supplied order ID.

### Get Customer Order History

```http
GET /customers/:customerId/orders
```

Returns orders belonging to the specified customer.

### Update Order Status

```http
PATCH /orders/:orderId/status
```

Example request:

```json
{
  "status": "PREPARING"
}
```

Supported statuses are:

```text
PLACED
ACCEPTED
PREPARING
READY
PICKED_UP
DELIVERED
CANCELLED
```

### Cancel Order

```http
POST /orders/:orderId/cancel
```

Changes the order status to `CANCELLED`.

### Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "OK",
  "service": "OzEats Order Service"
}
```

---

## Installation

Install project dependencies:

```bash
npm install
```

---

## Running the Application

Start the development server:

```bash
npm run dev
```

The service runs on:

```text
http://localhost:3000
```

---

## Automated Testing

The project uses Jest and Supertest for automated API testing.

Run the test suite with:

```bash
npm test
```

The tests cover:

- Successful order creation
- Automatic order total calculation
- Invalid order validation
- Retrieving an existing order
- Updating an order status
- Cancelling an order

---

## TypeScript Build

Compile the TypeScript application with:

```bash
npm run build
```

---

## Docker

The project uses a multi-stage Docker build to separate application compilation from the production runtime image.

Build the Docker image:

```bash
docker build -t ozeats-order-service .
```

Run the container:

```bash
docker run --rm -p 3000:3000 ozeats-order-service
```

The health endpoint can then be accessed at:

```text
http://localhost:3000/health
```

---

## CI/CD Pipeline

GitHub Actions provides automated continuous integration for the project.

The workflow is triggered by pushes and pull requests to the `main` branch.

The pipeline performs two stages:

1. **Test and Build**
   - Checks out the repository
   - Configures Node.js
   - Installs dependencies
   - Runs the automated test suite
   - Compiles the TypeScript application

2. **Docker Build**
   - Runs only after the test and build stage succeeds
   - Configures Docker Buildx
   - Builds the production Docker image

This ensures that code must successfully pass automated testing and compilation before the Docker build stage runs.

---

## Data Storage

This assessment uses an in-memory data store.

Order information is therefore reset whenever the application is restarted. A production implementation could replace the in-memory store with a persistent database without changing the external REST API.

---

## Author

Akrish Koirala

BIS5306 Assessment 3