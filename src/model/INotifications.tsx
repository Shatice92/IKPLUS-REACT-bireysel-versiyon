export interface INotifications {
    id: number;
    user_id: number;
    title: string;
    notification: string;
    createdAt: string;
    isRead: boolean;
    notificationType: string;
}