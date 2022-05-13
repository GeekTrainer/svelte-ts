<script lang="ts">
	let todoItems = [];

	async function load() {
		const response = await fetch("http://localhost:3100");
		todoItems = await response.json();
		return todoItems;
	}

	let newItem = {
		name: "",
		completed: false,
	};

	async function toggleItem(item) {
		item.completed = !item.completed;
		await save(item);
	}

	async function createItem() {
		await save(newItem);
		newItem = {
			name: "",
			completed: false,
		};
	}

	async function save(item) {
		const creatingNewItem = item.id ? false : true;
		console.log(creatingNewItem);
		const response = await fetch("http://localhost:3100", {
			method: creatingNewItem ? "POST" : "PUT",
			body: JSON.stringify(item),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const updatedItem = await response.json();
		if (creatingNewItem) {
			todoItems = [...todoItems, updatedItem];
		} else {
			todoItems = [
				...todoItems.slice(0, updatedItem.id),
				updatedItem,
				...todoItems.slice(updatedItem.id + 1),
			];
		}
	}
</script>

<main>
	<h1>Svelte TypeScript todo list</h1>
	{#await load()}
		<h2>Loading, please wait...</h2>
	{:then}
		<div>
			<form on:submit|preventDefault={async () => await createItem()}>
				<input
					placeholder="Create new item"
					type="text"
					bind:value={newItem.name}
				/>
				<button type="submit">Save</button>
			</form>
		</div>
		<ul>
			{#each todoItems as item}
				<li>
					<button
						type="button"
						on:click={async () => await toggleItem(item)}
						class:completed={item.completed}
						>{item.name}
					</button>
				</li>
			{/each}
		</ul>
	{/await}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		font-size: 3em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	.completed {
		text-decoration: line-through;
	}

	ul {
		list-style-type: none;
	}
</style>
