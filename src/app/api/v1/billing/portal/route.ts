import { getUserContext } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api';
import { stripe } from '@/lib/billing/stripe';
import { db } from '@/db';
import { organizations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST() {
  try {
    const ctx = await getUserContext();
    if (!ctx) return apiError('UNAUTHORIZED', 'Authentication required', 401);
    if (!ctx.orgId) return apiError('FORBIDDEN', 'Organization required', 403);

    const org = await db.query.organizations.findFirst({
      where: eq(organizations.clerkOrgId, ctx.orgId),
    });

    if (!org?.stripeCustomerId) {
      return apiError('NOT_FOUND', 'No billing account found', 404);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    });

    return apiSuccess({ url: session.url });
  } catch (error) {
    return handleApiError(error);
  }
}
