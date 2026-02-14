import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { db } from '@/db';
import { users, organizations, orgMemberships } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: Record<string, unknown>;
  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as Record<string, unknown>;
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  const data = evt.data as Record<string, unknown>;

  switch (evt.type) {
    case 'user.created':
    case 'user.updated': {
      const emailAddresses = data.email_addresses as Array<{ email_address: string }>;
      await db.insert(users).values({
        clerkId: data.id as string,
        email: emailAddresses?.[0]?.email_address ?? '',
        firstName: data.first_name as string | undefined,
        lastName: data.last_name as string | undefined,
        side: 'org',
      }).onConflictDoUpdate({
        target: users.clerkId,
        set: {
          email: emailAddresses?.[0]?.email_address ?? '',
          firstName: data.first_name as string | undefined,
          lastName: data.last_name as string | undefined,
          updatedAt: new Date(),
        },
      });
      break;
    }

    case 'organization.created':
    case 'organization.updated': {
      await db.insert(organizations).values({
        clerkOrgId: data.id as string,
        name: data.name as string,
        slug: data.slug as string,
        country: 'us',
      }).onConflictDoUpdate({
        target: organizations.clerkOrgId,
        set: {
          name: data.name as string,
          slug: data.slug as string,
          updatedAt: new Date(),
        },
      });
      break;
    }

    case 'organizationMembership.created': {
      const orgData = data.organization as Record<string, unknown>;
      const publicUserData = data.public_user_data as Record<string, unknown>;

      const org = await db.query.organizations.findFirst({
        where: eq(organizations.clerkOrgId, orgData.id as string),
      });
      const user = await db.query.users.findFirst({
        where: eq(users.clerkId, publicUserData.user_id as string),
      });

      if (org && user) {
        await db.insert(orgMemberships).values({
          orgId: org.id,
          userId: user.id,
          role: (data.role as string) === 'admin' ? 'admin' : 'member',
        }).onConflictDoNothing();
      }
      break;
    }
  }

  return new Response('OK', { status: 200 });
}
