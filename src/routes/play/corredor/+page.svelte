<script lang="ts">
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { playerConfig } from '$lib/entities/player';
	import { firstEnemy } from '$lib/entities/firstEnemy';
	import { podeAndar, colidiuComObjeto } from '$lib/systems/collision';
	import { areasPermitidas } from '$lib/maps/corredor1';
	import { corridorState, updateCorridorState } from '$lib/stores/corridor';
	import { resetGameState } from '$lib/utils/resetGame';

	type Direction = 'front' | 'back' | 'left' | 'right';

	let x = 152;
	let y = 601;
	let enemyDefeated = false;
	const speed = playerConfig.speed;
	const sprites = playerConfig.sprites;
	const enemyX: number = firstEnemy.x;
	const enemyY: number = firstEnemy.y;
	const enemySprite: string = firstEnemy.sprite;
	let direction: Direction = 'back';

	const unsubscribe = corridorState.subscribe(state => {
		x = state.playerX;
		y = state.playerY;
		enemyDefeated = state.enemyDefeated;
	});

	function isExitArea(nx: number, ny: number): boolean {
		return nx === 776 && ny >= 481 && ny <= 505;
	}

	function isTunnelEntry(nx: number, ny: number): boolean {
		return nx >= 696 && nx <= 768 && ny >= 768 && ny <= 768;
	}

	function move(event: KeyboardEvent): void {
		let nextX = x;
		let nextY = y;

		switch (event.key.toLowerCase()) {
			case 'arrowup':
			case 'w':
				if (x === 152 && y === 505) {
					resetGameState();
					goto('/menu');
					return;
				}
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

		const colidiu = !enemyDefeated && colidiuComObjeto(nextX, nextY, firstEnemy);

		if (colidiu) {
			goto('/battle');
			return;
		}

		if (isExitArea(nextX, nextY)) {
			goto('/play/saida');
			return;
		}

		if (isTunnelEntry(nextX, nextY)) {
			goto('/play/tunel');
			return;
		}

		if (podeAndar(nextX, nextY, areasPermitidas)) {
			x = nextX;
			y = nextY;
			updateCorridorState({ playerX: x, playerY: y });
		}
	}

	onMount(() => {
		window.addEventListener('keydown', move);
	});

	onDestroy(() => {
		unsubscribe();
		window.removeEventListener('keydown', move);
	});
</script>

<div class="game-screen">
	<img
		src="/images/Sprites/png/map/corredor.png"
		alt="corredor"
		class="corredor"
	/>

	{#if !enemyDefeated}
		<img
			src={enemySprite}
			alt="firstEnemy"
			class="first-enemy"
			style="left: {enemyX}px; top: {enemyY}px;"
		/>
	{/if}

	<img
		src={sprites[direction]}
		alt="protagonista"
		class="player"
		style="left: {x}px; top: {y}px;"
	/>

	<div class="debug">
		X: {x}<br />
		Y: {y}<br />
		Entrada túnel: X 696-768 | Y 768<br />
	</div>
</div>
