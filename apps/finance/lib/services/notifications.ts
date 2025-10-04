'use server';
import { db } from '@/lib/db';
import { Notification, NotificationType, Prisma } from '@/prisma/client';

// Define the type for create notification input
export type CreateNotificationInput = {
  type: NotificationType;
  title: string;
  description: string;
  link?: string;
  userId?: string;
  recipientEmail?: string;
  senderId?: string;
  details?: Record<string, any>;
};

// Define the type for get notifications query parameters
export type GetNotificationsParams = {
  userId?: string;
  recipientEmail?: string;
  read?: boolean;
  type?: NotificationType;
  page?: number;
  limit?: number;
  orderBy?: 'asc' | 'desc';
};

/**
 * Creates a new notification
 * @param data - The notification data to create
 * @returns The created notification
 * @throws Error if neither userId nor recipientEmail is provided
 */
export async function createNotification(data: CreateNotificationInput): Promise<Notification> {
  if (!data.userId && !data.recipientEmail) {
    throw new Error('A notification must have a recipient (userId or recipientEmail).');
  }

  // Create the notification in the database
  const notification = await db.notification.create({
    data: {
      type: data.type,
      title: data.title,
      description: data.description,
      link: data.link,
      // Conditionally set the recipient
      ...(data.userId && { userId: data.userId }),
      ...(data.recipientEmail && { recipientEmail: data.recipientEmail }),
      // Link to the sending member if provided
      ...(data.senderId && { senderId: data.senderId }),
      details: data.details || {},
    },
  });

  return notification;
}
/**
 * Gets notifications based on filter parameters
 * @param params - Query parameters to filter notifications
 * @returns Array of notifications matching the criteria
 */
export async function getNotifications(params: GetNotificationsParams): Promise<{
  notifications: Notification[];
  total: number;
  unreadCount?: number;
}> {
  const { userId, recipientEmail, read, type, page = 1, limit = 10, orderBy = 'desc' } = params;

  const skip = (page - 1) * limit;

  const whereClause: Prisma.NotificationWhereInput = {};

  if (userId) whereClause.userId = userId;
  if (recipientEmail) whereClause.recipientEmail = recipientEmail;
  if (read !== undefined) whereClause.read = read;
  if (type) whereClause.type = type;

  // Get total count for pagination
  const total = await db.notification.count({
    where: whereClause,
  });

  // Get unread count if looking up by userId or recipientEmail
  let unreadCount;
  if (userId || recipientEmail) {
    const unreadWhereClause = { ...whereClause, read: false };
    unreadCount = await db.notification.count({
      where: unreadWhereClause,
    });
  }

  // Get paginated notifications
  const notifications = await db.notification.findMany({
    where: whereClause,
    skip,
    take: limit,
    orderBy: {
      createdAt: orderBy,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      member: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return {
    notifications,
    total,
    unreadCount,
  };
}

/**
 * Gets a single notification by ID
 * @param id - The notification ID
 * @returns The notification or null if not found
 */
export async function getNotificationById(id: string): Promise<Notification | null> {
  return await db.notification.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      member: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Marks a notification as read
 * @param id - The notification ID to mark as read
 * @returns The updated notification
 * @throws Error if notification not found
 */
export async function markNotificationRead(id: string): Promise<Notification> {
  try {
    return await db.notification.update({
      where: { id },
      data: { read: true },
    });
  } catch (error) {
    console.log(error);
    throw new Error(`Notification not found: ${id}`);
  }
}

/**
 * Marks all notifications as read for a user or email
 * @param params - Object containing either userId or recipientEmail
 * @returns Count of updated notifications
 * @throws Error if neither userId nor recipientEmail is provided
 */
export async function markAllNotificationsRead(params: {
  userId?: string;
  recipientEmail?: string;
}): Promise<{ count: number }> {
  const { userId, recipientEmail } = params;

  if (!userId && !recipientEmail) {
    throw new Error('Either userId or recipientEmail must be provided');
  }

  const whereClause: Prisma.NotificationWhereInput = {
    read: false,
  };

  if (userId) whereClause.userId = userId;
  if (recipientEmail) whereClause.recipientEmail = recipientEmail;

  const result = await db.notification.updateMany({
    where: whereClause,
    data: { read: true },
  });

  return { count: result.count };
}

/**
 * Deletes a notification by ID
 * @param id - The notification ID to delete
 * @returns Boolean indicating if deletion was successful
 */
export async function deleteNotification(id: string): Promise<boolean> {
  try {
    await db.notification.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * Deletes all notifications for a user or email that match criteria
 * @param prisma - PrismaClient instance
 * @param params - Object containing filters for deletion
 * @returns Count of deleted notifications
 */
export async function deleteAllNotifications(params: {
  userId?: string;
  recipientEmail?: string;
  read?: boolean;
  olderThan?: Date;
}): Promise<{ count: number }> {
  const { userId, recipientEmail, read, olderThan } = params;

  if (!userId && !recipientEmail) {
    throw new Error('Either userId or recipientEmail must be provided');
  }

  const whereClause: Prisma.NotificationWhereInput = {};

  if (userId) whereClause.userId = userId;
  if (recipientEmail) whereClause.recipientEmail = recipientEmail;
  if (read !== undefined) whereClause.read = read;
  if (olderThan) whereClause.createdAt = { lt: olderThan };

  const result = await db.notification.deleteMany({
    where: whereClause,
  });

  return { count: result.count };
}
