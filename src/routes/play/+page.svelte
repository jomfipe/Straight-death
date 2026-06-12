<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { playerConfig } from '$lib/entities/player';
	import { chest } from '$lib/entities/chest';
	import { npc } from '$lib/entities/npc';
	import { areasPermitidas } from '$lib/maps/mausoleum';
	import { podeAndar, colidiuComObjeto } from '$lib/systems/collision';

	let x: number = playerConfig.x;
	let y: number = playerConfig.y;

	const speed: number = playerConfig.speed;
	const sprites = playerConfig.sprites;

	const ChestX: number = chest.x;
	const ChestY: number = chest.y;
	const ChestFechadoSprite: string = chest.spriteClosed;
	const ChestAbertoSprite: string = chest.spriteOpen;
	let ChestSprite: string = chest.spriteClosed;
	let ChestOpen: boolean = false;

	const npcX: number = npc.x;
	const npcY: number = npc.y;
	const npcSprite: string = npc.sprite;
	let mostrarDialogoNpc: boolean = false;

	type Direction = 'front' | 'back' | 'left' | 'right';
	let direction: Direction = 'back';

	const obstaculos = [chest, npc];

	function nearthechest(): boolean {
		return Math.abs(x - ChestX) < 80 && Math.abs(y - ChestY) < 80;
	}

	function nearNpc(): boolean {
		return Math.abs(x - npcX) < 80 && Math.abs(y - npcY) < 80;
	}

	function handleKey(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			goto('/');
		}

		if (event.key.toLowerCase() === 'x' && nearthechest() && !ChestOpen) {
			ChestOpen = true;
			ChestSprite = ChestAbertoSprite;
		}

		if (event.key.toLowerCase() === 'x' && nearNpc()) {
			mostrarDialogoNpc = true;
		}
	}

	function move(event: KeyboardEvent): void {
		let newX = x;
		let newY = y;

		switch (event.key.toLowerCase()) {
			case 'arrowup':
			case 'w':
				newY -= speed;
				direction = 'back';
				break;

			case 'arrowdown':
			case 's':
				newY += speed;
				direction = 'front';
				break;

			case 'arrowleft':
			case 'a':
				newX -= speed;
				direction = 'left';
				break;

			case 'arrowright':
			case 'd':
				newX += speed;
				direction = 'right';
				break;

			default:
				return;
		}

		const bloqueado =
			!podeAndar(newX, newY, areasPermitidas) ||
			obstaculos.some(obj => colidiuComObjeto(newX, newY, obj));

		if (!bloqueado) {
			x = newX;
			y = newY;
		}

		if (!nearthechest() && ChestOpen) {
			ChestOpen = false;
			ChestSprite = ChestFechadoSprite;
		}
	}

	onMount(() => {
		window.addEventListener('keydown', move);
		return () => window.removeEventListener('keydown', move);
	});
</script>

<svelte:window on:keydown={handleKey} />

<div class="game-screen">
	<img
		src="/images/Sprites/png/map/mausoleum.png"
		alt="mausoleum"
		class="mausoleum"
	/>

	<img
		src={sprites[direction]}
		alt="player"
		class="player"
		style="left: {x}px; top: {y}px;"
	/>

	<img
		src={ChestSprite}
		alt="Chest"
		class="chest"
		style="left: {ChestX}px; top: {ChestY}px;"
	/>

	<img
		src={npcSprite}
		alt="NPC"
		class="npc"
		style="left: {npcX}px; top: {npcY}px;"
	/>

	<div class="debug">
		X: {x}<br />
		Y: {y}<br />
	</div>
</div>

{#if mostrarDialogoNpc}
	<div class="dialogo">
		<p>Olá viajante! O portal está selado. Para prosseguir, pegue o amuleto que está dentro do baú. Você precisará dele para enfrentar os desafios que estão por vir. Boa sorte!</p>

		<button on:click={() => (mostrarDialogoNpc = false)}>
			Fechar
		</button>
	</div>
{/if}