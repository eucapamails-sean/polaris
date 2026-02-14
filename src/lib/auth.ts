import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users, organizations, orgMemberships } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import type { UserContext } from './permissions';

export async function getUserContext(): Promise<UserContext | null> {
  const { userId, orgId } = await auth();
  if (!userId) return null;

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });
  if (!dbUser) return null;

  let orgTier: string | undefined;
  let orgRole: string | undefined;

  if (orgId) {
    const org = await db.query.organizations.findFirst({
      where: eq(organizations.clerkOrgId, orgId),
    });
    orgTier = org?.tier;

    if (org) {
      const membership = await db.query.orgMemberships.findFirst({
        where: and(eq(orgMemberships.orgId, org.id), eq(orgMemberships.userId, dbUser.id)),
      });
      orgRole = membership?.role;
    }
  }

  return {
    userId: dbUser.id,
    side: dbUser.side as UserContext['side'],
    orgId: orgId ?? undefined,
    orgRole: orgRole as UserContext['orgRole'],
    orgTier: orgTier as UserContext['orgTier'],
    polTier: dbUser.politicianId ? 'foundation' : undefined,
    politicianId: dbUser.politicianId ?? undefined,
    jurisdictions: [],
  };
}
