import { estadoBatalha } from '$lib/entities/battle';
import { resetCorridorState } from '$lib/stores/corridor';
import { resetMausoleumState } from '$lib/stores/mausoleum';
import { resetSaidaMausoleumState } from '$lib/stores/saidaMausoleum';

export function resetGameState(): void {
	resetCorridorState();
	resetMausoleumState();
	resetSaidaMausoleumState();
	estadoBatalha.set(null);

	if (typeof window !== 'undefined') {
		window.localStorage.removeItem('saida-mausoleum-chest');
		window.localStorage.removeItem('saida-mausoleum-enemy-defeated');
		window.localStorage.removeItem('saida-mausoleum-player-state');
		window.localStorage.removeItem('saida-mausoleum-state');
		window.localStorage.removeItem('mausoleum-state');
	}
}
