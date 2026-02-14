import { pgTable, uuid, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';

export const ingestionJobs = pgTable('ingestion_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  source: text('source').notNull(),
  jobType: text('job_type', { enum: ['full_sync', 'incremental', 'realtime', 'backfill'] }).notNull(),
  status: text('status', { enum: ['queued', 'running', 'completed', 'failed', 'retrying'] }).notNull(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  recordsProcessed: integer('records_processed').default(0),
  recordsFailed: integer('records_failed').default(0),
  errorMessage: text('error_message'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ingestionSourceHealth = pgTable('ingestion_source_health', {
  id: uuid('id').primaryKey().defaultRandom(),
  source: text('source').notNull().unique(),
  lastSuccessfulRun: timestamp('last_successful_run'),
  lastFailedRun: timestamp('last_failed_run'),
  consecutiveFailures: integer('consecutive_failures').default(0),
  averageRunTimeMs: integer('average_run_time_ms'),
  status: text('status', { enum: ['healthy', 'degraded', 'down'] }).notNull().default('healthy'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
