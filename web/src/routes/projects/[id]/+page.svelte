<script lang="ts">
	let { data } = $props();
    const { project } = data;
</script>

<div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-3xl font-bold">{project.name}</h1>
            <p class="text-sm opacity-70">Language: {project.language}</p>
        </div>
        <form action="?/startRun" method="POST">
            <button class="btn btn-primary">Start New Run</button>
        </form>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card bg-base-100 shadow border border-base-200">
            <div class="card-body">
                <h2 class="card-title mb-4">Source Code</h2>
                <div class="mockup-code h-96 overflow-y-auto">
                    <pre><code>{project.code}</code></pre>
                </div>
            </div>
        </div>

        <div class="card bg-base-100 shadow border border-base-200">
            <div class="card-body">
                <h2 class="card-title mb-4">Recent Runs</h2>
                <div class="overflow-x-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Start Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each project.runs as run}
                                <tr>
                                    <td>
                                        <div class="badge" class:badge-neutral={run.status === 'queued'} class:badge-info={run.status === 'running'} class:badge-success={run.status === 'stopped'} class:badge-error={run.status === 'failed'}>
                                            {run.status}
                                        </div>
                                    </td>
                                    <td>{new Date(run.startTime).toLocaleString()}</td>
                                    <td>
                                        <button class="btn btn-xs">Details</button>
                                    </td>
                                </tr>
                            {/each}
                            {#if project.runs.length === 0}
                                <tr>
                                    <td colspan="3" class="text-center opacity-50">No runs yet</td>
                                </tr>
                            {/if}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
