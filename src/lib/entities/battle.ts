import { writable, get } from 'svelte/store';

// ---------- Tipos ----------

// 'punho-magico' e 'golpe-de-espada' agora são tipos de AcaoBatalha
export type AcaoBatalha = 'ataque' | 'punho-magico' | 'golpe-de-espada' | 'item' | 'estatisticas' | 'fugir';
export type TipoBatalha = 'corredor' | 'saida-mausoleum';

export interface Combatente {
	nome: string;
	sprite: string;
	hpMax: number;
	hp: number;
	ataque: number;
	defesa: number;
	evasao: number;
	critico: number;
	ataqueMin?: number;
	ataqueMax?: number;
	itens?: {
		pocao: number;
	};
	habilidades?: {
		punhoMagico?: boolean;
		recuoBloqueado?: boolean;
	};
}

export type Turno = 'jogador' | 'inimigo' | 'fim';

export interface EstadoBatalha {
	jogador: Combatente;
	inimigo: Combatente;
	turno: Turno;
	log: string[];
	defendendo: boolean;
	vencedor: 'jogador' | 'inimigo' | null;
	tipoBatalha?: TipoBatalha;
}

// ---------- Fábrica de estado inicial ----------

export function criarEstadoBatalha(jogador: Combatente, inimigo: Combatente, tipoBatalha: TipoBatalha = 'corredor'): EstadoBatalha {
	return {
		jogador: { ...jogador },
		inimigo: { ...inimigo },
		turno: 'jogador',
		log: [`Um ${inimigo.nome} selvagem apareceu!`],
		defendendo: false,
		vencedor: null,
		tipoBatalha
	};
}

// ---------- Store ----------

export const estadoBatalha = writable<EstadoBatalha | null>(null);

// Função de dano com suporte a multiplicadores de habilidade
function calcularDano(atacante: Combatente, alvo: Combatente, multiplicador: number = 1): { dano: number; acertou: boolean; critico: boolean } {
	const base = atacante.nome === 'Protagonista'
		? Math.floor(Math.random() * 6) + 8
		: (atacante.ataqueMin && atacante.ataqueMax
			? Math.floor(Math.random() * (atacante.ataqueMax - atacante.ataqueMin + 1)) + atacante.ataqueMin
			: atacante.ataque);

	if (Math.random() < alvo.evasao / 100) {
		return { dano: 0, acertou: false, critico: false };
	}

	const danoBruto = Math.max(1, Math.round(base * multiplicador - (alvo.defesa / 2)));
	const danoFinal = Math.min(13, Math.max(8, danoBruto));
	const chanceCritico = Math.min(40, Math.max(16, danoFinal * 2));
	const critico = Math.random() < chanceCritico / 100;
	const danoCritico = critico ? danoFinal * 2 : danoFinal;

	return { dano: danoCritico, acertou: true, critico };
}

function adicionarLog(mensagem: string) {
	estadoBatalha.update((s) => {
		if (!s) return s;
		return { ...s, log: [...s.log.slice(-5), mensagem] };
	});
}

function verificarFimDeBatalha(s: EstadoBatalha): EstadoBatalha {
	if (s.inimigo.hp <= 0) {
		return {
			...s,
			turno: 'fim',
			vencedor: 'jogador',
			log: [
				...s.log,
				`${s.inimigo.nome} foi derrotado!`,
				'Parabéns por ter vencido... mas não comemore cedo. Os desafios adiante serão muito mais cruéis. Sua morte é certa.'
			]
		};
	}
	if (s.jogador.hp <= 0) {
		return { ...s, turno: 'fim', vencedor: 'inimigo', log: [...s.log, `Você foi derrotado...`] };
	}
	return s;
}

function turnoDoInimigo() {
	estadoBatalha.update((s) => {
		if (!s || s.turno !== 'inimigo') return s;

		const resultado = calcularDano(s.inimigo, s.jogador);
		const novoHp = Math.max(0, s.jogador.hp - resultado.dano);
		const mensagem = resultado.acertou
			? `${s.inimigo.nome} atacou e causou ${resultado.dano} de dano${resultado.critico ? ' crítico' : ''}.`
			: `${s.inimigo.nome} errou o ataque.`;

		let novo: EstadoBatalha = {
			...s,
			jogador: { ...s.jogador, hp: novoHp },
			defendendo: false,
			turno: 'jogador',
			log: [...s.log, mensagem]
		};

		return verificarFimDeBatalha(novo);
	});
}

// ---------- Execução de Ações ----------

export function executarAcao(acao: AcaoBatalha) {
	const atual = get(estadoBatalha);
	if (!atual || atual.turno !== 'jogador') return;

	switch (acao) {
		case 'ataque':
		case 'golpe-de-espada': {
			const resultado = calcularDano(atual.jogador, atual.inimigo, 1.0);
			processarResultadoAtaque(resultado, 'Você desferiu um golpe de espada!', 'golpe-de-espada');
			break;
		}

		case 'punho-magico': {
			const resultado = calcularDano(atual.jogador, atual.inimigo, 1.0);
			processarResultadoAtaque(resultado, 'PUNHO MÁGICO! Uma explosão de energia atinge o inimigo!', 'punho-magico');
			break;
		}

		case 'item': {
			const pocoes = atual.jogador.itens?.pocao ?? 0;
			if (pocoes <= 0) {
				adicionarLog('Você não tem poções restantes!');
				return;
			}

			estadoBatalha.update((s) => {
				if (!s) return s;
				const recuperado = Math.min(s.jogador.hpMax, s.jogador.hp + 30);
				const novoJogador = {
					...s.jogador,
					hp: recuperado,
					itens: { ...s.jogador.itens, pocao: pocoes - 1 }
				};
				const novo: EstadoBatalha = {
					...s,
					jogador: novoJogador,
					turno: 'inimigo',
					log: [...s.log, `Você usou uma poção e recuperou vida.`]
				};
				return verificarFimDeBatalha(novo);
			});
			break;
		}

		case 'estatisticas': {
			adicionarLog(`[STATUS] Você: ${atual.jogador.hp} HP | Inimigo: ${atual.inimigo.hp} HP`);
			return;
		}

		case 'fugir': {
			const sucesso = Math.random() > 0.4;
			if (sucesso) {
				estadoBatalha.update((s) => (s ? { ...s, turno: 'fim', vencedor: null, log: [...s.log, 'Você fugiu covardemente!'] } : s));
			} else {
				estadoBatalha.update((s) => (s ? { ...s, turno: 'inimigo', log: [...s.log, 'A fuga falhou!'] } : s));
			}
			break;
		}
	}

	// Se o turno mudou para o inimigo, agendar o ataque dele
	const depois = get(estadoBatalha);
	if (depois && depois.turno === 'inimigo') {
		setTimeout(turnoDoInimigo, 1000);
	}
}

// Função auxiliar para atualizar o estado após um ataque do jogador
function processarResultadoAtaque(resultado: any, mensagemBase: string, acao: AcaoBatalha) {
	estadoBatalha.update((s) => {
		if (!s) return s;
		const novoHpInimigo = Math.max(0, s.inimigo.hp - resultado.dano);
		let novoJogador = s.jogador;
		let mensagemFinal = resultado.acertou
			? `${mensagemBase} Dano: ${resultado.dano}${resultado.critico ? ' (CRÍTICO!)' : ''}`
			: 'Seu ataque falhou miseravelmente.';

		if (s.tipoBatalha === 'saida-mausoleum' && acao === 'golpe-de-espada' && !s.jogador.habilidades?.recuoBloqueado) {
			if (resultado.acertou && resultado.dano > 0) {
				const danoRecuo = Math.max(1, Math.round(resultado.dano * 0.4));
				novoJogador = { ...s.jogador, hp: Math.max(0, s.jogador.hp - danoRecuo) };
				mensagemFinal += ` Você recebeu ${danoRecuo} de dano de recuo.`;
			}
		}

		if (s.tipoBatalha === 'saida-mausoleum' && acao === 'punho-magico' && resultado.acertou) {
			novoJogador = {
				...s.jogador,
				habilidades: {
					...s.jogador.habilidades,
					recuoBloqueado: true
				}
			};
			mensagemFinal += ' O recuo foi neutralizado pelo soco mágico.';
		}

		const novoEstado: EstadoBatalha = {
			...s,
			jogador: novoJogador,
			inimigo: { ...s.inimigo, hp: novoHpInimigo },
			turno: 'inimigo',
			log: [...s.log, mensagemFinal]
		};
		return verificarFimDeBatalha(novoEstado);
	});
}