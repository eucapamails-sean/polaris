import { pgTable, uuid, text, timestamp, jsonb, boolean, integer } from 'drizzle-orm/pg-core';
import { users } from './users';
import { organizations } from './organizations';

export interface MonitoringConfig {
  billIds?: string[];
  keywords?: string[];
  committeeIds?: string[];
  politicianIds?: string[];
  policyAreas?: string[];
  jurisdictionIds?: string[];
  customQuery?: string;
}

export interface SearchQuery {
  q?: string;
  filters?: Record<string, unknown>;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
}

export const monitoringTopics = pgTable('monitoring_topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').notNull(),
  ownerType: text('owner_type', { enum: ['user', 'organization'] }).notNull(),
  name: text('name').notNull(),
  type: text('type', { enum: [
    'bill', 'keyword', 'committee', 'politician', 'policy_area',
    'jurisdiction', 'custom_query',
  ] }).notNull(),
  config: jsonb('config').$type<MonitoringConfig>(),
  jurisdictionIds: jsonb('jurisdiction_ids').$type<string[]>(),
  isActive: boolean('is_active').notNull().default(true),
  alertFrequency: text('alert_frequency', { enum: ['realtime', 'daily', 'weekly'] }).default('daily'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const savedSearches = pgTable('saved_searches', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  orgId: uuid('org_id').references(() => organizations.id),
  name: text('name').notNull(),
  searchType: text('search_type', { enum: ['legislation', 'politicians', 'media', 'stakeholders'] }).notNull(),
  query: jsonb('query').$type<SearchQuery>(),
  resultCount: integer('result_count'),
  lastRunAt: timestamp('last_run_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const alerts = pgTable('alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  monitoringTopicId: uuid('monitoring_topic_id').references(() => monitoringTopics.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: text('type', { enum: [
    'bill_status_change', 'new_bill_match', 'committee_event',
    'politician_activity', 'media_mention', 'sentiment_shift',
    'stakeholder_update', 'prediction_change',
  ] }).notNull(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  sourceUrl: text('source_url'),
  relatedEntityId: uuid('related_entity_id'),
  relatedEntityType: text('related_entity_type'),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'critical'] }).default('medium'),
  isRead: boolean('is_read').notNull().default(false),
  deliveredVia: jsonb('delivered_via').$type<string[]>(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
