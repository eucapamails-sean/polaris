import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getUserContext } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api';
import { stripe } from '@/lib/billing/stripe';

const checkoutSchema = z.object({
  priceId: z.string().min(1),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ctx = await getUserContext();
    if (!ctx) return apiError('UNAUTHORIZED', 'Authentication required', 401);

    const body = await req.json();
    const { priceId, successUrl, cancelUrl } = checkoutSchema.parse(body);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
      cancel_url: cancelUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
      metadata: {
        orgId: ctx.orgId ?? '',
        userId: ctx.userId,
      },
    });

    return apiSuccess({ url: session.url });
  } catch (error) {
    return handleApiError(error);
  }
}
