import { Request, Response } from "express";
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrdersByCustomer,
  updateOrderStatus
} from "../services/orderService";
import { OrderStatus } from "../models/order";

const validStatuses: OrderStatus[] = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "PICKED_UP",
  "DELIVERED",
  "CANCELLED"
];

export function createOrderController(req: Request, res: Response): void {
  const { customerId, restaurantId, items, deliveryAddress } = req.body;

  if (!customerId || !restaurantId || !deliveryAddress) {
    res.status(400).json({
      error: "customerId, restaurantId and deliveryAddress are required"
    });
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({
      error: "Order must contain at least one item"
    });
    return;
  }

  const invalidItem = items.some(
    (item) =>
      !item.menuItemId ||
      !item.name ||
      typeof item.quantity !== "number" ||
      item.quantity <= 0 ||
      typeof item.price !== "number" ||
      item.price < 0
  );

  if (invalidItem) {
    res.status(400).json({
      error: "Each item must contain valid menuItemId, name, quantity and price"
    });
    return;
  }

  const order = createOrder({
    customerId,
    restaurantId,
    items,
    deliveryAddress
  });

  res.status(201).json(order);
}

export function getOrderController(req: Request, res: Response): void {
  const orderId = req.params.orderId as string;
  const order = getOrderById(orderId);

  if (!order) {
    res.status(404).json({
      error: "Order not found"
    });
    return;
  }

  res.status(200).json(order);
}

export function getCustomerOrdersController(
  req: Request,
  res: Response
): void {
  const customerId = req.params.customerId as string;
  const customerOrders = getOrdersByCustomer(customerId);

  res.status(200).json(customerOrders);
}

export function updateOrderStatusController(
  req: Request,
  res: Response
): void {
  const orderId = req.params.orderId as string;
  const { status } = req.body;

  if (!status || !validStatuses.includes(status as OrderStatus)) {
    res.status(400).json({
      error: "Invalid order status"
    });
    return;
  }

  const order = updateOrderStatus(orderId, status as OrderStatus);

  if (!order) {
    res.status(404).json({
      error: "Order not found"
    });
    return;
  }

  res.status(200).json(order);
}

export function cancelOrderController(
  req: Request,
  res: Response
): void {
  const orderId = req.params.orderId as string;
  const order = cancelOrder(orderId);

  if (!order) {
    res.status(404).json({
      error: "Order not found"
    });
    return;
  }

  res.status(200).json(order);
}