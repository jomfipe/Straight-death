<script lang="ts">
	export const ssr = false;

	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { playerConfig } from '$lib/entities/player';
	import { podeAndar } from '$lib/systems/collision';
	import { areasPermitidas } from '$lib/maps/tunel';
	import { resetGameState } from '$lib/utils/resetGame';
	
	type Direction = 'front' | 'back' | 'left' | 'right';

	let x = 480;
	let y = 348;
	let showEnding = false;
	const speed = playerConfig.speed;
	const sprites = playerConfig.sprites;
	let direction: Direction = 'back';

	function isEndingArea(nx: number, ny: number): boolean {
		return nx === 480 && ny === 684;
	}

	function move(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			resetGameState();
			goto('/menu');
			return;
		}

		let nextX = x;
		let nextY = y;

		switch (event.key.toLowerCase()) {
			case 'arrowup':
			case 'w':
				nextY -= speed;
				direction = 'back';
				break;
			case 'arrowdown':
			case 's':
				nextY += speed;
				direction = 'front';
				break;
			case 'arrowleft':
			case 'a':
				nextX -= speed;
				direction = 'left';
				break;
			case 'arrowright':
			case 'd':
				nextX += speed;
				direction = 'right';
				break;
			default:
				return;
		}

		if (isEndingArea(nextX, nextY)) {
			showEnding = true;
			return;
		}

		if (podeAndar(nextX, nextY, areasPermitidas)) {
			x = nextX;
			y = nextY;
		}
	}

	onMount(() => {
		window.addEventListener('keydown', move);
	});

	onDestroy(() => {
	if (typeof window !== 'undefined') {
		window.removeEventListener('keydown', move);
	}
});
</script>

{#if showEnding}
	<div class="ending-screen">
		<img
			src="/images/Sprites/png/map/encerramento.png?v=2"
			alt="encerramento"
			class="ending-image"
		/>
	</div>
{:else}
	<div class="game-screen">
		<img
			src="/images/Sprites/png/map/tunel.png"
			alt="túnel"
			class="tunel"
		/>

		<img
			src={sprites[direction]}
			alt="player"
			class="player"
			style="left: {x}px; top: {y}px;"
		/>

	</div>
{/if}
