<script lang="ts">
	let { form } = $props();
</script>

<div class="container mx-auto p-4 max-w-lg">
	<h1 class="text-2xl font-bold mb-6">Create New Project</h1>

	<form method="POST" class="space-y-4">
		<div class="form-control">
			<label class="label" for="name">
				<span class="label-text">Project Name</span>
			</label>
			<input
				type="text"
				name="name"
				id="name"
				placeholder="My Fuzz Test"
				class="input input-bordered w-full"
				required
			/>
		</div>

		<div class="form-control">
			<label class="label" for="language">
				<span class="label-text">Language</span>
			</label>
			<select name="language" id="language" class="select select-bordered w-full" required>
				<option value="cpp">C++</option>
				<option value="java">Java</option>
			</select>
		</div>

		<div class="form-control">
			<label class="label" for="code">
				<span class="label-text">Source Code</span>
			</label>
			<textarea
				name="code"
				id="code"
				class="textarea textarea-bordered h-48 font-mono"
				placeholder="#include <stdint.h>..."
				required
			></textarea>
		</div>

		{#if form?.missing}
			<div role="alert" class="alert alert-error">
				<span>Please fill in all fields.</span>
			</div>
		{/if}

		<div class="flex justify-end gap-2 mt-6">
			<a href="/" class="btn btn-ghost">Cancel</a>
			<button type="submit" class="btn btn-primary">Create Project</button>
		</div>
	</form>
</div>
