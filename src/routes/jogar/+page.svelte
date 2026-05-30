<script lang="ts">
	import { onMount } from "svelte";

	let x = 185;
	let y = 185;
	const speed = 10;

	function move(event: KeyboardEvent) {
		switch (event.key) {
			case "ArrowUp":
				y -= speed;
				break;
			case "ArrowDown":
				y += speed;
				break;
			case "ArrowLeft":
				x -= speed;
				break;
			case "ArrowRight":
				x += speed;
				break;
		}

		// Limites da tela
		x = Math.max(0, Math.min(x, 370));
		y = Math.max(0, Math.min(y, 370));
	}

	onMount(() => {
		window.addEventListener("keydown", move);

		return () => {
			window.removeEventListener("keydown", move);
		};
	});
</script>

<div class="game-screen">
	<div
		class="player"
		style="left: {x}px; top: {y}px;"
	></div>
</div>

<style>
	.game-screen {
		width: 400px;
		height: 400px;
		background: black;
		border: 2px solid white;
		position: relative;
		margin: 50px auto;
	}

	.player {
		width: 30px;
		height: 30px;
		background: white;
		position: absolute;
	}
</style>