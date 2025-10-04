// src/lib/validators/loyalty.validators.ts

import { z } from 'zod';
import { LoyaltyActionType } from '@/prisma/client';

// Schema for creating a single loyalty tier
export const createLoyaltyTierSchema = z.object({
  name: z.string().min(1, 'Tier name is required.'),
  minPoints: z.number().int().nonnegative('Minimum points must be a non-negative integer.'),
  pointMultiplier: z.number().positive('Point multiplier must be a positive number.'),
  benefits: z.array(z.string()).optional().default([]),
});

// Schema for creating the main loyalty program
export const createLoyaltyProgramSchema = z.object({
  organizationId: z.string().cuid('Invalid organization ID.'),
  name: z.string().min(1, 'Program name is required.'),
  pointsPerDollar: z.number().positive('Points per dollar must be a positive number.'),
  redemptionRate: z.number().positive('Redemption rate must be a positive number.'),
  isActive: z.boolean().optional().default(true),
  // Optional: Allow creating tiers at the same time
  tiers: z.array(createLoyaltyTierSchema).optional().default([]),
});

// Schema for updating an existing loyalty tier
export const updateLoyaltyTierSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).optional(),
  minPoints: z.number().int().nonnegative().optional(),
  pointMultiplier: z.number().positive().optional(),
  benefits: z.array(z.string()).optional(),
});

// Schema for updating the main loyalty program
export const updateLoyaltyProgramSchema = z.object({
  programId: z.string().cuid(),
  name: z.string().min(1).optional(),
  pointsPerDollar: z.number().positive().optional(),
  redemptionRate: z.number().positive().optional(),
  isActive: z.boolean().optional(),
  // For managing tiers
  tiersToCreate: z.array(createLoyaltyTierSchema).optional(),
  tiersToUpdate: z.array(updateLoyaltyTierSchema).optional(),
  tierIdsToDelete: z.array(z.string().cuid()).optional(),
});

// Schema for setting the point earning rules
export const setLoyaltyPointsConfigSchema = z.object({
  organizationId: z.string().cuid(),
  configs: z.array(
    z.object({
      actionType: z.nativeEnum(LoyaltyActionType),
      points: z.number().int('Points must be an integer.'),
      description: z.string().optional().nullable(),
      isActive: z.boolean().optional().default(true),
    })
  ),
});

// Schema for manually adjusting a customer's loyalty points
export const adjustCustomerPointsSchema = z.object({
  organizationId: z.string().cuid(),
  customerId: z.string().cuid(),
  // The member performing the action
  memberId: z.string().cuid(),
  // The number of points to add (positive) or remove (negative)
  pointsChange: z
    .number()
    .int()
    .refine(val => val !== 0, {
      message: 'Points change cannot be zero.',
    }),
  notes: z.string().min(1, 'A reason for the manual adjustment is required.'),
});

// Export types for use in function signatures
export type CreateLoyaltyProgramInput = z.infer<typeof createLoyaltyProgramSchema>;
export type UpdateLoyaltyProgramInput = z.infer<typeof updateLoyaltyProgramSchema>;
export type SetLoyaltyPointsConfigInput = z.infer<typeof setLoyaltyPointsConfigSchema>;
export type AdjustCustomerPointsInput = z.infer<typeof adjustCustomerPointsSchema>;
