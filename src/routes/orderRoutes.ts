import { Router } from "express";
import {
  cancelOrderController,
  createOrderController,
  getCustomerOrdersController,
  getOrderController,
  updateOrderStatusController
} from "../controllers/orderController";

const router = Router();

router.post("/orders", createOrderController);

router.get("/orders/:orderId", getOrderController);

router.get(
  "/customers/:customerId/orders",
  getCustomerOrdersController
);

router.patch(
  "/orders/:orderId/status",
  updateOrderStatusController
);

router.post(
  "/orders/:orderId/cancel",
  cancelOrderController
);

export default router;