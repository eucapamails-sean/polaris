import { pgTable, uuid, text, timestamp, jsonb, integer, real, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { jurisdictions, legislativeBodies } from './jurisdictions';

export interface BillSponsor {
  id: string;
  name: string;
  party?: string;
  type: 'primary' | 'cosponsor';
}

export interface ImpactAnalysis {
  executiveSummary: string;
  affectedSectors: string[];
  regulatoryImplications: string;
  stakeholderImpact: Record<string, string>;
  comparisonToExistingLaw?: string;
}

export interface IndividualVote {
  politicianId: string;
  name: string;
  party: string;
  vote: 'yes' | 'no' | 'abstain' | 'absent' | 'not_voting';
}

export interface CommitteeMember {
  politicianId: string;
  name: string;
  role: 'chair' | 'vice_chair' | 'ranking_member' | 'member';
}

export interface Witness {
  name: string;
  title: string;
  organization: string;
}

export const bills = pgTable('bills', {
  id: uuid('id').primaryKey().defaultRandom(),
  externalId: text('external_id').notNull(),
  externalSource: text('external_source').notNull(),
  jurisdictionId: uuid('jurisdiction_id').references(() => jurisdictions.id).notNull(),
  legislativeBodyId: uuid('legislative_body_id').references(() => legislativeBodies.id),
  billNumber: text('bill_number').notNull(),
  title: text('title').notNull(),
  shortTitle: text('short_title'),
  description: text('description'),
  fullText: text('full_text'),
  fullTextUrl: text('full_text_url'),
  status: text('status', { enum: [
    'introduced', 'in_committee', 'passed_committee', 'floor_vote_scheduled',
    'passed_one_chamber', 'passed_both_chambers', 'sent_to_executive',
    'signed_into_law', 'vetoed', 'failed', 'withdrawn', 'expired',
  ] }).notNull(),
  statusDate: timestamp('status_date'),
  introducedDate: timestamp('introduced_date').notNull(),
  sponsors: jsonb('sponsors').$type<BillSponsor[]>(),
  cosponsors: jsonb('cosponsors').$type<BillSponsor[]>(),
  committees: jsonb('committees').$type<string[]>(),
  subjects: jsonb('subjects').$type<string[]>(),
  aiSummary: text('ai_summary'),
  aiImpactAnalysis: jsonb('ai_impact_analysis').$type<ImpactAnalysis>(),
  aiTopics: jsonb('ai_topics').$type<string[]>(),
  passageProbability: real('passage_probability'),
  // pgvector column — requires `CREATE EXTENSION vector` on Neon
  // embedding: vector('embedding', { dimensions: 1536 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const billVersions = pgTable('bill_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  billId: uuid('bill_id').references(() => bills.id).notNull(),
  versionNumber: integer('version_number').notNull(),
  versionDate: timestamp('version_date').notNull(),
  fullText: text('full_text'),
  changesSummary: text('changes_summary'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const billVotes = pgTable('bill_votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  billId: uuid('bill_id').references(() => bills.id).notNull(),
  legislativeBodyId: uuid('legislative_body_id').references(() => legislativeBodies.id).notNull(),
  voteDate: timestamp('vote_date').notNull(),
  result: text('result', { enum: ['passed', 'failed', 'tabled', 'other'] }).notNull(),
  yesCount: integer('yes_count'),
  noCount: integer('no_count'),
  abstainCount: integer('abstain_count'),
  absentCount: integer('absent_count'),
  individualVotes: jsonb('individual_votes').$type<IndividualVote[]>(),
  metadata: jsonb('metadata'),
});

export const committees = pgTable('committees', {
  id: uuid('id').primaryKey().defaultRandom(),
  externalId: text('external_id'),
  legislativeBodyId: uuid('legislative_body_id').references(() => legislativeBodies.id).notNull(),
  name: text('name').notNull(),
  type: text('type', { enum: ['standing', 'select', 'joint', 'subcommittee', 'ad_hoc'] }).notNull(),
  parentCommitteeId: uuid('parent_committee_id').references((): AnyPgColumn => committees.id),
  chair: jsonb('chair').$type<{ politicianId: string; name: string }>(),
  members: jsonb('members').$type<CommitteeMember[]>(),
  jurisdiction: text('jurisdiction'),
  metadata: jsonb('metadata'),
});

export const committeeEvents = pgTable('committee_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  committeeId: uuid('committee_id').references(() => committees.id).notNull(),
  type: text('type', { enum: ['hearing', 'markup', 'business_meeting', 'vote', 'other'] }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  scheduledDate: timestamp('scheduled_date').notNull(),
  location: text('location'),
  liveStreamUrl: text('live_stream_url'),
  transcriptUrl: text('transcript_url'),
  aiSummary: text('ai_summary'),
  witnesses: jsonb('witnesses').$type<Witness[]>(),
  relatedBills: jsonb('related_bills').$type<string[]>(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
