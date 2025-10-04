import { deleteExpenseCategory, updateExpenseCategory } from '@/actions/expenses/expense-setup';
import { errorHandler } from '@/lib/api-error-handler';
import { NextResponse } from 'next/server';

// PATCH update an expense category
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: categoryId } = await params;
    const data = await request.json();

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const updatedCategory = await updateExpenseCategory(categoryId, data);
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: categoryId } = await params;

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const deletedCategory = await deleteExpenseCategory(categoryId);
    return NextResponse.json(deletedCategory);
  } catch (error) {
    return errorHandler(error);
  }
}