import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const payments = pgTable("payments", {
    id: serial("id").primaryKey(),
    orderId: text("order_id"),
    paymentId: text("payment_id"),
    userId: text("user_id"), // Added to track who paid
    amount: integer("amount"),
    status: text("status"),
    createdAt: timestamp("created_at").defaultNow(),
});
