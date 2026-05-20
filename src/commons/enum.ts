export const OrderStatus = {
    PROCESSING: "PROCESSING",
    PAID: "PAID",
    SHIPPED: "SHIPPED",
    RECEIVED: "RECEIVED",
    CANCELED: "CANCELED"
} as const;

export type OrderStatusType =
    typeof OrderStatus[keyof typeof OrderStatus];