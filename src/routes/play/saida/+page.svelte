<script lang="ts">
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { playerConfig } from '$lib/entities/player';
	import { chest } from '$lib/entities/chest';
	import { podeAndar, colidiuComObjeto } from '$lib/systems/collision';
	import { areasPermitidas } from '$lib/maps/saidaMausoleum';
	import { resetGameState } from '$lib/utils/resetGame';
	import { saidaMausoleumState, updateSaidaMausoleumState } from '$lib/stores/saidaMausoleum';

	type Direction = 'front' | 'back' | 'left' | 'right';

	const chestX = 696;
	const chestY = 144;
	const chestSpriteClosed = chest.spriteClosed;
	const chestSpriteOpen = chest.spriteOpen;
	const storageKey = 'saida-mausoleum-chest';
	const enemyDefeatedStorageKey = 'saida-mausoleum-enemy-defeated';
	const playerStateStorageKey = 'saida-mausoleum-player-state';
	const gameStateStorageKey = 'saida-mausoleum-state';
	let chestSprite = chestSpriteClosed;
	let chestOpen = false;
	let mostrarPunhoMagico: boolean = false;
	let enemyDefeated = false;
	let hasLoadedState = false;
	let unsubscribe: (() => void) | null = null;

	const npcSprite = "/images/Sprites/png/npcs/secondEnemy/secondEnemy.png";
	let enemyX = 732;
	let enemyY = 756;
	const npcHitbox = {
		offsetX: 8,
		offsetY: 12,
		width: 48,
		height: 52
	};

	let x = 96;
	let y = 432;
	const speed = playerConfig.speed;
	const sprites = playerConfig.sprites;
	let direction: Direction = 'back';

	function syncFromStore(): void {
		const state = $saidaMausoleumState;
		x = state.playerX;
		y = state.playerY;
		direction = state.direction;
		enemyDefeated = state.enemyDefeated;
		chestOpen = state.chestOpen;
		chestSprite = state.chestSprite ?? (chestOpen ? chestSpriteOpen : chestSpriteClosed);
	}

	function saveGameState(): void {
		if (typeof window === 'undefined') {
			return;
		}

		const state = {
			chestOpen,
			chestSprite,
			enemyDefeated,
			x,
			y,
			direction
		};

		window.localStorage.setItem(gameStateStorageKey, JSON.stringify(state));
		window.localStorage.setItem(storageKey, JSON.stringify({ chestOpen, chestSprite }));
		window.localStorage.setItem(enemyDefeatedStorageKey, JSON.stringify({ enemyDefeated }));
		window.localStorage.setItem(playerStateStorageKey, JSON.stringify({ x, y, direction }));
		updateSaidaMausoleumState({
			playerX: x,
			playerY: y,
			direction,
			enemyDefeated,
			chestOpen,
			chestSprite
		});
	}

	function saveChestState(): void {
		saveGameState();
	}

	function fecharPunhoMagico(): void {
		mostrarPunhoMagico = false;
	}

	function saveEnemyState(): void {
		saveGameState();
	}

	function savePlayerState(): void {
		saveGameState();
	}

	function syncEnemyState(): void {
		if (typeof window === 'undefined') {
			return;
		}

		const savedEnemyState = window.localStorage.getItem(enemyDefeatedStorageKey);
		if (!savedEnemyState) {
			enemyDefeated = false;
			enemyX = 732;
			enemyY = 756;
			return;
		}

		try {
			const parsed = JSON.parse(savedEnemyState) as { enemyDefeated?: boolean };
			enemyDefeated = parsed.enemyDefeated === true;
			if (enemyDefeated) {
				enemyX = 2000;
				enemyY = 2000;
			} else {
				enemyX = 732;
				enemyY = 756;
			}
		} catch {
			enemyDefeated = false;
			enemyX = 732;
			enemyY = 756;
		}
	}

	function loadPlayerState(): void {
		if (typeof window === 'undefined') {
			return;
		}

		const savedPlayerState = window.localStorage.getItem(playerStateStorageKey);
		if (!savedPlayerState) {
			return;
		}

		try {
			const parsed = JSON.parse(savedPlayerState) as { x?: number; y?: number; direction?: Direction };
			if (typeof parsed.x === 'number') {
				x = parsed.x;
			}
			if (typeof parsed.y === 'number') {
				y = parsed.y;
			}
			if (parsed.direction && ['front', 'back', 'left', 'right'].includes(parsed.direction)) {
				direction = parsed.direction;
			}
		} catch {
			// Ignora estados inválidos
		}
	}

	function loadChestState(): void {
		if (typeof window === 'undefined') {
			return;
		}

		const savedGameState = window.localStorage.getItem(gameStateStorageKey);
		let parsedGameState: {
			chestOpen?: boolean;
			chestSprite?: string;
			enemyDefeated?: boolean;
			x?: number;
			y?: number;
			direction?: Direction;
		} | null = null;

		if (savedGameState) {
			try {
				parsedGameState = JSON.parse(savedGameState) as {
					chestOpen?: boolean;
					chestSprite?: string;
					enemyDefeated?: boolean;
					x?: number;
					y?: number;
					direction?: Direction;
				};
			} catch {
				parsedGameState = null;
			}
		}

		if (parsedGameState) {
			chestOpen = parsedGameState.chestOpen === true;
			chestSprite = parsedGameState.chestSprite ?? (chestOpen ? chestSpriteOpen : chestSpriteClosed);
			enemyDefeated = parsedGameState.enemyDefeated === true;
			if (typeof parsedGameState.x === 'number') {
				x = parsedGameState.x;
			}
			if (typeof parsedGameState.y === 'number') {
				y = parsedGameState.y;
			}
			if (parsedGameState.direction && ['front', 'back', 'left', 'right'].includes(parsedGameState.direction)) {
				direction = parsedGameState.direction;
			}
		} else {
			const savedState = window.localStorage.getItem(storageKey);
			if (savedState) {
				try {
					const parsed = JSON.parse(savedState) as { chestOpen?: boolean; chestSprite?: string };
					if (parsed.chestOpen) {
						chestOpen = true;
						chestSprite = parsed.chestSprite ?? chestSpriteOpen;
					}
				} catch {
					// Ignora estados inválidos
				}
			}

			loadPlayerState();
		}

		const savedEnemyState = window.localStorage.getItem(enemyDefeatedStorageKey);
		if (savedEnemyState) {
			try {
				const parsed = JSON.parse(savedEnemyState) as { enemyDefeated?: boolean };
				enemyDefeated = parsed.enemyDefeated === true;
			} catch {
				// Ignora estados inválidos
			}
		}

		if (enemyDefeated) {
			enemyX = 2000;
			enemyY = 2000;
		} else {
			enemyX = 732;
			enemyY = 756;
		}

		hasLoadedState = true;
	}

	function handleEnemyDefeated(): void {
		enemyDefeated = true;
		enemyX = 2000;
		enemyY = 2000;
		saveEnemyState();
	}

	function nearChest(): boolean {
		return Math.abs(x - chestX) < 80 && Math.abs(y - chestY) < 80;
	}

	function shouldReturnToCorridor(nextX: number, nextY: number): boolean {
		return x === 96 && y >= 432 && y <= 468 && nextX < x;
	}

	function isTunnelEntry(nx: number, ny: number): boolean {
		return nx >= 720 && nx <= 732 && ny >= 768 && ny <= 768;
	}

	function move(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			resetGameState();
			goto('/menu');
			return;
		}

		if (event.key === 'e' && mostrarPunhoMagico) {
			fecharPunhoMagico();
			return;
		}

		if (event.key.toLowerCase() === 'e' && nearChest() && !chestOpen) {
			chestOpen = true;
			chestSprite = chestSpriteOpen;
			mostrarPunhoMagico = true;
			saveChestState();
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

		if (shouldReturnToCorridor(nextX, nextY)) {
			goto('/play/corredor');
			return;
		}

		if (isTunnelEntry(nextX, nextY)) {
			goto('/play/tunel');
			return;
		}

		const colidiuNpc = !enemyDefeated && colidiuComObjeto(nextX, nextY, {
			x: enemyX,
			y: enemyY,
			hitbox: npcHitbox
		});

		if (colidiuNpc) {
			goto('/battle?tipo=saida-mausoleum');
			return;
		}

		if (podeAndar(nextX, nextY, areasPermitidas)) {
			x = nextX;
			y = nextY;
			savePlayerState();
		}
	}

	onMount(() => {
		loadChestState();
		unsubscribe = saidaMausoleumState.subscribe(() => {
			syncFromStore();
		});
		window.addEventListener('keydown', move);
		window.addEventListener('saida-mausoleum-enemy-defeated', handleEnemyDefeated);
		window.addEventListener('storage', syncEnemyState);
		window.addEventListener('focus', syncEnemyState);
	});

	$: if (typeof window !== 'undefined' && hasLoadedState) {
		saveEnemyState();
	}

	$: if (typeof window !== 'undefined' && hasLoadedState) {
		savePlayerState();
	}

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
		window.removeEventListener('keydown', move);
		window.removeEventListener('saida-mausoleum-enemy-defeated', handleEnemyDefeated);
		window.removeEventListener('storage', syncEnemyState);
		window.removeEventListener('focus', syncEnemyState);
	});
</script>

<div class="game-screen">
	<img
		src="/images/Sprites/png/map/saidaMausoleum.png"
		alt="saida do mausoleum"
		class="saida-mausoleum"
	/>

	<img src="/images/Sprites/png/map/saidaMausoleum.png" alt="mapa" class="saida-mausoleum" />

	<img src={chestSprite} alt="Chest" class="chest" style="left: {chestX}px; top: {chestY}px;" />


	{#if !enemyDefeated}
		<img
			src={npcSprite}
			alt="NPC"
			class="npc"
			style="left: {enemyX}px; top: {enemyY}px;"
		/>
	{/if}

	<img
		src={sprites[direction]}
		alt="player"
		class="player"
		style="left: {x}px; top: {y}px;"
	/>

	
</div>

{#if mostrarPunhoMagico}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="item-overlay" on:click={fecharPunhoMagico}>
		<div class="item-reveal">
			<div class="item-glow"></div>

			<img
				src="/images/items/magicpunish.png"
				alt="Punho Mágico"
				class="item-sprite"
			/>

			<p class="item-title">Você encontrou:</p>

			<h2 class="item-name">Punho Mágico</h2>

			<p class="item-description">
				Um antigo artefato envolto em energia arcana. Ao equipá-lo,
				seus golpes passam a canalizar magia pura, aumentando
				significativamente seu poder em combate.
			</p>

			<p class="item-hint">
				Pressione E para continuar
			</p>
		</div>
	</div>
{/if}