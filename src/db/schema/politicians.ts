import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { jurisdictions, legislativeBodies, politicalParties } from './jurisdictions';

export interface SocialMediaLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  bluesky?: string;
}

export interface CommitteeMembership {
  committeeId: string;
  committeeName: string;
  role: 'chair' | 'vice_chair' | 'ranking_member' | 'member';
  startDate?: string;
}

export interface SentimentScore {
  overall: number;
  positive: number;
  negative: number;
  neutral: number;
}

export const politicians = pgTable('politicians', {
  id: uuid('id').primaryKey().defaultRandom(),
  externalId: text('external_id'),
  externalSource: text('external_source'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  fullName: text('full_name').notNull(),
  slug: text('slug').notNull().unique(),
  jurisdictionId: uuid('jurisdiction_id').references(() => jurisdictions.id).notNull(),
  legislativeBodyId: uuid('legislative_body_id').references(() => legislativeBodies.id),
  partyId: uuid('party_id').references(() => politicalParties.id),
  position: text('position'),
  constituency: text('constituency'),
  status: text('status', { enum: ['active', 'former', 'candidate', 'contender'] }).notNull(),
  imageUrl: text('image_url'),
  contactEmail: text('contact_email'),
  website: text('website'),
  socialMedia: jsonb('social_media').$type<SocialMediaLinks>(),
  biography: text('biography'),
  committeeMemberships: jsonb('committee_memberships').$type<CommitteeMembership[]>(),
  userId: uuid('user_id'),
  polTier: text('pol_tier', { enum: ['foundation', 'professional', 'strategic', 'campaign'] }).default('foundation'),
  verificationStatus: text('verification_status', { enum: ['unlinked', 'pending', 'verified', 'rejected'] }).default('unlinked'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const politicianActivities = pgTable('politician_activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  politicianId: uuid('politician_id').references(() => politicians.id).notNull(),
  type: text('type', { enum: [
    'vote', 'speech', 'question', 'motion', 'committee_attendance',
    'bill_sponsor', 'bill_cosponsor', 'amendment', 'press_release',
    'media_appearance', 'social_media_post',
  ] }).notNull(),
  title: text('title'),
  description: text('description'),
  sourceUrl: text('source_url'),
  sourceId: text('source_id'),
  relatedBillId: uuid('related_bill_id'),
  relatedCommitteeId: uuid('related_committee_id'),
  activityDate: timestamp('activity_date').notNull(),
  aiSummary: text('ai_summary'),
  sentiment: jsonb('sentiment').$type<SentimentScore>(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
