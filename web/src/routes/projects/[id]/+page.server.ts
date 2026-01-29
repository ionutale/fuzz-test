import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ params }) => {
	const projectId = parseInt(params.id);
	if (isNaN(projectId)) error(404, 'Invalid project ID');

	const project = await db.query.projects.findFirst({
		where: eq(table.projects.id, projectId),
		with: {
			runs: {
				orderBy: desc(table.runs.startTime),
				limit: 10
			}
		}
	});

	if (!project) error(404, 'Project not found');

	return { project };
};

export const actions: Actions = {
	startRun: async ({ params }) => {
		const projectId = parseInt(params.id);
		
        const project = await db.query.projects.findFirst({
            where: eq(table.projects.id, projectId)
        });
        if (!project) return fail(404, { message: 'Project not found' });

		// 1. Create a Run entry in DB
		const [run] = await db.insert(table.runs).values({
			projectId,
			status: 'queued'
		}).returning();

		// 2. Call the Go Runner
		try {
			// In docker-compose, runner is available at http://runner:8080 or from env
            const runnerUrl = env.RUNNER_API_URL || 'http://runner:8080';
            
			await fetch(`${runnerUrl}/job`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					language: project.language,
					code: project.code,
					duration: 60 // Default 60s
				})
			});
		} catch (e) {
			console.error("Failed to start runner", e);
            await db.update(table.runs).set({ status: 'failed' }).where(eq(table.runs.id, run.id));
			return fail(500, { message: 'Failed to contact runner' });
		}

		throw redirect(303, `/projects/${projectId}`);
	}
};
