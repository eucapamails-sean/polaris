import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function apiSuccess<T>(data: T, meta?: { page: number; limit: number; total: number }) {
  return NextResponse.json({
    data,
    meta: meta
      ? { ...meta, hasMore: meta.page * meta.limit < meta.total }
      : undefined,
  });
}

export function apiError(code: string, message: string, status: number, details?: Record<string, unknown>) {
  return NextResponse.json({ error: { code, message, details } }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError('VALIDATION_ERROR', 'Invalid request', 400, {
      issues: error.issues,
    });
  }
  console.error(error);
  return apiError('INTERNAL_ERROR', 'Internal server error', 500);
}
