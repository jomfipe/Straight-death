<script lang="ts">
	import { onMount } from 'svelte';
	import { playerConfig } from '$lib/entities/player';

	type Direction = 'front' | 'back' | 'left' | 'right';

	let x = playerConfig.x;
	let y = playerConfig.y;
	const speed = playerConfig.speed;
	const sprites = playerConfig.sprites;
	let direction: Direction = 'back';

	function move(event: KeyboardEvent): void {
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

		x = Math.max(20, Math.min(880, nextX));
		y = Math.max(20, Math.min(880, nextY));
	}

	onMount(() => {
		window.addEventListener('keydown', move);
		return () => window.removeEventListener('keydown', move);
	});
</script>

<div class="game-screen">
	<img
		src="/images/Sprites/png/map/corredor.png"
		alt="corredor"
		class="corridor"
	/>

	<img
		src={sprites[direction]}
		alt="protagonista"
		class="player"
		style="left: {x}px; top: {y}px;"
	/>
</div>
