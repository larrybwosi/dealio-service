// src/lib/validations/finance.ts
import { z } from 'zod';
import { EntryType, Prisma } from '@/prisma/client';

// Schema for creating a new financial account
export const financialAccountSchema = z.object({
  organizationId: z.string().cuid(),
  code: z.string().min(1, 'Account code is required.'),
  name: z.string().min(1, 'Account name is required.'),
  accountTypeId: z.string().cuid(),
  parentId: z.string().cuid().optional(),
  description: z.string().optional(),
  isControlAccount: z.boolean().default(false),
});

// Schema for updating a financial account (all fields are optional)
export const updateFinancialAccountSchema = financialAccountSchema.partial();

// Schema for a single line in a journal entry
const journalLineSchema = z.object({
  accountId: z.string().cuid('Invalid account ID.'),
  type: z.nativeEnum(EntryType),
  amount: z.union([z.number(), z.string(), z.instanceof(Prisma.Decimal)]).transform(val => new Prisma.Decimal(val)),
  description: z.string().optional(),
});

// Schema for creating a complete journal entry
export const createJournalSchema = z
  .object({
    organizationId: z.string().cuid(),
    fiscalPeriodId: z.string().cuid(),
    reference: z.string().min(1, 'Reference is required.'),
    description: z.string().min(1, 'Description is required.'),
    date: z.date(),
    createdBy: z.string().optional(),
    lines: z.array(journalLineSchema).min(2, 'A journal must have at least two lines.'),
  })
  .refine(
    data => {
      // Custom validation to ensure debits equal credits
      const debitTotal = data.lines
        .filter(line => line.type === 'DEBIT')
        .reduce((sum, line) => sum.plus(line.amount), new Prisma.Decimal(0));

      const creditTotal = data.lines
        .filter(line => line.type === 'CREDIT')
        .reduce((sum, line) => sum.plus(line.amount), new Prisma.Decimal(0));

      return debitTotal.equals(creditTotal);
    },
    {
      message: 'Journal is unbalanced. The total debits must equal the total credits.',
      path: ['lines'], // Path to show the error on
    }
  );

// Schema for updating a DRAFT journal
export const updateJournalSchema = z.object(createJournalSchema._def.schema.shape)
  .partial()
  .extend({
    lines: z.array(journalLineSchema).min(2, 'A journal must have at least two lines.').optional(),
  })
  .refine(
    data => {
      if (!data.lines) return true; // if lines are not being updated, skip check
      const debitTotal = data.lines
        .filter(line => line.type === 'DEBIT')
        .reduce((sum, line) => sum.plus(line.amount), new Prisma.Decimal(0));

      const creditTotal = data.lines
        .filter(line => line.type === 'CREDIT')
        .reduce((sum, line) => sum.plus(line.amount), new Prisma.Decimal(0));

      return debitTotal.equals(creditTotal);
    },
    {
      message: 'Journal is unbalanced. The total debits must equal the total credits.',
      path: ['lines'],
    }
  );
