import { writable } from 'svelte/store';

export type CorridorState = {
	playerX: number;
	playerY: number;
	enemyDefeated: boolean;
};

const defaultState: CorridorState = {
	playerX: 152,
	playerY: 601,
	enemyDefeated: false
};

const corridorState = writable<CorridorState>(defaultState);

export { corridorState };

export function updateCorridorState(partial: Partial<CorridorState>) {
	corridorState.update(state => ({ ...state, ...partial }));
}

export function resetCorridorState() {
	corridorState.set(defaultState);
}
