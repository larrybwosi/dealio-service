import { RecurringExpense, ExpenseStatus, RecurrenceFrequency } from '@/prisma/client';
import { add } from 'date-fns';
import prisma from '@/lib/db';
/**
 * Calculates the next due date for a recurring expense based on its frequency.
 * @param lastDueDate - The last due date (or start date for the first calculation).
 * @param frequency - The recurrence frequency (DAILY, WEEKLY, etc.).
 * @returns The next due date.
 */
const calculateNextDueDate = (lastDueDate: Date, frequency: RecurrenceFrequency): Date => {
  switch (frequency) {
    case 'DAILY':
      return add(lastDueDate, { days: 1 });
    case 'WEEKLY':
      return add(lastDueDate, { weeks: 1 });
    case 'BIWEEKLY':
      return add(lastDueDate, { weeks: 2 });
    case 'MONTHLY':
      return add(lastDueDate, { months: 1 });
    case 'QUARTERLY':
      return add(lastDueDate, { months: 3 });
    case 'YEARLY':
      return add(lastDueDate, { years: 1 });
    default:
      throw new Error(`Invalid recurrence frequency: ${frequency}`);
  }
};

/**
 * Creates a new recurring expense.
 * @param data - The data for the new recurring expense.
 * @returns The newly created recurring expense.
 */
export const createRecurringExpense = async (
  data: Omit<
    RecurringExpense,
    'id' | 'createdAt' | 'updatedAt' | 'nextDueDate' | 'expenses' | 'auditLogs' | 'executionLog' | 'attachments'
  >
) => {
  try {
    const nextDueDate = calculateNextDueDate(new Date(data.startDate), data.frequency);

    const recurringExpense = await prisma.recurringExpense.create({
      data: {
        ...data,
        nextDueDate,
      },
    });
    return recurringExpense;
  } catch (error) {
    console.error('Error creating recurring expense:', error);
    throw new Error('Could not create recurring expense.');
  }
};

/**
 * Updates an existing recurring expense.
 * @param id - The ID of the recurring expense to update.
 * @param data - The data to update.
 * @returns The updated recurring expense.
 */
export const updateRecurringExpense = async (
  id: string,
  data: Partial<Omit<RecurringExpense, 'id' | 'createdAt' | 'updatedAt'>>
) => {
  try {
    const existingExpense = await prisma.recurringExpense.findUnique({ where: { id } });
    if (!existingExpense) {
      throw new Error('Recurring expense not found.');
    }

    let nextDueDate = existingExpense.nextDueDate;
    if (data.frequency && data.startDate) {
      nextDueDate = calculateNextDueDate(new Date(data.startDate), data.frequency);
    } else if (data.frequency) {
      nextDueDate = calculateNextDueDate(existingExpense.startDate, data.frequency);
    } else if (data.startDate) {
      nextDueDate = calculateNextDueDate(new Date(data.startDate), existingExpense.frequency);
    }

    const recurringExpense = await prisma.recurringExpense.update({
      where: { id },
      data: {
        ...data,
        nextDueDate,
      },
    });
    return recurringExpense;
  } catch (error) {
    console.error(`Error updating recurring expense with ID ${id}:`, error);
    throw new Error('Could not update recurring expense.');
  }
};

/**
 * Deletes a recurring expense.
 * @param id - The ID of the recurring expense to delete.
 */
export const deleteRecurringExpense = async (id: string) => {
  try {
    await prisma.recurringExpense.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting recurring expense with ID ${id}:`, error);
    throw new Error('Could not delete recurring expense.');
  }
};

/**
 * Fetches all recurring expenses that are due to be processed.
 * @returns An array of due recurring expenses.
 */
export const getDueRecurringExpenses = async () => {
  try {
    const now = new Date();
    const dueExpenses = await prisma.recurringExpense.findMany({
      where: {
        isActive: true,
        nextDueDate: {
          lte: now,
        },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
    });
    return dueExpenses;
  } catch (error) {
    console.error('Error fetching due recurring expenses:', error);
    throw new Error('Could not fetch due recurring expenses.');
  }
};

/**
 * Processes a single due recurring expense: creates an expense record and updates the next due date.
 * @param recurringExpense - The recurring expense to process.
 * @returns The result of the operation.
 */
export const processRecurringExpense = async (recurringExpense: RecurringExpense) => {
  prisma.$transaction(async tx => {
    // 1. Create the new expense from the recurring one
    await tx.expense.create({
      data: {
        description: recurringExpense.description,
        amount: recurringExpense.amount,
        expenseDate: new Date(),
        status: ExpenseStatus.PENDING,
        isReimbursable: false, // Or other default
        categoryId: recurringExpense.categoryId,
        paymentMethod: recurringExpense.paymentMethod,
        organizationId: recurringExpense.organizationId,
        memberId: recurringExpense.createdById,
        recurringExpenseId: recurringExpense.id,
        // expenseNumber must be generated or handled based on your logic
        expenseNumber: `RE-${recurringExpense.id.substring(0, 4)}-${Date.now()}`,
      },
    });

    // 2. Calculate the next due date
    const nextDueDate = calculateNextDueDate(recurringExpense.nextDueDate, recurringExpense.frequency);

    // 3. Check if the recurring expense should be deactivated
    const shouldDeactivate = recurringExpense.endDate && nextDueDate > recurringExpense.endDate;

    // 4. Update the recurring expense with the new due date
    await tx.recurringExpense.update({
      where: { id: recurringExpense.id },
      data: {
        nextDueDate,
        isActive: !shouldDeactivate,
      },
    });
  });

  return { success: true, message: `Successfully processed recurring expense: ${recurringExpense.description}` };
};
