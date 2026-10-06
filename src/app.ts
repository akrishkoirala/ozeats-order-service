import orderRoutes from "./routes/orderRoutes";
import express, { Request, Response } from "express";

const app = express();

// Allows the API to receive JSON data
app.use(express.json());
app.use("/", orderRoutes);
// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    service: "OzEats Order Service"
  });
});

export default app;