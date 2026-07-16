import { writable } from 'svelte/store';

export type SaidaMausoleumState = {
	playerX: number;
	playerY: number;
	direction: 'front' | 'back' | 'left' | 'right';
	enemyDefeated: boolean;
	chestOpen: boolean;
	chestSprite: string | null;
};

const defaultState: SaidaMausoleumState = {
	playerX: 96,
	playerY: 432,
	direction: 'back',
	enemyDefeated: false,
	chestOpen: false,
	chestSprite: null
};

const saidaMausoleumState = writable<SaidaMausoleumState>(defaultState);

export { saidaMausoleumState };

export function updateSaidaMausoleumState(partial: Partial<SaidaMausoleumState>) {
	saidaMausoleumState.update(state => ({ ...state, ...partial }));
}

export function resetSaidaMausoleumState() {
	saidaMausoleumState.set(defaultState);
}
