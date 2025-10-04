import { NextResponse } from 'next/server';
import { Prisma } from '@/prisma/client';
import { CONFIG, PermissionError } from './auth-context';

// Define a custom error type for better error handling
interface ApiError {
  status: number;
  message: string;
  details?: any;
  customMessage?: string;
}

// Centralized error handler function
export function errorHandler(
  error: unknown,
  customMessage?: string
): NextResponse {
  // Default error response
  let status = 500;
  let message = customMessage || "Internal Server Error";
  let details = undefined;

  // Handle Prisma-specific errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2000": // Value too long for column
        status = 400;
        message =
          customMessage || "Input value too long for the specified field";
        details = { field: error.meta?.target };
        break;

      case "P2001": // Record not found
        status = 404;
        message = customMessage || "The requested record was not found";
        details = { field: error.meta?.target };
        break;

      case "P2002": // Unique constraint violation
        status = 409;
        message =
          customMessage ||
          "Duplicate entry: A record with this value already exists";
        details = { field: error.meta?.target };
        break;

      case "P2003": // Foreign key constraint violation
        status = 400;
        message =
          customMessage ||
          "Invalid reference: The referenced record does not exist";
        details = { field: error.meta?.target };
        break;

      case "P2004": // Constraint failed
        status = 400;
        message = customMessage || "A constraint was violated";
        details = { constraint: error.meta?.target };
        break;

      case "P2005": // Invalid data type
        status = 400;
        message = customMessage || "Invalid data type provided";
        details = { field: error.meta?.target };
        break;

      case "P2006": // Value out of range
        status = 400;
        message = customMessage || "Value out of acceptable range";
        details = { field: error.meta?.target };
        break;

      case "P2007": // Data validation error
        status = 400;
        message = customMessage || "Data validation failed";
        details = { field: error.meta?.target };
        break;

      case "P2011": // Null constraint violation
        status = 400;
        message = customMessage || "Required field cannot be null";
        details = { field: error.meta?.target };
        break;

      case "P2025": // Record to update/delete not found
        status = 404;
        message = customMessage || "Record to update or delete was not found";
        details = { cause: error.meta?.cause };
        break;

      default:
        status = 400;
        message = customMessage || `Database error: ${error.message}`;
        details = { code: error.code, meta: error.meta };
        break;
    }
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    // Unknown database errors
    status = 500;
    message = customMessage || "An unexpected database error occurred";
    details = { cause: error.message };
  } else if (error instanceof PermissionError) {
    status = 403; // Forbidden
    if (error.isBanned) {
      message =
        'Access Denied. You have been temporarily banned for making too many unauthorized requests. Please contact your organization administrator to be unbanned.';
    } else if (error.attempts >= CONFIG.WARNING_THRESHOLD_2) {
      message = `Warning: Permission denied. You have ${error.remainingAttempts} attempt(s) left before your account is temporarily banned. Please contact an administrator if you believe this is an error.`;
    } else if (error.attempts >= CONFIG.WARNING_THRESHOLD_1) {
      message = `Permission denied. You have ${error.remainingAttempts} attempt(s) left. Please contact your organization administrator if you need access.`;
    } else {
      message = `You do not have permission to perform this action. Please contact your organization administrator.`;
    }
    details = {
      attempts: error.attempts,
      isBanned: error.isBanned,
      requiredPermission: error.message.match(/'([^']*)'/)?.[1],
    };
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    // Critical Prisma errors
    status = 500;
    message = customMessage || 'Critical database error';
    details = { cause: error.message };
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    // Database initialization errors
    status = 500;
    message = customMessage || 'Failed to initialize database connection';
    details = { code: error.errorCode, cause: error.message };
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    // Validation errors
    status = 400;
    message = customMessage || 'Invalid input data';
    details = { cause: error.message };
  } else if (error instanceof Error) {
    // Handle generic errors
    switch (error.name) {
      case 'ValidationError':
        status = 400;
        message = customMessage || error.message || 'Invalid input data';
        break;
      case 'AuthenticationError':
        status = 401;
        message = customMessage || error.message || 'Authentication failed';
        break;
      case 'AuthorizationError':
        status = 403;
        message = customMessage || error.message || 'You do not have permission to perform this action';
        break;
      case 'NotFoundError':
        status = 404;
        message = customMessage || error.message || 'Resource not found';
        break;
      default:
        status = 500;
        message = customMessage || error.message || 'An unexpected error occurred';
        break;
    }
  }

  // In production, hide sensitive details
  const isProduction = process.env.NODE_ENV === "production";
  const responseBody: ApiError = {
    status,
    message,
    details: isProduction ? undefined : details,
    customMessage: customMessage || undefined,
  };

  return NextResponse.json(responseBody, { status });
}

// Utility function to wrap API routes
export async function withErrorHandler<T>(
  handler: () => Promise<T>,
  customMessage?: string
): Promise<T> {
  try {
    return await handler();
  } catch (error) {
    return errorHandler(error, customMessage) as any;
  }
}
