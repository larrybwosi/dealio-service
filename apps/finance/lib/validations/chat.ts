import { z } from 'zod';
import { ChannelType } from '@/prisma/client'; // Import your Prisma-generated enum

// --- Channel Schemas ---

/**
 * Schema for creating a new channel.
 */
export const CreateChannelSchema = z.object({
  name: z
    .string()
    .min(1, "Channel name cannot be empty.")
    .max(100, "Channel name is too long."),
  icon: z.string().optional(),
  type: z.nativeEnum(ChannelType).default(ChannelType.CHANNEL),
  isPublic: z.boolean().optional().default(true), // New: Add isPublic
  isGeneral: z.boolean().default(false),
  parentId: z.string().cuid("Invalid parent channel ID.").optional().nullable(),
  memberIds: z.array(z.string()).optional().default([]), // For initial members
  organizationId: z.string().cuid("Invalid organization ID."),
  creatorId: z.string().cuid("Invalid creator ID."),
});

/**
 * Schema for updating an existing channel.
 * Ensures at least one field is provided.
 */
export const UpdateChannelSchema = z
  .object({
    name: z
      .string()
      .min(1, "Channel name cannot be empty.")
      .max(100, "Channel name is too long.")
      .optional(),
    icon: z.string().nullable().optional(), // Allow setting icon to null
    type: z.nativeEnum(ChannelType).optional(),
    isGeneral: z.boolean().optional(),
    parentId: z
      .string()
      .cuid("Invalid parent channel ID.")
      .nullable()
      .optional(), // Allow setting parent to null
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update.",
  });

// --- Message Schemas ---

/**
 * Schema for creating a chat message attachment.
 */
export const CreateAttachmentSchema = z.object({
  name: z.string().min(1),
  url: z.string().url("Invalid attachment URL."),
  type: z.string().min(1),
  size: z.number().int().positive("Attachment size must be positive."),
});

export const SendAssistantMessageSchema = z.object({
  channelId: z.string().cuid("Invalid channel ID."),
  memberId: z.string().cuid("Invalid member ID."),
  assistantId: z.string().cuid("Invalid assistant ID."),
  content: z.string().min(1, "Message content cannot be empty."),
});



/**
 * Schema for creating a new message.
 */
export const CreateMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message content cannot be empty.")
    .max(2000, "Message is too long."),
  channelId: z.string().cuid("Invalid channel ID."),
  parentMessageId: z.string().cuid("Invalid parent message ID.").optional(),
  attachmentData: z.array(CreateAttachmentSchema).optional().default([]),
  memberId: z.string().cuid("Invalid member ID."),
});

/**
 * Schema for updating an existing message (only content).
 */
export const UpdateMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message content cannot be empty.")
    .max(2000, "Message is too long."),
});

// Define types for easier use (optional but recommended)
export type CreateChannelInput = z.infer<typeof CreateChannelSchema>;
export type UpdateChannelInput = z.infer<typeof UpdateChannelSchema>;
export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
export type UpdateMessageInput = z.infer<typeof UpdateMessageSchema>;
