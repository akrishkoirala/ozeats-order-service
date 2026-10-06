import request from "supertest";
import app from "../src/app";
import { orders } from "../src/data/orderStore";

const sampleOrder = {
  customerId: "CUST001",
  restaurantId: "REST001",
  items: [
    {
      menuItemId: "ITEM001",
      name: "Chicken Burger",
      quantity: 2,
      price: 15.5
    },
    {
      menuItemId: "ITEM002",
      name: "Chips",
      quantity: 1,
      price: 6
    }
  ],
  deliveryAddress: "10 George Street, Sydney"
};

beforeEach(() => {
  orders.length = 0;
});

describe("OzEats Order Service API", () => {
  test("POST /orders creates an order and calculates the total", async () => {
    const response = await request(app)
      .post("/orders")
      .send(sampleOrder);

    expect(response.status).toBe(201);
    expect(response.body.customerId).toBe("CUST001");
    expect(response.body.status).toBe("PLACED");
    expect(response.body.totalAmount).toBe(37);
    expect(response.body.orderId).toBeDefined();
  });

  test("POST /orders rejects an order with no items", async () => {
    const response = await request(app)
      .post("/orders")
      .send({
        ...sampleOrder,
        items: []
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Order must contain at least one item"
    );
  });

  test("GET /orders/:orderId returns an existing order", async () => {
    const created = await request(app)
      .post("/orders")
      .send(sampleOrder);

    const response = await request(app)
      .get(`/orders/${created.body.orderId}`);

    expect(response.status).toBe(200);
    expect(response.body.orderId).toBe(created.body.orderId);
    expect(response.body.customerId).toBe("CUST001");
  });

  test("PATCH /orders/:orderId/status updates the order status", async () => {
    const created = await request(app)
      .post("/orders")
      .send(sampleOrder);

    const response = await request(app)
      .patch(`/orders/${created.body.orderId}/status`)
      .send({
        status: "PREPARING"
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("PREPARING");
  });

  test("POST /orders/:orderId/cancel cancels an order", async () => {
    const created = await request(app)
      .post("/orders")
      .send(sampleOrder);

    const response = await request(app)
      .post(`/orders/${created.body.orderId}/cancel`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("CANCELLED");
  });
});