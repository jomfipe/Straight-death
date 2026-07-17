<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import BattleMenu from '$lib/components/BattleMenus.svelte';
	import DialogWindow from '$lib/components/DialogWindow.svelte';
	import { criarEstadoBatalha, estadoBatalha, type Combatente, type TipoBatalha } from '$lib/entities/battle';
	import { updateCorridorState } from '$lib/stores/corridor';
	import { get } from 'svelte/store';
	import { playerConfig } from '$lib/entities/player';
	import { firstEnemy } from '$lib/entities/firstEnemy';
	import { t } from '$lib/translator/il8n';

	let showDialogue = true;
	let dialogueLines: any[] = [];
	let tValue: any = {};
	let tipoBatalha: TipoBatalha = 'corredor';

	$: tValue = $t;
	$: tipoBatalha = $page.url.searchParams.get('tipo') === 'saida-mausoleum' ? 'saida-mausoleum' : 'corredor';
	$: dialogueLines = tipoBatalha === 'saida-mausoleum'
		? [
			{ speaker: 'Paladin', text: 'Você chegou longe, mas este é o fim do seu caminho.', portrait: '/images/Sprites/png/npcs/secondEnemy/npcinimigodialogo.png' },
			{ speaker: 'Sean', text: 'Eu não vou recuar!', portrait: '/images/Sprites/png/npcs/protagonista/protagonista_frentePaDialogo.png' }
		]
		: [
			{ speaker: 'Archestry', text: tValue('battle.archestry_line1'), portrait: '/images/Sprites/png/npcs/firstEnemy/firstEnemy_frente.png' },
			{ speaker: 'Sean', text: tValue('battle.protagonist_line1'), portrait: '/images/Sprites/png/npcs/protagonista/protagonista_frentePaDialogo.png' },
			{ speaker: 'Archestry', text: tValue('battle.archestry_line2'), portrait: '/images/Sprites/png/npcs/firstEnemy/firstEnemy_frente.png' }
		];

	function isChestOpenInSaidaMausoleum(): boolean {
		if (typeof window === 'undefined') return false;

		try {
			const stored = window.localStorage.getItem('saida-mausoleum-chest');
			if (!stored) return false;
			const parsed = JSON.parse(stored) as { chestOpen?: boolean };
			return parsed.chestOpen === true;
		} catch {
			return false;
		}
	}

	function startBattle() {
		const jogador: Combatente = {
			nome: 'steve',
			sprite: playerConfig.sprites.front,
			hpMax: 100,
			hp: 100,
			ataque: 10,
			defesa: 2,
			evasao: 10,
			critico: 5,
			itens: { pocao: 3 },
			habilidades: {
				punhoMagico: tipoBatalha === 'saida-mausoleum' ? isChestOpenInSaidaMausoleum() : false
			}
		};

		const inimigo: Combatente = tipoBatalha === 'saida-mausoleum'
			? {
				nome: 'Paladin',
				sprite: '/images/Sprites/png/npcs/secondEnemy/npcinimigo.png',
				hpMax: 120,
				hp: 120,
				ataque: 12,
				defesa: 3,
				evasao: 20,
				critico: 20,
				ataqueMin: 8,
				ataqueMax: 15
			}
			: {
				nome: 'Archestry',
				sprite: firstEnemy.sprite,
				hpMax: 100,
				hp: 100,
				ataque: 10,
				defesa: 2,
				evasao: 20,
				critico: 10,
				ataqueMin: 8,
				ataqueMax: 15
			};

		estadoBatalha.set(criarEstadoBatalha(jogador, inimigo, tipoBatalha));
		showDialogue = false;
	}

	function markEnemyDefeated(): void {
		if (typeof window === 'undefined') return;

		const estadoAtual = get(estadoBatalha);
		const inimigoDerrotado = tipoBatalha === 'saida-mausoleum' && estadoAtual?.inimigo.hp !== undefined && estadoAtual.inimigo.hp <= 0;

		if (!inimigoDerrotado) return;

		const savedState = window.localStorage.getItem('saida-mausoleum-state');
		const parsedState = savedState ? JSON.parse(savedState) : {};
		const nextState = {
			...parsedState,
			enemyDefeated: true
		};

		window.localStorage.setItem('saida-mausoleum-enemy-defeated', JSON.stringify({ enemyDefeated: true }));
		window.localStorage.setItem('saida-mausoleum-state', JSON.stringify(nextState));
		window.dispatchEvent(new CustomEvent('saida-mausoleum-enemy-defeated'));
	}

	function aoFinalizar(event: CustomEvent<{ vencedor: 'jogador' | 'inimigo' | null }>) {
		const { vencedor } = event.detail;
		const destino = tipoBatalha === 'saida-mausoleum' ? '/play/saida' : '/play/corredor';

		if (vencedor === 'inimigo') {
			goto(destino);
			return;
		}

		if (vencedor === null) {
			goto(destino);
			return;
		}

		if (tipoBatalha === 'corredor') {
			updateCorridorState({ playerX: 716, playerY: 505, enemyDefeated: true });
		} else {
			markEnemyDefeated();
		}

		setTimeout(() => goto(destino), 1400);
	}
</script>

<div class="tela-batalha">
	{#if showDialogue}
		<DialogWindow lines={dialogueLines} on:done={startBattle} />
	{:else}
		<BattleMenu on:fim={aoFinalizar} />
	{/if}
</div>
