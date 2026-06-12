import { chest } from '$lib/entities/chest';
import { npc } from '$lib/entities/npc';

export function colidiuWithChest(
	newX: number,
	newY: number
): boolean {
	const playerSize: number = 64;

	return (
		newX < chest.x + chest.hitbox.offsetX + chest.hitbox.width &&
		newX + playerSize > chest.x + chest.hitbox.offsetX &&
		newY < chest.y + chest.hitbox.offsetY + chest.hitbox.height &&
		newY + playerSize > chest.y + chest.hitbox.offsetY
	);
}

export function colidiuWithNpc(
	newX: number,
	newY: number
): boolean {
	const playerSize = 64;

	return (
		newX < npc.x + npc.hitbox.offsetX + npc.hitbox.width &&
		newX + playerSize > npc.x + npc.hitbox.offsetX &&
		newY < npc.y + npc.hitbox.offsetY + npc.hitbox.height &&
		newY + playerSize > npc.y + npc.hitbox.offsetY
	);
}
