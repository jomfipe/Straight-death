interface Hitbox {
	offsetX: number;
	offsetY: number;
	width: number;
	height: number;
}

interface ChestObject {
	x: number;
	y: number;
	spriteClosed: string;
	spriteOpen: string;
	hitbox: Hitbox;
}

export const chest: ChestObject = {
	x: 220,
	y: 415,
	spriteClosed: "/images/Sprites/png/objects/Chest.png",
	spriteOpen: "/images/Sprites/png/objects/Chest-open.png",
	hitbox: {
		offsetX: 1,
		offsetY: 2,
		width: 30,
		height: 20
	}
};