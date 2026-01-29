<script lang="ts">
	let { data } = $props();
</script>

<div class="container mx-auto p-4">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">FuzzTest Projects</h1>
		<a href="/projects/new" class="btn btn-primary">New Project</a>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each data.projects as project}
			<div class="card bg-base-100 shadow-xl border border-base-200">
				<div class="card-body">
					<h2 class="card-title">{project.name}</h2>
					<p class="badge badge-outline">{project.language}</p>
					<div class="card-actions justify-end mt-4">
						<a href="/projects/{project.id}" class="btn btn-sm">View</a>
					</div>
				</div>
			</div>
		{/each}

		{#if data.projects.length === 0}
			<div class="col-span-full text-center py-10 text-base-content/50">
				No projects found. Create one to get started!
			</div>
		{/if}
	</div>
</div>
