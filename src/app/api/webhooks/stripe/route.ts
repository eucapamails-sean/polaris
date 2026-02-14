import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/billing/stripe';
import { db } from '@/db';
import { subscriptions, organizations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const sig = headerPayload.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === 'string' ? sub.customer : String(sub.customer);
        const tier = sub.metadata?.tier ?? 'starter';
        const status = mapSubscriptionStatus(sub.status);

        // Upsert subscription
        const existing = await db.query.subscriptions.findFirst({
          where: eq(subscriptions.stripeSubscriptionId, sub.id),
        });

        if (existing) {
          await db.update(subscriptions).set({
            status,
            tier,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            updatedAt: new Date(),
          }).where(eq(subscriptions.stripeSubscriptionId, sub.id));
        } else {
          await db.insert(subscriptions).values({
            stripeSubscriptionId: sub.id,
            stripeCustomerId: customerId,
            ownerId: sub.metadata?.orgId ?? customerId,
            ownerType: 'organization',
            tier,
            status,
          });
        }

        // Update org tier
        if (sub.metadata?.orgId) {
          await db.update(organizations).set({
            tier: tier as 'starter' | 'professional' | 'enterprise' | 'global',
            stripeSubscriptionId: sub.id,
            stripeCustomerId: customerId,
            updatedAt: new Date(),
          }).where(eq(organizations.id, sub.metadata.orgId));
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await db.update(subscriptions).set({
          status: 'canceled',
          updatedAt: new Date(),
        }).where(eq(subscriptions.stripeSubscriptionId, sub.id));

        if (sub.metadata?.orgId) {
          await db.update(organizations).set({
            tier: 'starter',
            updatedAt: new Date(),
          }).where(eq(organizations.id, sub.metadata.orgId));
        }
        break;
      }
    }
  } catch (error) {
    console.error('Stripe webhook processing error:', error);
    // Return 200 even on processing errors to prevent retries
  }

  return new Response('OK', { status: 200 });
}

function mapSubscriptionStatus(
  status: Stripe.Subscription.Status
): 'active' | 'past_due' | 'canceled' | 'trialing' | 'paused' {
  switch (status) {
    case 'active': return 'active';
    case 'past_due': return 'past_due';
    case 'canceled': return 'canceled';
    case 'trialing': return 'trialing';
    case 'paused': return 'paused';
    default: return 'active';
  }
}
