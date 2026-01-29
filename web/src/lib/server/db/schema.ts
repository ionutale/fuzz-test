import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const projects = pgTable('projects', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	language: text('language').notNull(), // 'cpp', 'java'
	code: text('code'), // Source Code content
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const runs = pgTable('runs', {
	id: serial('id').primaryKey(),
	projectId: integer('project_id').references(() => projects.id).notNull(),
	status: text('status').notNull(), // 'queued', 'running', 'stopped', 'failed'
	startTime: timestamp('start_time').defaultNow(),
	endTime: timestamp('end_time'),
	executionCount: integer('execution_count').default(0),
	coverage: integer('coverage').default(0),
});

export const findings = pgTable('findings', {
	id: serial('id').primaryKey(),
	runId: integer('run_id').references(() => runs.id).notNull(),
	type: text('type').notNull(), // 'crash', 'slow', 'timeout'
	inputData: text('input_data').notNull(), // The crashing input
	outputLog: text('output_log'), // Stack trace / sanitizer output
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
	runs: many(runs),
}));

export const runsRelations = relations(runs, ({ one, many }) => ({
	project: one(projects, {
		fields: [runs.projectId],
		references: [projects.id],
	}),
	findings: many(findings),
}));

export const findingsRelations = relations(findings, ({ one }) => ({
	run: one(runs, {
		fields: [findings.runId],
		references: [runs.id],
	}),
}));
