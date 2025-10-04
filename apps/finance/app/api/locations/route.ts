import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth-context';
import z from 'zod';
import { LocationType } from '@/prisma/client';
import { getServerAuthContext } from '@/actions/auth';

export async function GET(request: Request, { params }: { params: Promise<{ organizationId: string }> }) {
  try {
    const { organizationId } = await getServerAuthContext();

    // Uncomment to enable permission check
    // await requirePermission({ organizationId }, 'location:view');

    const locations = await prisma.inventoryLocation.findMany({
      where: { organizationId },
      orderBy: { name: 'asc' },
      include: {
        stockBatches: {
          select: {
            currentQuantity: true,
            purchasePrice: true,
            variant: { select: { product: { select: { id: true } } } },
          },
        },
        manager: {
          select: {
            id: true,
            user: { select: { name: true } },
          },
        },
      },
    });
    // console.log(locations)

    // Transform to match our response schema
    const warehouses = locations.map(location => {
      // Calculate used capacity and stock value
      const stockData = location.stockBatches.reduce(
        (acc, batch) => {
          const quantity = batch.currentQuantity || 0;
          const price = batch.purchasePrice ? Number(batch.purchasePrice) : 0;
          acc.quantity += quantity;
          acc.value += quantity * price;
          return acc;
        },
        { quantity: 0, value: 0 }
      );

      // Count unique products
      const productCount = new Set(location.stockBatches.map(batch => batch.variant.product.id)).size;

      interface Capacity {
        maxItems?: number;
        currentValue?: number;
        maxValue?: number;
        currentItems?: number;
      }
      // Extract capacity fields from the JSON capacity object
      const capacity = location.capacity?.toString() ?? '{}' as Capacity;
      const enableCapacityTracking = capacity.maxItems !== undefined || capacity.maxValue !== undefined;

      return {
        id: location.id,
        name: location.name,
        description: location.description || undefined,
        code: location.code,
        type: location.locationType,
        isActive: location.isActive,
        isDefault: location.isDefault,
        capacityTracking: enableCapacityTracking,
        totalCapacity: capacity.maxItems || undefined,
        capacityUnit: capacity.maxItems ? 'COUNT' : undefined, // Default to COUNT for maxItems
        capacityUsed: capacity.currentItems || undefined,
        capacity,
        address: location.address || undefined,
        managerId: location.managerId || undefined,
        managerName: location.manager?.user.name || undefined,
        contact: location.contact || undefined,
        productCount,
        stockValue: stockData.value,
        createdAt: location.createdAt.toISOString(),
        updatedAt: location.updatedAt.toISOString(),
      };
    });

    return NextResponse.json(warehouses);
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return NextResponse.json({ error: 'Failed to fetch warehouses' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


// Define the Zod schema for the request body
const CreateLocationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  type: z.nativeEnum(LocationType).default(LocationType.WAREHOUSE),
  status: z.enum(['active', 'inactive']).optional().default('active'),
  address: z
    .object({
      street: z.string().optional().default(''),
      city: z.string().optional().default(''),
      state: z.string().optional().default(''),
      zipCode: z.string().optional().default(''),
      country: z.string().optional().default(''),
    })
    .optional()
    .default({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    }),
  contact: z
    .object({
      phone: z.string().optional().default(''),
      email: z.string().email().optional().default(''),
      managerId: z.string().optional(),
    })
    .optional()
    .default({
      phone: '',
      email: '',
      managerId: undefined,
    }),
  capacity: z
    .object({
      maxItems: z.number().int().nonnegative().optional().default(0),
      currentItems: z.number().int().nonnegative().optional().default(0),
      maxValue: z.number().nonnegative().optional().default(0),
      currentValue: z.number().nonnegative().optional().default(0),
    })
    .optional()
    .default({
      maxItems: 0,
      currentItems: 0,
      maxValue: 0,
      currentValue: 0,
    }),
  settings: z
    .object({
      autoReorder: z.boolean().optional().default(true),
      qualityCheck: z.boolean().optional().default(true),
      approvalRequired: z.boolean().optional().default(false),
      operatingHours: z.string().optional().default('24/7'),
      timezone: z.string().optional().default('America/New_York'),
    })
    .optional()
    .default({
      autoReorder: true,
      qualityCheck: true,
      approvalRequired: false,
      operatingHours: '24/7',
      timezone: 'America/New_York',
    }),
});

export async function POST(request: Request, { params }: { params: Promise<{ organizationId: string }> }) {
  try {
    const body = await request.json();
    const { organizationId } = await params;

    // Validate the request body with Zod
    const parsedBody = CreateLocationSchema.safeParse(body);
    if (!parsedBody.success) {
      console.log(parsedBody.error.flatten().fieldErrors);
      return NextResponse.json(
        {
          message: 'Invalid request body',
          errors: parsedBody.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
// console.log(parsedBody.data);
// return new NextResponse('Failed', { status:409})
    // Extract validated data
    const { name, code, type, status, address, contact, capacity, settings } = parsedBody.data;

    // Extract managerId from contact
    const managerId = contact.managerId;

    // Check permissions
    await requirePermission({ organizationId }, 'location:create');

    // Create a new location record in the database
    const newLocation = await prisma.inventoryLocation.create({
      data: {
        name,
        code,
        locationType: type,
        isActive: status === 'active',
        managerId,
        address,
        contact,
        capacity,
        settings,
        organizationId,
      },
    });
    

    return NextResponse.json(newLocation, { status: 201 });
  } catch (error) {
    console.error('Error creating location:', error);

    // Handle Prisma unique constraint error
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ message: 'A location with this code already exists.' }, { status: 409 });
    }

    return NextResponse.json({ message: 'Failed to create location' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}