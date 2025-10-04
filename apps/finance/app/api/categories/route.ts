import { getServerAuthContext } from "@/actions/auth";
import { createExpenseCategory, getExpenseCategories } from "@/actions/expenses/expense-setup";
import { errorHandler } from "@/lib/api-error-handler";
import { type NextRequest, NextResponse } from "next/server"


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { organizationId } = await getServerAuthContext();
    const onlyActive = searchParams.get('onlyActive') !== 'false'; // defaults to true

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required' }, { status: 400 });
    }
    
    const categories = await getExpenseCategories(organizationId, onlyActive);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    // return errorHandler(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, code } = body;

    const { organizationId } = await getServerAuthContext();
    if (!name) {
      return NextResponse.json(
        { error: "organizationId and name are required" },
        { status: 400 }
      );
    }

    const newCategory = await createExpenseCategory(
      organizationId,
      name,
      description,
      code
    );
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    // return errorHandler(error);
  }
}

