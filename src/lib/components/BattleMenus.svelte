<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { estadoBatalha, executarAcao, type AcaoBatalha } from '$lib/entities/battle';
	import { t } from '$lib/translator/il8n';

	const dispatch = createEventDispatcher<{ fim: { vencedor: 'jogador' | 'inimigo' | null } }>();

	type TelaBatalha = 'acoes' | 'ataques' | 'itens' | 'estatisticas';

	// Prop para a imagem de fundo
	export let fundoUrl: string | undefined = '/images/Sprites/png/map/batalha.png';

	let tValue: any = {};
	$: tValue = $t;

	let acoes: { id: AcaoBatalha; label: string }[] = [];
	let ataques: { id: AcaoBatalha; label: string; desbloqueado: boolean }[] = [];

	$: {
		acoes = [
			{ id: 'ataque', label: tValue('battle.attack') },
			{ id: 'item', label: tValue('battle.item') },
			{ id: 'estatisticas', label: tValue('battle.stats') },
			{ id: 'fugir', label: tValue('battle.flee') }
		];

		ataques = [
			{ id: 'golpe-de-espada', label: tValue('battle.sword_strike'), desbloqueado: true },
			{ id: 'punho-magico', label: 'Punho Mágico', desbloqueado: ($estadoBatalha?.jogador?.habilidades?.punhoMagico) ?? false },
			{ id: 'ataque-3' as any, label: 'X', desbloqueado: false },
			{ id: 'ataque-4' as any, label: 'X', desbloqueado: false }
		];
	}

	let tela: TelaBatalha = 'acoes';
	let selecionado = 0;
	let selecionadoAtaque = 0;

	function pctHp(hp: number, hpMax: number): number {
		return Math.max(0, Math.min(100, Math.round((hp / hpMax) * 100)));
	}

	function corHp(hp: number, hpMax: number): string {
		const p = pctHp(hp, hpMax);
		if (p > 50) return 'var(--hp-alta)';
		if (p > 20) return 'var(--hp-media)';
		return 'var(--hp-baixa)';
	}

	function mover(delta: number) {
		if (tela === 'acoes') {
			selecionado = (selecionado + delta + acoes.length) % acoes.length;
		} else if (tela === 'ataques') {
			selecionadoAtaque = (selecionadoAtaque + delta + ataques.length) % ataques.length;
		}
	}

	function confirmar() {
		const s = $estadoBatalha;
		if (!s || s.turno !== 'jogador') return;

		if (tela === 'acoes') {
			const acao = acoes[selecionado];
			if (acao.id === 'ataque') {
				tela = 'ataques';
				selecionadoAtaque = 0;
				return;
			}
			if (acao.id === 'item') {
				tela = 'itens';
				return;
			}
			if (acao.id === 'estatisticas') {
				tela = 'estatisticas';
				return;
			}
			executarAcao(acao.id);
			return;
		}

		if (tela === 'ataques') {
			const ataque = ataques[selecionadoAtaque];
			if (!ataque.desbloqueado) return;
			
			// Executa o ID específico (punho-magico ou golpe-de-espada)
			executarAcao(ataque.id);
			tela = 'acoes';
			selecionado = 0;
			return;
		}

		if (tela === 'itens') {
			executarAcao('item');
			tela = 'acoes';
			return;
		}

		if (tela === 'estatisticas') {
			tela = 'acoes';
		}
	}

	function teclado(event: KeyboardEvent) {
		const s = $estadoBatalha;
		if (!s || s.turno !== 'jogador') return;

		switch (event.key.toLowerCase()) {
			case 'arrowleft': case 'a': mover(-1); break;
			case 'arrowright': case 'd': mover(1); break;
			case 'arrowup': case 'w':
				if (tela === 'ataques') selecionadoAtaque = (selecionadoAtaque - 2 + ataques.length) % ataques.length;
				else selecionado = (selecionado - 2 + acoes.length) % acoes.length;
				break;
			case 'arrowdown': case 's':
				if (tela === 'ataques') selecionadoAtaque = (selecionadoAtaque + 2) % ataques.length;
				else selecionado = (selecionado + 2) % acoes.length;
				break;
			case 'enter': case ' ':
				event.preventDefault();
				confirmar();
				break;
			case 'escape':
				tela = 'acoes';
				selecionado = 0;
				break;
		}
	}

	onMount(() => window.addEventListener('keydown', teclado));
	onDestroy(() => window.removeEventListener('keydown', teclado));

	$: if ($estadoBatalha?.turno === 'fim') {
		dispatch('fim', { vencedor: $estadoBatalha.vencedor });
	}

	$: numeroTurno = ($estadoBatalha as any)?.numeroTurno as number | undefined;
</script>

{#if $estadoBatalha}
	{@const s = $estadoBatalha}
	<div class="arena" style={fundoUrl ? `--fundo-batalha: url(${fundoUrl})` : ''}>
		<div class="camada-fundo" />

		{#if numeroTurno}
			<div class="turno-badge">Turn {numeroTurno}</div>
		{/if}

		<!-- INIMIGO -->
		<div class="combatente inimigo">
			<div class="placa placa-inimigo">
				<span class="nome">{s.inimigo.nome}</span>
				<div class="hp-linha">
					<div class="hp-fundo">
						<div
							class="hp-barra"
							style="width: {pctHp(s.inimigo.hp, s.inimigo.hpMax)}%; background: {corHp(s.inimigo.hp, s.inimigo.hpMax)}"
						/>
					</div>
					<span class="hp-numero">{pctHp(s.inimigo.hp, s.inimigo.hpMax)}%</span>
				</div>
			</div>
			<div class="sprite-wrap">
				<img src={s.inimigo.sprite} alt={s.inimigo.nome} class="sprite" />
			</div>
		</div>

		<!-- JOGADOR -->
		<div class="combatente jogador">
			<div class="sprite-wrap">
				<img src={s.jogador.sprite} alt={s.jogador.nome} class="sprite" />
			</div>
			<div class="placa placa-jogador">
				<span class="nome">{s.jogador.nome}</span>
				<div class="hp-linha">
					<div class="hp-fundo">
						<div
							class="hp-barra"
							style="width: {pctHp(s.jogador.hp, s.jogador.hpMax)}%; background: {corHp(s.jogador.hp, s.jogador.hpMax)}"
						/>
					</div>
					<span class="hp-numero">{pctHp(s.jogador.hp, s.jogador.hpMax)}%</span>
				</div>
			</div>
		</div>

		<!-- UI INFERIOR -->
		<div class="caixa-inferior">
			<div class="log">
				{#each s.log as linha}
					<p>{linha}</p>
				{/each}
			</div>

			<div class="menu-acoes" class:desabilitado={s.turno !== 'jogador'}>
				{#if tela === 'acoes'}
					{#each acoes as acao, i}
							<button class="acao" class:ativo={i === selecionado} on:click={() => { selecionado = i; confirmar(); }}>
								<span class="cursor">{i === selecionado ? '▶' : ''}</span>
								{acao.label}
							</button>
						{/each}
				{:else if tela === 'ataques'}
						{#each ataques as ataque, i}
							<button class="acao" class:ativo={i === selecionadoAtaque} class:bloqueado={!ataque.desbloqueado} on:click={() => { selecionadoAtaque = i; confirmar(); }}>
								<span class="cursor">{i === selecionadoAtaque ? '▶' : ''}</span>
								{ataque.label}
							</button>
						{/each}
				{:else if tela === 'itens'}
					<button class="acao ativo" on:click={confirmar}>
						<span class="cursor">▶</span>
						Poção ({s.jogador.itens?.pocao ?? 0})
					</button>
				{:else}
					<div class="painel-stats">
						<p><strong>{s.jogador.nome}</strong></p>
						<p>HP: {s.jogador.hp}/{s.jogador.hpMax} | Dano: {s.jogador.ataque}</p>
						<p><strong>{s.inimigo.nome}</strong></p>
						<p>HP: {s.inimigo.hp}/{s.inimigo.hpMax} | Dano: {s.inimigo.ataqueMin}-{s.inimigo.ataqueMax}</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.arena {
		--hp-alta: #6ecb63;
		--hp-media: #e8c547;
		--hp-baixa: #d9534f;
		--tinta: #1f1a17;
		--pergaminho: #f4ecd8;
		--borda: #3a2f28;
		--acento: #7a3b2e;
		--dg-tinta: #120a16;
		--dg-roxo-escuro: #1c1024;
		--dg-roxo: #2c1938;
		--dg-roxo-claro: #4a2c5e;
		--dg-dourado: #d9ab52;
		--dg-dourado-claro: #f0cf8a;
		--dg-brilho: #b062e8;
		--dg-texto: #f4ecd8;
		--fundo-batalha: none;

		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		font-family: 'Courier New', monospace;
		image-rendering: pixelated;
		color: var(--tinta);
	}

	.camada-fundo {
		position: absolute;
		inset: 0;
		z-index: 0;
		background: var(--fundo-batalha) lightgray -653.948px -950.553px / 158.758% 188.158% no-repeat;
	}

	.turno-badge {
		position: absolute;
		top: 14px; left: 14px;
		z-index: 5;
		background: rgba(28, 16, 36, 0.75);
		border: 1px solid var(--dg-dourado);
		border-radius: 8px;
		padding: 4px 14px;
		font-weight: bold;
		font-size: 14px;
		color: var(--dg-dourado-claro);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
	}

	.combatente {
		position: absolute;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}

	.combatente.inimigo {
		bottom: 44%;
		right: 16%;
		align-items: flex-end;
		transform: translateY(8%);
	}
	.combatente.jogador {
		bottom: 44%;
		left: 14%;
		align-items: flex-start;
		transform: translateY(8%);
	}

	.sprite-wrap { position: relative; display: inline-flex; }
	.sprite-wrap::before {
		content: '';
		position: absolute;
		left: 50%; bottom: 8%;
		transform: translate(-50%, 25%);
		width: 85%; height: 55%;
		background: radial-gradient(ellipse at center, rgba(214, 160, 255, 0.65) 0%, rgba(214, 160, 255, 0) 72%);
		filter: blur(4px);
		z-index: -1;
	}

	.sprite {
		width: clamp(96px, 11vw, 190px);
		height: clamp(96px, 11vw, 190px);
		object-fit: contain;
		image-rendering: pixelated;
		filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.4)) drop-shadow(0 10px 10px rgba(0, 0, 0, 0.55));
	}

	.placa {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 190px;
		background: rgba(15, 10, 15, 0.6);
		border: 1px solid rgba(217, 171, 82, 0.5);
		border-radius: 6px;
		padding: 5px 10px;
		backdrop-filter: blur(2px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
	}

	.placa-inimigo { align-items: flex-end; }
	.placa-jogador { align-items: flex-start; }
	.nome { font-size: 15px; font-weight: bold; color: #f4ecd8; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.9); }
	.hp-linha { display: flex; align-items: center; gap: 6px; }
	.hp-fundo { width: 150px; height: 9px; background: #4a4a4a; border: 1px solid #2a2a2a; border-radius: 2px; overflow: hidden; }
	.hp-barra { height: 100%; transition: width 0.35s ease-out; }
	.hp-numero { font-size: 12px; font-weight: bold; color: #f4ecd8; }

	.caixa-inferior {
		position: absolute;
		z-index: 5;
		bottom: 0; left: 0; right: 0;
		height: 32%;
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 16px;
		background: linear-gradient(180deg, var(--dg-roxo) 0%, var(--dg-roxo-escuro) 55%, var(--dg-tinta) 100%);
		border-top: 3px solid var(--dg-dourado);
		padding: 14px 18px;
		box-sizing: border-box;
	}

	.log {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		background: rgba(0, 0, 0, 0.28);
		border: 1px solid rgba(217, 171, 82, 0.35);
		border-radius: 6px;
		padding: 10px 14px;
	}

	.log p { margin: 2px 0; font-size: 13px; color: rgba(244, 236, 216, 0.75); }
	.log p:last-child { font-weight: bold; color: var(--dg-dourado-claro); }

	.menu-acoes {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 10px;
		border-left: 2px solid rgba(217, 171, 82, 0.35);
		padding-left: 16px;
	}

	.acao {
		background: linear-gradient(180deg, rgba(74, 44, 94, 0.55) 0%, rgba(28, 16, 36, 0.75) 100%);
		border: 1px solid rgba(217, 171, 82, 0.45);
		border-radius: 6px;
		padding: 10px 14px;
		font-family: inherit;
		font-size: 13px;
		font-weight: bold;
		color: var(--dg-texto);
		cursor: pointer;
		text-align: left;
	}

	.acao.ativo {
		background: linear-gradient(180deg, rgba(176, 98, 232, 0.4) 0%, rgba(74, 44, 94, 0.65) 100%);
		border-color: var(--dg-dourado);
		color: var(--dg-dourado-claro);
	}

	.acao.bloqueado { opacity: 0.4; cursor: not-allowed; }
	.cursor { display: inline-block; min-width: 14px; color: var(--dg-dourado); }

	.painel-stats {
		background: linear-gradient(180deg, rgba(74, 44, 94, 0.5) 0%, rgba(28, 16, 36, 0.7) 100%);
		border-radius: 6px;
		padding: 10px 14px;
		font-size: 12px;
		color: var(--dg-texto);
	}

	.menu-acoes.desabilitado { opacity: 0.5; pointer-events: none; }
</style>