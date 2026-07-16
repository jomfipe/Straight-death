import { writable } from 'svelte/store';
import { playerConfig } from '$lib/entities/player';
import { chest } from '$lib/entities/chest';

export type MausoleumDirection = 'front' | 'back' | 'left' | 'right';

export type MausoleumState = {
	x: number;
	y: number;
	direction: MausoleumDirection;
	chestOpen: boolean;
	mostrarEspada: boolean;
	chestSprite: string;
	npcVisible: boolean;
	dialogVisible: boolean;
};

const storageKey = 'mausoleum-state';

const initialState: MausoleumState = {
	x: playerConfig.x,
	y: playerConfig.y,
	direction: 'back',
	chestOpen: false,
	mostrarEspada: false,
	chestSprite: chest.spriteClosed,
	npcVisible: true,
	dialogVisible: false
};

const mausoleumState = writable<MausoleumState>(initialState);

if (typeof window !== 'undefined') {
	mausoleumState.subscribe(state => {
		window.localStorage.setItem(storageKey, JSON.stringify(state));
	});
}

export { mausoleumState };

export function updateMausoleumState(partial: Partial<MausoleumState>) {
	mausoleumState.update(state => ({ ...state, ...partial }));
}

export function resetMausoleumState() {
	mausoleumState.set(initialState);
}
