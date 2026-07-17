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
	let selecionado : number = 0;
	let selecionadoAtaque : number = 0;

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
