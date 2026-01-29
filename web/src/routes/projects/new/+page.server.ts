import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const language = formData.get('language') as string;
		const code = formData.get('code') as string;

		if (!name || !language || !code) {
			return fail(400, { missing: true });
		}

		await db.insert(table.projects).values({ name, language, code });

		throw redirect(303, '/');
	}
};
