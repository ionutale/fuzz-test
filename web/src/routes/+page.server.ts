import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load = async () => {
	const projects = await db.select().from(table.projects).orderBy(desc(table.projects.createdAt));
	return { projects };
};
