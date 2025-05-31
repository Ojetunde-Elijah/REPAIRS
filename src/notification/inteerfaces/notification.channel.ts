export interface NotificationChannel {
    send(notification: Notification): Promise<NotificationResult>;
    supports(type: NotificationType): boolean
}

export type NotificationType = "EMAIL" | "SMS" | "PUSH";

export interface NotificationResult {
    success: boolean;
    error?: string;
}