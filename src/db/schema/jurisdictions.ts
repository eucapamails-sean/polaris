import { pgTable, uuid, text, jsonb, boolean, integer, type AnyPgColumn } from 'drizzle-orm/pg-core';

export interface DataSourceConfig {
  apiUrl?: string;
  apiKey?: string;
  scrapeUrls?: string[];
  refreshIntervalMinutes?: number;
}

export const jurisdictions = pgTable('jurisdictions', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  level: text('level', { enum: ['supranational', 'national', 'state', 'municipal', 'district'] }).notNull(),
  parentId: uuid('parent_id').references((): AnyPgColumn => jurisdictions.id),
  country: text('country').notNull(),
  dataSourceConfig: jsonb('data_source_config').$type<DataSourceConfig>(),
  isActive: boolean('is_active').notNull().default(false),
  timezone: text('timezone').notNull().default('UTC'),
  metadata: jsonb('metadata'),
});

export const legislativeBodies = pgTable('legislative_bodies', {
  id: uuid('id').primaryKey().defaultRandom(),
  jurisdictionId: uuid('jurisdiction_id').references(() => jurisdictions.id).notNull(),
  name: text('name').notNull(),
  type: text('type', { enum: ['upper', 'lower', 'unicameral', 'committee', 'subcommittee'] }).notNull(),
  parentBodyId: uuid('parent_body_id').references((): AnyPgColumn => legislativeBodies.id),
  totalSeats: integer('total_seats'),
  currentTerm: text('current_term'),
  metadata: jsonb('metadata'),
});

export const politicalParties = pgTable('political_parties', {
  id: uuid('id').primaryKey().defaultRandom(),
  jurisdictionId: uuid('jurisdiction_id').references(() => jurisdictions.id).notNull(),
  name: text('name').notNull(),
  shortName: text('short_name'),
  color: text('color'),
  ideology: text('ideology'),
  isRuling: boolean('is_ruling').notNull().default(false),
  metadata: jsonb('metadata'),
});
