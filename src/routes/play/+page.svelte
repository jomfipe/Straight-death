<script lang="ts">
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { playerConfig } from '$lib/entities/player';
	import { chest } from '$lib/entities/chest';
	import { npc } from '$lib/entities/npc';
	import { browser } from '$app/environment';
	import { areasPermitidas } from '$lib/maps/mausoleum';
	import { podeAndar, colidiuComObjeto } from '$lib/systems/collision';
	import { t } from '$lib/translator/il8n';
	import { mausoleumState, resetMausoleumState, updateMausoleumState } from '$lib/stores/mausoleum';
	import { updateCorridorState } from '$lib/stores/corridor';
	import { resetGameState } from '$lib/utils/resetGame';

	let x: number = playerConfig.x;
	let y: number = playerConfig.y;

	const speed: number = playerConfig.speed;
	const sprites = playerConfig.sprites;

	const ChestX: number = chest.x;
	const ChestY: number = chest.y;
	const ChestAbertoSprite: string = chest.spriteOpen;
	let ChestSprite: string = chest.spriteClosed;
	let ChestOpen: boolean = false;
	let mostrarEspada: boolean = false;

	const npcX: number = npc.x;
	const npcY: number = npc.y;
	const npcSprite: string = npc.sprite;
	let mostrarDialogoNpc: boolean = false;
	let npcVisivel: boolean = true;

	type Direction = 'front' | 'back' | 'left' | 'right';
	let direction: Direction = 'back';

	let state = $mausoleumState;

	function applyState(nextState: typeof state) {
		x = nextState.x;
		y = nextState.y;
		direction = nextState.direction;
		ChestOpen = nextState.chestOpen;
		ChestSprite = nextState.chestSprite;
		npcVisivel = nextState.npcVisible;
		mostrarDialogoNpc = nextState.dialogVisible;
	}

	applyState(state);

	const unsubscribe = mausoleumState.subscribe(nextState => {
		state = nextState;
		applyState(nextState);
	});

	let obstaculos = [chest, npc];

	$: obstaculos = [chest, ...(npcVisivel ? [npc] : [])];

	function nearthechest(): boolean {
		return Math.abs(x - ChestX) < 80 && Math.abs(y - ChestY) < 80;
	}

	function nearNpc(): boolean {
		return npcVisivel && Math.abs(x - npcX) < 80 && Math.abs(y - npcY) < 80;
	}

	function isPortalArea(nx: number, ny: number): boolean {
		return nx >= 548 && nx <= 640 && ny >= 185 && ny <= 200;
	}

	function handleKey(event: KeyboardEvent): void {
	if (event.key === 'Escape') {
		resetGameState();
		goto('/menu');
		return;
	}

	const tecla = event.key.toLowerCase();
	const interagir = tecla === 'e';

	if (interagir && mostrarEspada) {
		fecharEspada();
		return;
	}


		if (event.key.toLowerCase() === 'e' && isPortalArea(x, y)) {
			updateCorridorState({ playerX: 140, playerY: 517 });
			goto('/play/corredor');
			return;
		}

		if (event.key.toLowerCase() === 'e' && mostrarDialogoNpc) {
			updateMausoleumState({ dialogVisible: false });
			return;
		}

		if (interagir && nearthechest() && !ChestOpen) {
			updateMausoleumState({
				chestOpen: true,
				chestSprite: ChestAbertoSprite,
				npcVisible: false,
				dialogVisible: false
		});
		mostrarEspada = true; // só acontece aqui, uma vez, na transição
		return;
}	

		if (event.key.toLowerCase() === 'e' && nearNpc()) {
			updateMausoleumState({ dialogVisible: true });
		}
	}

	function move(event: KeyboardEvent): void {
		let newX:number = x;
		let newY:number = y;

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
			updateMausoleumState({ x: newX, y: newY, direction });

			if (isPortalArea(newX, newY)) {
				updateCorridorState({ playerX: 140, playerY: 517 });
				goto('/play/corredor');
			}
		}

	}

	function fecharEspada(): void {
		mostrarEspada = false;
	}

	onMount(() => {
		if (browser) {
			window.addEventListener('keydown', move);
		}
	});

	onDestroy(() => {
		unsubscribe();
		if (browser) {
			window.removeEventListener('keydown', move);
		}
	});
</script>

<svelte:window on:keydown={handleKey} />


<div class="game-screen">
	<img
		src="/images/Sprites/png/map/mausoleum.png"
		alt="mausoleum"
		class="mausoleum"
	/>

<div class="tutorial">
	<div class="control-group">
		<div class="keyboard">
			<div class="row row-top">
				<span class="key2">W</span>
			</div>
			<div class="row row-bottom">
				<span class="key2">A</span>
				<span class="key2">S</span>
				<span class="key2">D</span>
			</div>
		</div>
		<span class="control-label">{$t("tutorial.wasd")}</span>
	</div>

	<div class="control-group">
		<span class="key2 key-action">E</span>
		<span class="control-label">{$t("tutorial.interact")}</span>
	</div>
</div>

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

	{#if npcVisivel}
		<img
			src={npcSprite}
			alt="NPC"
			class="npc"
			style="left: {npcX}px; top: {npcY}px;"
		/>
	{/if}

</div>

{#if mostrarDialogoNpc}
	<div class="dialogo">
		<p>{$t("npc.dialog")}</p>

		<button on:click={() => updateMausoleumState({ dialogVisible: false })}>
            {$t("npc.close")}
		</button>
	</div>
{/if}

{#if mostrarEspada}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="espada-overlay" on:click={fecharEspada}>
		<div class="espada-reveal">
			<div class="espada-glow"></div>
			<img
				src="/images/items/sword.png"
				alt="Espada Amaldiçoada"
				class="espada-sprite"
			/>
			<p class="espada-titulo">Você encontrou:</p>
			<h2 class="espada-nome">Espada Amaldiçoada</h2>
			<p class="espada-flavor">
				Uma lâmina sedenta por sangue, forjada nas trevas deste mausoléu.
				Ela sussurra promessas de poder... e de batalhas que virão.
			</p>
			<p class="espada-hint">Pressione E para continuar</p>
		</div>
	</div>
{/if}