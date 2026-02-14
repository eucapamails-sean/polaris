import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';

export interface OrgSettings {
  defaultJurisdictionIds?: string[];
  alertDefaults?: {
    frequency: 'realtime' | 'daily' | 'weekly';
    channels: string[];
  };
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
  };
}

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkOrgId: text('clerk_org_id').notNull().unique(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  tier: text('tier', { enum: ['starter', 'professional', 'enterprise', 'global'] }).notNull().default('starter'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  industry: text('industry'),
  size: text('size', { enum: ['1-10', '11-50', '51-200', '201-1000', '1000+'] }),
  country: text('country').notNull(),
  settings: jsonb('settings').$type<OrgSettings>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orgMemberships = pgTable('org_memberships', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: text('role', { enum: ['owner', 'admin', 'member', 'viewer'] }).notNull().default('member'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
