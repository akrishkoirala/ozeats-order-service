import { randomUUID } from "crypto";
import { orders } from "../data/orderStore";
import { Order, OrderItem, OrderStatus } from "../models/order";

interface CreateOrderInput {
  customerId: string;
  restaurantId: string;
  items: OrderItem[];
  deliveryAddress: string;
}

export function createOrder(input: CreateOrderInput): Order {
  const now = new Date().toISOString();

  const totalAmount = input.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const order: Order = {
    orderId: randomUUID(),
    customerId: input.customerId,
    restaurantId: input.restaurantId,
    status: "PLACED",
    items: input.items,
    deliveryAddress: input.deliveryAddress,
    totalAmount: Number(totalAmount.toFixed(2)),
    createdAt: now,
    updatedAt: now
  };

  orders.push(order);

  return order;
}

export function getOrderById(orderId: string): Order | undefined {
  return orders.find((order) => order.orderId === orderId);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return orders
    .filter((order) => order.customerId === customerId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Order | undefined {
  const order = getOrderById(orderId);

  if (!order) {
    return undefined;
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  return order;
}

export function cancelOrder(orderId: string): Order | undefined {
  const order = getOrderById(orderId);

  if (!order) {
    return undefined;
  }

  order.status = "CANCELLED";
  order.updatedAt = new Date().toISOString();

  return order;
}